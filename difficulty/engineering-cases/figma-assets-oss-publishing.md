# Figma 静态资源 OSS 自动化发布流程

## 问题背景

项目中包含大量从 Figma 导出的 PNG、SVG、WebP 等静态图片，开发阶段统一临时存放在：

```text
public/figma-assets/
```

最初采用人工方式上传 OSS，再逐个修改 Vue、TypeScript 和样式文件中的本地引用。随着页面和图片数量增加，这套流程出现了明显问题：

- 图片数量多，人工上传容易遗漏。
- 本地目录使用 PascalCase 或 camelCase，而 OSS 目录要求 kebab-case，容易写错路径。
- 只上传某个子目录时，如果直接修改资源根目录，容易丢失上级目录层级。
- 无法可靠判断远程是否已有同名资源，存在覆盖线上对象的风险。
- 上传后需要在多个源码文件中手动查找和替换引用。
- 上传成功但引用替换不完整时，删除本地图片会导致页面资源失效。
- 使用本地 TXT 台账记录上传状态时，台账可能与 OSS 实际状态不一致。

目标是将资源发现、路径转换、远程判重、安全上传、上传验证和源码引用替换收敛为一个可追踪的自动化流程。

## 最终方案

基于 Node.js 和 `ali-oss` 实现静态资源自动发布工具，通过一条命令完成指定范围内的资源发布：

```bash
npm run assets:publish
```

不传参数时处理 `public/figma-assets/` 下的全部图片；也支持目录级和单文件级发布：

```bash
npm run assets:publish -- AboutReach
npm run assets:publish -- AboutReach/au.svg
```

整体流程为：

```text
解析发布范围
→ 获取全部图片及相对路径
→ 生成标准 OSS Key 和公开 URL
→ 检查本批资源路径冲突
→ 逐张查询远程对象
→ 不存在时安全上传并验证
→ 替换项目静态引用
→ 输出逐图片日志和最终汇总
```

## 一、固定资源根目录

工具始终以以下路径作为资源根目录：

```text
public/figma-assets/
```

发布子目录时通过命令参数选择范围，不修改 `ASSET_ROOT`：

```bash
npm run assets:publish -- AboutReach
```

这样即使只发布一个子目录，仍然会基于总资源根目录计算完整的 `localPath`：

```text
AboutReach/au.svg
```

避免将文件错误上传为：

```text
post-scheduler/public/au.svg
```

## 二、统一 OSS 路径映射

本地路径：

```text
public/figma-assets/AboutReach/au.svg
```

OSS Key：

```text
post-scheduler/public/about-reach/au.svg
```

最终公开地址：

```text
https://standalones.oss-us-east-1.aliyuncs.com/post-scheduler/public/about-reach/au.svg
```

目录名统一从 PascalCase 或 camelCase 转换为 kebab-case，文件名保持不变：

```text
AboutReach → about-reach
aboutReach → about-reach
WorkspaceAiAssistant → workspace-ai-assistant
```

## 三、本批资源路径冲突检查

不同的本地路径经过格式转换后，可能映射到同一个 OSS Key，例如：

```text
AboutReach/au.svg
aboutReach/au.svg
```

最终都会得到：

```text
post-scheduler/public/about-reach/au.svg
```

工具在远程查询和上传前，通过 `assertNoOssKeyCollisions` 一次性计算本批资源的 OSS Key，并检查是否存在重复映射。发现冲突时立即终止，避免同批资源互相覆盖。

## 四、OSS 作为唯一事实来源

早期方案使用 TXT 文件保存已经上传的 `localPath`，但本地台账会引入两个事实来源：

```text
本地 TXT 记录
OSS 实际对象
```

两者可能出现以下不一致：

- OSS 已存在，但本地没有记录。
- 本地有记录，但 OSS 对象已被删除。
- 上传成功后忘记更新台账。
- 上传过程中断，台账只反映了部分状态。
- 多人协作时，本地记录没有及时同步。

最终移除本地台账，以 OSS 远程对象作为资源是否已发布的唯一事实来源。

工具直接对最终公开 URL 发起 `HEAD` 请求：

```text
200 → 远程对象已经存在
404 → 远程对象不存在，可以上传
403、网络错误或其他状态 → 查询异常，停止流程
```

只有明确返回 `404` 时才认为资源不存在，避免把权限异常或网络异常误判成可以上传。

使用最终公开 URL 检查还有两个好处：

- 不依赖临时 STS 凭证的 `HeadObject` 权限。
- 验证的是浏览器和最终用户真正访问的资源地址。

## 五、逐图片执行发布

获取指定范围内的全部图片后，工具按照图片逐个串行执行：

```text
当前图片
→ 查询最终公开 URL
→ 已存在：记录为远程重复，不上传
→ 不存在：上传并再次验证公开 URL
→ 查找并替换该图片的静态引用
→ 打印替换次数和涉及文件
→ 继续下一张图片
```

远程文件已存在时不会将整个任务视为失败，而是：

1. 将该图片记录到远程重复清单。
2. 跳过上传，禁止覆盖。
3. 继续将项目中的本地引用替换成已有的 OSS URL。
4. 继续处理下一张图片。

## 六、服务端防覆盖

远程查询和实际上传之间存在短暂的竞态窗口：查询结束后，可能有另一个任务上传了相同对象。

因此上传请求增加 OSS 条件：

```text
x-oss-forbid-overwrite: true
```

即使两个任务并发发布同一个 OSS Key，OSS 服务端也会拒绝后到的覆盖请求，避免只依赖客户端的“先查询、后上传”。

## 七、上传后验证

上传完成后不会立即修改源码，而是再次访问最终公开 URL：

```text
上传完成
→ HEAD 最终公开 URL
→ 返回 200
→ 才允许替换源码引用
```

