# 前端面试题与参考答案

## 专题：Nuxt 3 SSR、Vue Runtime 与依赖树

> 来源：[Nuxt 3 使用 NuxtLayout 后 SSR 源代码缺失](./problem.md)。以下问题由该真实工程案例拆解而来。
>
> 本文件与原始问题位于同一案例目录，用于表达“真实问题 → 原理拆解 → 面试题”的对应关系。
>
> 原始现象：页面在浏览器中可以正常显示，但 `/en` 的原始 HTML 中没有 `pages/index.vue` 正文；只使用 `<NuxtPage />` 时 SSR 正常，使用 `<NuxtLayout><NuxtPage /></NuxtLayout>` 时正文缺失。最终发现项目根目录的 `vue@3.5.13` 与 Nuxt 子树的 `vue@3.5.19` 并存，导致 `NuxtLayout` 的异步布局、`Suspense` 和 SSR 上下文跨 Vue Runtime 工作异常。

### 一、SSR、CSR 与 Hydration

#### 1. 页面在浏览器中能够正常显示，但“查看网页源代码”没有正文，可能是什么原因？

**考察点：** SSR、CSR、Hydration、原始 HTML、SEO。

**参考答案：**

- 浏览器 Elements 面板展示的是经过客户端 JavaScript 水合或重新渲染后的 DOM；“查看网页源代码”展示的是服务器第一次返回的 HTML。
- 页面最终可见但源代码没有正文，通常说明 SSR 没有输出正文，内容由客户端 JavaScript 后续渲染，或者服务端返回了 SPA fallback。
- 还需要排查 `ssr: false`、路由级 `ssr: false`、`ClientOnly`、SSR 500、重定向、Nginx/CDN fallback、缓存和服务端接口异常。
- 应通过 `curl -i URL` 检查原始状态码、响应头和 HTML，不能只看浏览器最终画面。

#### 2. SSR、CSR 和 Hydration 分别是什么？

**参考答案：**

- SSR：服务端执行组件并生成 HTML，浏览器收到响应后即可展示主要内容。
- CSR：浏览器下载 JavaScript 后，在客户端创建页面 DOM。
- Hydration：客户端复用服务端生成的 HTML，为其绑定事件和响应式状态，使静态 HTML 变得可交互。

```text
正常 SSR：服务端 HTML → 浏览器展示 → 下载 JS → Hydration
SSR 失败：HTML 空壳 → 下载 JS → 客户端重新渲染页面
```

#### 3. 如何验证一个 Nuxt 页面是否真正完成 SSR？

**参考答案：**

```bash
curl -i http://localhost:3000/en
curl -s http://localhost:3000/en | rg "页面核心正文"
```

需要确认：

- 状态码为 200。
- `Content-Type` 为 `text/html`。
- 原始响应包含正文。
- 没有重定向。
- 不是 SPA fallback 或代理错误页。
- 正文在客户端 JavaScript 执行前已经存在。

### 二、NuxtLayout 与 NuxtPage

#### 4. `NuxtLayout` 和 `NuxtPage` 分别负责什么？

**参考答案：**

- `NuxtPage` 根据当前路由渲染 `pages/` 下匹配的页面。
- `NuxtLayout` 根据 `route.meta.layout` 选择并加载 `layouts/` 下的布局；没有指定时通常使用 `default.vue`。
- 标准结构为：

```vue
<NuxtLayout>
  <NuxtPage />
</NuxtLayout>
```

#### 5. 为什么 `NuxtLayout` 不是一个简单的普通组件？

**参考答案：**

`NuxtLayout` 需要完成：

- 读取路由元信息并选择布局。
- 动态导入布局文件。
- 使用 `defineAsyncComponent` 和 `Suspense` 等待布局。
- 提供 layout context。
- 处理 layout transition 和 hydration defer。
- 将 `NuxtPage` 作为 slot 传给布局。

```text
route.meta.layout
→ LayoutProvider
→ LayoutLoader
→ Async default.vue
→ Suspense
→ default slot
→ NuxtPage
```

#### 6. `NuxtLayout` 放在 `app.vue` 和放在 `index.vue` 中有什么区别？

**参考答案：**

放在 `app.vue`：

```text
App
└─ NuxtLayout
   └─ Layout Suspense
      └─ Async Layout
         └─ NuxtPage
            └─ Page Suspense
               └─ index.vue
```

执行顺序是先加载布局，再渲染页面，即 Layout Suspense 包裹 Page Suspense。

放在 `index.vue`：

```text
App
└─ NuxtPage
   └─ Page Suspense
      └─ index.vue
         └─ NuxtLayout
            └─ Layout Suspense
               └─ Async Layout
```

执行顺序是先创建页面和页面上下文，再加载页面内部布局，即 Page Suspense 包裹 Layout Suspense。

两种结构会影响异步边界、路由上下文建立时机、KeepAlive 范围、layout transition 和生命周期。页面内使用布局可以作为对照实验，但不能代替标准根布局结构。

### 三、Vue Runtime 多实例问题

#### 7. 同一个项目中存在两套 Vue Runtime 会有什么风险？

**参考答案：**

