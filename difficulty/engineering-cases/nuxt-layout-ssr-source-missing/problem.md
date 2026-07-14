# Nuxt 3 使用 NuxtLayout 后 SSR 源代码缺失

> 衍生内容：[Nuxt 3 SSR、Vue Runtime 与依赖树面试题](./interview-questions.md)

## 问题

- Nuxt 3 项目的首页在浏览器中能够正常显示，但访问 `/en` 并查看网页源代码时，看不到 `pages/index.vue` 的首页正文，存在搜索引擎无法抓取核心内容的 SEO 风险。
- 将 `index.vue` 简化为只有一个 `<h1>` 后仍能复现：
  - `app.vue` 只使用 `<NuxtPage />` 时，SSR HTML 可以正常输出 `<h1>`。
  - 使用 `<NuxtLayout><NuxtPage /></NuxtLayout>` 时，SSR 源代码中的页面内容消失。
  - 即使将 `layouts/default.vue` 简化到只剩 `<slot />`，问题仍然存在。

## 排查过程

1. 检查 Nuxt SSR 配置、i18n 路由策略和服务端重定向，确认项目没有配置 `ssr: false`，`/en` 也确实对应 `pages/index.vue`。
2. 将首页缩减到单个 `<h1>`，排除首页业务组件、图片资源、交互逻辑和数据结构对 SSR 的影响。
3. 将默认布局缩减到单个 `<slot />`，排除 Header、Footer、Swiper、i18n 文案等布局内部业务逻辑。
4. 通过对照实验将问题锁定到 `NuxtLayout` 的动态布局加载链路。`NuxtLayout` 内部会使用 `defineAsyncComponent`、`Suspense`、`provide/inject` 和 SSR slot context，比直接渲染 `NuxtPage` 多了一层异步组件边界。
5. 执行 `npm ls vue @vue/server-renderer` 检查依赖树，发现项目同时存在两套 Vue Runtime：
   - 项目根目录使用 `vue@3.5.13` 和 `@vue/server-renderer@3.5.13`。
   - Nuxt 依赖目录内使用 `vue@3.5.19` 和 `@vue/server-renderer@3.5.19`。
6. 两套 Vue Runtime 会分别维护 `currentInstance`、SSR context、`Suspense` 异步依赖计数、`provide/inject` 上下文和 VNode 状态。直接渲染 `NuxtPage` 时没有明显触发跨 Runtime 边界；`NuxtLayout` 通过 `Suspense` 异步加载布局时，两套 Runtime 的组件实例和 SSR 上下文不一致，导致布局 slot 没有正常输出。
7. 同时检查 `.nuxt/dist/server` 编译产物，发现源文件已经简化，但运行实例仍在加载修改前的旧 layout chunk。这说明 Nuxt 编译缓存也干扰了定位结果。

## npm 依赖树和 Vue 的加载规则

### 为什么 npm 会安装两套 Vue

- 项目根目录在 `package.json` 中明确锁定了 `vue@3.5.13`，大部分业务依赖的 peer dependency 都可以由这个版本满足，例如 Pinia、Vue Router、Vue I18n、Ant Design Vue、VueUse 和 vuedraggable。
- Nuxt 的依赖子树中，`@unhead/vue` 要求 `vue >= 3.5.18`，根目录的 `vue@3.5.13` 不满足这个范围。
- npm 不能将不兼容的依赖强行去重，因此在 Nuxt 的子目录内再安装了一套 `vue@3.5.19`。

```text
项目锁定 vue@3.5.13
        ↓
满足大部分业务依赖

Nuxt 子树中 @unhead/vue 要求 vue >= 3.5.18
        ↓
根 Vue 不满足约束，npm 无法 dedupe
        ↓
node_modules/nuxt/node_modules/vue@3.5.19
```

- Vue 本身依赖同版本的 `@vue/server-renderer`，所以两套 Vue 也会带来两套 SSR renderer：

```text
node_modules/vue@3.5.13
└─ @vue/server-renderer@3.5.13

node_modules/nuxt/node_modules/vue@3.5.19
└─ @vue/server-renderer@3.5.19
```