如果上传失败、对象暂时不可访问或返回异常状态，流程会停止在当前图片，不会把项目引用替换成无效地址。

## 八、自动替换项目引用

工具扫描以下源码文件：

```text
.vue
.ts
.js
.mjs
.json
.less
.scss
.css
```

排除无需处理的目录：

```text
.git
.nuxt
.output
node_modules
public
docs
scripts
```

支持识别以下静态引用：

```text
/figma-assets/AboutReach/au.svg
public/figma-assets/AboutReach/au.svg
~/public/figma-assets/AboutReach/au.svg
@/public/figma-assets/AboutReach/au.svg
```

统一替换为：

```text
https://standalones.oss-us-east-1.aliyuncs.com/post-scheduler/public/about-reach/au.svg
```

动态拼接路径不会自动修改，例如：

```ts
const imageUrl = `/figma-assets/${directory}/${fileName}`
```

因为工具无法在静态扫描阶段确定变量的最终值，强行替换容易破坏业务逻辑，因此保留给人工处理。

## 九、日志与结果汇总

每张图片处理时输出：

- 本地相对路径。
- 最终 OSS URL。
- 远程对象是否已经存在。
- 是否执行上传并验证成功。
- 替换引用数量。
- 涉及的源码文件及各文件替换次数。

全部图片完成后汇总：

```text
Processed: 处理图片总数
Uploaded: 实际上传数量
Remote duplicates: 远程重复数量
References replaced: 替换引用总数
Source files changed: 修改源码文件数
```

同时输出远程重复文件清单和修改文件清单，便于开发者检查发布结果和 Git Diff。

工具不会自动删除本地图片，也不会自动提交 Git，保留人工审查和回滚空间。

## 方案演进与排查过程

1. 最初采用“相对路径 + SHA-256”生成不可变 OSS Key。
2. 根据项目实际使用方式，将 Key 简化为“目录路径 + 原始文件名”。
3. 发现修改 `ASSET_ROOT` 上传子目录会丢失上级目录，改为固定根目录并通过参数选择范围。
4. 增加 PascalCase、camelCase 到 kebab-case 的目录转换。
5. 增加本批资源 OSS Key 冲突检查。
6. 使用 TXT 台账记录上传路径，并拆分检查、上传、验证、记录、替换命令。
7. 发现 TXT 台账与 OSS 实际状态存在双数据源一致性问题。
8. 移除本地台账，将 OSS 远程对象作为唯一事实来源。
9. OSS SDK `HeadObject` 因临时 STS Policy 权限不足返回 `403 AccessDenied`。
10. 改为对最终公开 URL 执行 `HEAD`，同时验证资源对真实用户是否可访问。
11. 将多个分散命令组合为一个逐图片执行的 `assets:publish` 发布命令。
12. 增加 `x-oss-forbid-overwrite`，进一步防止并发任务覆盖远程对象。

## 最终结果

- 将资源检查、OSS 上传、可用性验证和源码替换整合为单命令流程。
- 支持全量、目录级和单文件级发布。
- 统一本地目录与 OSS 目录的命名映射规则。
- 通过本批路径冲突检查、远程判重和 OSS 服务端禁止覆盖降低误覆盖风险。
- 移除本地上传台账，解决本地记录与远程状态不一致的问题。
- 自动替换 Vue、TypeScript、JavaScript 和样式文件中的静态图片引用。
- 提供逐资源日志、远程重复清单和最终汇总，提高发布过程的可追踪性。
- 保留本地文件和 Git 人工确认环节，确保流程可审查、可回滚。

## 简历表述

### 完整版

> 设计并实现 Figma 静态资源 OSS 自动化发布工具，基于 Node.js 与 ali-oss 打通资源扫描、路径标准化、远程判重、安全上传、可用性验证及源码引用替换全流程；支持全量、目录级和单文件级发布，自动完成 PascalCase/camelCase 到 kebab-case 的 OSS 路径转换。以 OSS 远程对象作为唯一事实来源，通过公开 URL HEAD 检查、批次路径冲突检测和 `x-oss-forbid-overwrite` 防止资源误覆盖，并自动扫描 Vue、TypeScript、JavaScript、LESS/CSS 等文件替换静态引用，输出逐资源日志与发布汇总，降低人工操作成本和静态资源发布风险。

### 精简版

> 主导建设 Figma 静态资源自动化发布链路，将图片扫描、OSS 判重、上传验证和项目引用替换整合为单命令工具；支持全量、目录级和单文件级发布，通过远程状态校验、服务端禁止覆盖和批次路径冲突检测保障资源安全，解决人工上传易遗漏、目录映射错误、重复覆盖及本地台账与远程状态不一致等问题。

## 面试口述

> 项目里的 Figma 图片原来需要人工上传 OSS，再手动修改页面引用。随着页面和图片数量增加，这个过程很容易漏传、路径写错或者覆盖线上资源。我用 Node.js 和 ali-oss 做了一套自动化工具，固定以 `public/figma-assets` 为资源根目录，通过参数支持全量、目录或单文件发布。脚本会把本地驼峰目录转换成 OSS 的 kebab-case 路径，先检查本批文件有没有映射冲突，再通过最终公开 URL 查询远程对象。文件已存在就跳过上传并记录为重复，不存在就通过临时 STS 上传，同时增加禁止覆盖请求头，上传后再验证最终 URL。确认资源可访问后，脚本会扫描 Vue、TS、JS 和样式文件，把静态本地引用替换成 OSS 地址，并输出替换次数和涉及文件。最终去掉了容易不一致的本地上传台账，让 OSS 成为唯一事实来源，把原来多个手工步骤收敛成一条可追踪、可验证的发布命令。