每套 Vue Runtime 都独立维护：

- `currentInstance` 和 `currentRenderingInstance`。
- effect scope。
- SSR context。
- `Suspense` 状态和异步依赖计数。
- `provide/inject` 上下文。
- hydration 状态。
- 内部 Symbol、缓存及 VNode 与组件实例的关系。

跨 Runtime 创建和渲染组件可能造成 `inject` 失败、SSR context 丢失、Suspense 无法完成、slot 不输出、生命周期异常或 hydration mismatch。

#### 8. 如果两套 Vue 的版本号相同，还会有问题吗？

**参考答案：**

可能有问题。Node 按解析后的物理文件路径缓存模块：

```text
/project/node_modules/vue
/project/node_modules/package-a/node_modules/vue
```

即使二者都是 `vue@3.5.19`，仍会初始化成两个 Runtime，并分别维护内部状态。最终不仅要统一版本号，还要让所有依赖解析到同一个物理模块。

#### 9. 为什么 `vue` 与 `@vue/server-renderer` 必须保持版本一致？

**参考答案：**

`@vue/server-renderer` 会直接处理 Vue 生成的 VNode、组件实例、Suspense 和 SSR context。版本不一致可能导致内部结构、特性标志和渲染逻辑不匹配，产生 SSR 输出缺失、Suspense 异常或 hydration mismatch。

理想状态：

```text
vue@3.5.19
@vue/server-renderer@3.5.19
```

### 四、Suspense 与异步组件

#### 10. Vue `Suspense` 的作用是什么？

**参考答案：**

`Suspense` 用于协调组件树中的异步依赖，例如 `async setup`、异步组件和 Nuxt 页面/布局的动态加载。

```text
异步组件开始 → pending + 1
异步组件完成 → pending - 1
pending = 0 → 提交最终内容
```

SSR renderer 需要等待 Suspense 内的异步依赖完成，才能生成最终 HTML。

#### 11. 为什么多 Vue Runtime 容易在 Suspense 边界暴露问题？

**参考答案：**

如果 Runtime A 创建 Suspense，而 Runtime B 创建异步子组件，Runtime B 的异步任务可能无法登记到 Runtime A 的 Suspense，完成后也无法通知正确的边界，可能导致 Suspense 一直等待、提前完成或最终 slot 未提交。普通静态组件链路可能暂时正常，进入异步边界后问题更容易暴露。

#### 12. `async setup` 在 SSR 中如何处理？

**参考答案：**

服务端 renderer 需要等待 `async setup` 返回的 Promise 后才能渲染组件。在 Nuxt 中，顶层 `await`、`useAsyncData`、`useFetch` 和异步布局都可能成为 Suspense 依赖。如果异步请求抛出未处理异常，可能导致 SSR 500、正文不输出，之后再由客户端补渲染。

### 五、npm 依赖树与 Peer Dependency

#### 13. npm 为什么会在项目中安装多个版本的同一个包？

**参考答案：**

当不同依赖要求的版本范围没有公共交集时，npm 无法让它们复用同一版本，只能安装嵌套依赖。例如：

```text
根项目固定 vue@3.5.13
Nuxt 子依赖要求 vue >= 3.5.18
```

最终可能产生：

```text
node_modules/vue@3.5.13
node_modules/nuxt/node_modules/vue@3.5.19
```

#### 14. `dependencies` 和 `peerDependencies` 有什么区别？

**参考答案：**

- `dependencies` 表示包运行时直接需要的依赖，包管理器会为其安装。
- `peerDependencies` 表示包要求宿主项目提供一个兼容版本，常用于 Vue 插件、UI 库和状态管理库。
- Pinia 等库应该使用宿主应用的 Vue，而不是携带独立 Vue，这样才能共享组件实例、响应式系统和应用上下文。

#### 15. `npm dedupe` 做了什么？

**参考答案：**

`npm dedupe` 尝试将兼容的嵌套依赖提升到更高层级，让多个包复用同一依赖。但它不会违反语义版本约束。如果根项目固定 `vue@3.5.13`，而子依赖要求 `vue >= 3.5.18`，仅执行 dedupe 无法解决，必须先统一版本范围。

#### 16. 如何检查一个包为什么被安装？

**参考答案：**

```bash
npm ls vue @vue/server-renderer
npm explain vue@3.5.13
npm explain vue@3.5.19
```

- `npm ls` 查看依赖树和重复版本。
- `npm explain` 查看某个包/版本由谁引入、为什么存在。

### 六、Node 模块解析

#### 17. Node 如何解析 `import 'vue'`？

**参考答案：**

Node 从发起 import 的模块所在目录开始，逐级向上寻找最近的 `node_modules/vue`。

```text
/project/pages/index.vue
  → /project/node_modules/vue

/project/node_modules/nuxt/dist/app/components/nuxt-layout.js
  → /project/node_modules/nuxt/node_modules/vue
```

因此，同一进程中的不同模块可能解析到不同 Vue。

#### 18. Node 的模块缓存能避免加载两套 Vue 吗？

**参考答案：**

不能。Node 按解析后的文件路径缓存模块。两个不同物理路径即使内容和版本相同，也会生成两个缓存实例。