### Node 如何决定当前模块加载哪一层 Vue

- Node 解析 `import ... from 'vue'` 时，不是统一从项目根目录查找，而是从“发起 import 的文件所在目录”开始，逐级向上查找最近的 `node_modules/vue`。
- 业务文件位于项目目录，例如 `app.vue`、`pages/index.vue`、`layouts/default.vue` 和普通组件，它们编译后的 `import 'vue'` 会先命中根目录的 `node_modules/vue@3.5.13`。
- `NuxtLayout`、`LayoutProvider` 和 Nuxt 内部的布局加载器位于 `node_modules/nuxt/dist/...`，它们发起 `import 'vue'` 时，会先命中更近的 `node_modules/nuxt/node_modules/vue@3.5.19`。

```text
/project/pages/index.vue
  → /project/node_modules/vue@3.5.13

/project/layouts/default.vue
  → /project/node_modules/vue@3.5.13

/project/node_modules/nuxt/dist/app/components/nuxt-layout.js
  → /project/node_modules/nuxt/node_modules/vue@3.5.19
```

- 因此“同一个项目使用 Vue”并不代表运行时只有一个 Vue。不同文件可能因为所在目录不同，解析到不同物理路径下的 Vue 模块。
- 即使两个 Vue 的版本号相同，只要物理上加载了两份模块，就仍可能有两套 `currentInstance`、SSR context、`Suspense` 状态和内部 Symbol。所以修复目标不仅是版本号相同，还要通过 dedupe 让所有依赖共用同一个物理 Vue 实例。

### 编译、SSR 和客户端阶段的差异

- 业务 `.vue` 文件编译后会引用 `defineComponent`、`ref`、`computed` 等 Vue API，当时主要解析根目录 Vue。
- Nuxt 内部组件可能作为 Node external dependency 保留，SSR 运行时再按 Node 的就近查找规则加载 Nuxt 子树中的 Vue，因此服务端更容易出现两套 Runtime 并存。
- Vite 在客户端打包阶段可能通过 alias、预构建或 dedupe 将部分 Vue 引用合并；即使首次 SSR 失败，客户端 JavaScript 也可能在加载后重新渲染页面。
- 因此会出现“浏览器最终 DOM 有内容，但查看网页源代码没有内容”的现象：前者可能是客户端后续渲染的结果，后者才是服务端首次返回的 HTML。

## NuxtLayout 放在 app.vue 和 index.vue 的渲染流程差异

### NuxtLayout 放在 app.vue：布局先于页面渲染

```vue
<!-- app.vue -->
<NuxtLayout>
  <NuxtPage />
</NuxtLayout>
```

```text
App
└─ NuxtLayout
   └─ Layout Suspense
      └─ Async default.vue
         └─ default slot
            └─ NuxtPage
               └─ Page Suspense
                  └─ pages/index.vue
                     └─ h1
```

- Nuxt 需要先根据 `route.meta.layout` 确定布局，通过 `defineAsyncComponent` 加载 `default.vue`，并由外层 Layout `Suspense` 等待布局就绪。
- 布局就绪后才会消费 default slot，然后进入 `NuxtPage` 的页面匹配和 Page `Suspense`。
- 这种结构是 `Layout Suspense` 包裹 `Page Suspense`。如果外层布局由 Nuxt 子树的 Vue 3.5.19 创建，而内层页面或 slot 由根 Vue 3.5.13 参与创建，就会在“外层布局等待并消费内层页面”时触发跨 Runtime 问题。
- 一旦 Layout `Suspense`、SSR context 或 slot 提交失败，`NuxtPage` 还没有完成渲染，所以 `index.vue` 中的 `<h1>` 不会进入最终 SSR HTML。

### NuxtLayout 放在 index.vue：页面先于布局渲染

```vue
<!-- app.vue -->
<NuxtPage />

<!-- pages/index.vue -->
<NuxtLayout>
  <h1>hello</h1>
</NuxtLayout>
```