#### 19. 如何验证业务代码和 Nuxt 是否解析到同一套 Vue？

**参考答案：**

```bash
node -p "require.resolve('vue')"
```

从 Nuxt 上下文解析：

```bash
node -e "
const { createRequire } = require('module');
const requireFromNuxt = createRequire(require.resolve('nuxt/package.json'));
console.log('root:', require.resolve('vue'));
console.log('nuxt:', requireFromNuxt.resolve('vue'));
"
```

两个结果应指向同一个物理路径。

### 七、Nuxt 编译缓存与运行产物

#### 20. 为什么修改了 `layouts/default.vue`，运行结果仍可能是旧内容？

**参考答案：**

Nuxt 会在 `.nuxt` 中生成 layout mapping、server/client chunk、样式映射和异步 import 映射。如果 HMR 没有正确刷新动态布局，运行实例可能继续引用旧 chunk。可以比较源文件与 `.nuxt/dist/server` 产物的时间和内容，再决定是否清理缓存。

#### 21. 什么时候应该清理 `.nuxt`？

**参考答案：**

常见场景：

- 修改 Nuxt module、i18n 或路由配置。
- 修改 layouts 后动态加载仍使用旧内容。
- 修改核心依赖版本。
- 自动导入或 server/client 产物不一致。
- 有证据证明缓存产物与源文件不一致。

```bash
rm -rf .nuxt
npm run dev
```

不应把清缓存当成所有问题的默认答案，应先建立缓存异常证据。

### 八、工程化排障能力

#### 22. 面对复杂 SSR 问题，如何设计最小化复现？

**参考答案：**

每一步只改变一个变量：

```text
复杂首页
→ 页面只保留 h1
→ 移除页面请求
→ default layout 只保留 slot
→ 移除 NuxtLayout
→ 对比 NuxtPage 与 NuxtLayout + NuxtPage
```

通过控制变量判断问题属于页面内容层、布局内容层、Nuxt布局机制、异步请求、SSR renderer、路由还是依赖树。

#### 23. 为什么对照实验比直接阅读全部代码更有效？

**参考答案：**

大型项目中影响 SSR 的因素很多，直接阅读所有代码难以建立因果关系。对照实验可以得出明确结论，例如“NuxtPage 正常、NuxtLayout + NuxtPage 异常”，从而一次排除大量无关业务逻辑，把注意力集中到两条渲染路径的差异。

#### 24. 如何证明根因确实是多 Vue Runtime，而不是碰巧修好了？

**参考答案：**

需要完整证据链：

1. 最小复现证明页面内容和布局业务不是原因。
2. `NuxtPage` 与 `NuxtLayout` 对照证明问题位于布局异步边界。
3. `npm ls` 证明存在两个 Vue 版本。
4. `require.resolve` 证明 Vue 来自不同物理路径。
5. 检查 `NuxtLayout` 实现，确认它使用 Suspense 和异步组件。
6. 统一版本并 dedupe 后，依赖树只剩一个 Vue。
7. 恢复标准结构后 SSR 恢复。
8. 使用 `curl` 验证正文进入原始 HTML。
9. 恢复完整业务首页后问题不再出现。

### 九、不同职级的提问组合

#### 初级前端

1. SSR、CSR 和 Hydration 的区别是什么？
2. Elements 和网页源代码为什么可能不同？
3. `NuxtPage` 和 `NuxtLayout` 分别负责什么？
4. 如何判断一个页面是否真正完成 SSR？
5. `dependencies` 与 `peerDependencies` 有什么区别？

#### 中级前端

1. 如何最小化复现 SSR 内容缺失？
2. 为什么 `NuxtLayout` 放在不同层级表现可能不同？
3. npm 为什么会安装两套 Vue？
4. Node 如何解析 `import 'vue'`？
5. `npm dedupe` 的工作原理是什么？
6. 如何验证实际加载的是哪一套 Vue？

#### 高级前端

1. 两套 Vue Runtime 为什么会影响 Suspense 和 SSR context？
2. 相同版本但不同物理路径是否有风险？
3. Vite 客户端与 Node SSR 的依赖解析为什么可能不同？
4. 如何建立完整的根因证据链？
5. 如何在 CI 中防止多 Vue Runtime 再次出现？
6. 如何制定依赖升级和 lockfile 管理策略？

### 十、正式面试推荐题组

如果只选 6 道题，可以使用以下组合：

1. 页面在浏览器中正常，但原始 HTML 没有正文，你如何判断是 SSR、CSR、代理还是缓存问题？
2. `NuxtLayout` 内部为什么需要 Suspense？它与 `NuxtPage` 的嵌套关系是什么？
3. 为什么 `NuxtLayout` 放在 `app.vue` 和放在 `index.vue` 中可能表现不同？
4. npm 在什么情况下会安装两套 Vue？`peerDependencies` 在这里起什么作用？
5. Node 如何决定一个模块最终加载哪一个 `node_modules/vue`？
6. 如果判断根因是多 Vue Runtime，如何通过实验、依赖树、模块解析路径和原始 HTTP 响应完成证明？