```text
App
└─ NuxtPage
   └─ Page Suspense
      └─ pages/index.vue
         └─ NuxtLayout
            └─ Layout Suspense
               └─ Async default.vue
                  └─ h1
```

- `NuxtPage` 首先完成路由匹配、建立页面 SSR 上下文并创建 `index.vue`，之后才会执行页面内部的 `NuxtLayout`。
- 这种结构是 Page `Suspense` 包裹 Layout `Suspense`，与标准根布局写法的嵌套顺序相反。
- 页面组件和路由上下文已经先成功建立，再将 `<h1>` 作为页面内部布局的 slot 传入，改变了跨 Runtime 异步边界被触发的时机，因此当时可以正常输出。
- 这只是改变组件树后绕过了同一个 bug，不能证明两套 Vue Runtime 可以安全共存。

### 两种写法的其他差异

- `NuxtLayout` 放在 `app.vue` 时，使用的是 Nuxt 标准布局链路，页面可以通过 `definePageMeta({ layout: 'workspace' })` 选择布局，布局独立于页面的 keep-alive 生命周期。
- `NuxtLayout` 放在 `index.vue` 时，每个页面需要自己包装布局，并且布局会进入页面的 keep-alive 树，页面切换、layout transition、`onActivated` 和 `onDeactivated` 的行为都可能改变。
- 因此页面内包装 `NuxtLayout` 可以用作定位问题的对照实验，但不应作为最终架构修复。最终仍应统一 Vue Runtime，然后恢复 `app.vue` 中的标准 `NuxtLayout > NuxtPage` 结构。

### 两种写法的核心对比

| 对比项 | NuxtLayout 在 app.vue | NuxtLayout 在 index.vue |
| --- | --- | --- |
| 组件嵌套 | Layout 包裹 Page | Page 包裹 Layout |
| 外层异步边界 | Layout Suspense | Page Suspense |
| 执行顺序 | 先加载布局，再渲染页面 | 先创建页面，再加载布局 |
| 路由上下文 | Layout 在 NuxtPage 外部读取当前 route | Layout 处于 NuxtPage 已建立的页面上下文内 |
| Vue 冲突触发点 | 外层 Layout Runtime 等待并消费内层 Page Runtime | Page 先建立，改变了跨 Runtime 触发顺序 |
| 是否为 Nuxt 推荐结构 | 是 | 否，更适合诊断和特殊嵌套布局 |

## 解决方案与结果

- 将项目根目录的 Vue 版本从 `3.5.13` 统一为 Nuxt 当前使用的 `3.5.19`，确保 `vue` 与 `@vue/server-renderer` 版本一致。
- 通过 `npm install` 和 `npm dedupe` 收敛依赖树，让 Nuxt、Pinia、Vue Router、Vue I18n 和业务组件共用同一个 Vue Runtime。
- 移除 Vue 3 不再需要的 Vue 2 历史类型包 `@types/vue` 和 `@types/vue-i18n`，减少类型声明和 peer dependency 干扰。
- 清理 `.nuxt` 编译缓存并重新启动开发服务，确保默认布局使用最新编译产物。
- 恢复 `<NuxtLayout><NuxtPage /></NuxtLayout>` 后，`/en` 的原始 HTML 能够正常包含首页正文，恢复 SSR 和 SEO 抓取能力。

## 总结

- 在 Nuxt SSR 项目中，“浏览器能显示”不代表“服务端已渲染”，需要同时检查 HTTP 原始响应和网页源代码。
- 复杂 SSR 问题可以通过“最小化页面 → 最小化布局 → 对比渲染链路 → 检查编译产物 → 检查依赖树”的方式逐层收缩范围。
- Vue 版本号一致还不够，最终应确保整个运行时只有一个 Vue 模块实例；对使用 `Suspense`、异步组件和 SSR context 的框架链路尤其重要。
- 这次问题的关键不是修改业务代码，而是通过可重复的对照实验将问题从首页内容层精确定位到 Nuxt 布局的异步渲染边界，再用依赖树和编译产物完成根因验证。
