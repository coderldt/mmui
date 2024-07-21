## 无界
[官网链接](https://github.com/Tencent/wujie)
[链接](https://wujie-micro.github.io/demo-main-vue/home)

## 代做
- 输入 url 的全流程，以及各流程的优化方式
- canvas
- web 终端调试方法：https://hughfenghen.github.io/posts/2023/12/23/web-spy/

## Vue.js 3 与 Vue.js 2 在代理方面的区别主要在以下方面：
- Proxy API 替代了 Object.defineProperty API： 在 Vue.js 2 中，使用 Object.defineProperty API 来进行数据的响应式代理。而在 Vue.js 3 中，使用了 ES6 中的 Proxy API 来进行数据的响应式代理。这个改变使得 Vue.js 3 更加灵活和强大。
- 弱化了 $watch API： 在 Vue.js 2 中，$watch API 可以用于监控数据的变化并进行一些处理，但是它的使用存在一些问题。在 Vue.js 3 中，$watch API 的使用被弱化了，取而代之的是更加强大的 watchEffect API。
- Composition API 取代了 Options API： 在 Vue.js 2 中，使用 Options API 来组织组件的逻辑。在 Vue.js 3 中，使用 Composition API 来组织组件的逻辑。Composition API 更加灵活和强大，可以更好地组织和重用逻辑代码。
- 优化了性能： 在 Vue.js 3 中，通过对渲染器和虚拟 DOM 进行优化，提高了渲染性能。同时，Vue.js 3 也可以更好地与现代前端工具和框架集成，进一步提高了开发效率。
总之，Vue.js 3 代理相比 Vue.js 2 代理更加灵活和强大，同时也更加优化了性能

## proxy 的优势
- Proxy 是 ES6 引入的一个新的原生 JavaScript 对象，它可以拦截 JavaScript 对象的各种底层操作，包括属性访问、赋值、删除、枚举等操作，从而提供了一种强大的元编程能力。Proxy 相对于以前的 Object.defineProperty 等 API 有以下优势：
- 更强的拦截能力： Proxy 可以拦截 JavaScript 对象的更多底层操作，包括属性访问、赋值、删除、枚举等操作，而 Object.defineProperty 只能拦截属性访问、赋值等操作。
- 更加灵活的 API 设计： Proxy 的 API 设计更加灵活，可以自定义各种拦截器来实现不同的元编程需求，而 Object.defineProperty 等 API 的功能是固定的，不够灵活。
- 更好的性能表现： Proxy 在某些情况下可以比 Object.defineProperty 等 API 更快，因为 Proxy 是 JavaScript 引擎内置的原生实现，而 Object.defineProperty 等 API 是通过 JavaScript 代码模拟实现的。
- 更好的兼容性： Proxy 相对于 Object.defineProperty 等 API 具有更好的兼容性，因为 Proxy 是 ES6 中的标准语法，而 Object.defineProperty 等 API 则是在 ES5 中引入的，一些老旧的浏览器可能不支持。
- 总之，Proxy 提供了一种强大的元编程能力，相对于 Object.defineProperty 等 API 具有更强的拦截能力、更加灵活的 API 设计、更好的性能表现和更好的兼容性。在 JavaScript 中，Proxy 可以用于实现各种元编程需求，例如实现数据绑定、实现数据校验、实现安全性控制等。

## 虚拟dom
- 虚拟 DOM 在 Vue.js 3 与 Vue.js 2 中的区别主要体现在以下几个方面：
- 渲染器的优化： Vue.js 3 中的渲染器相对于 Vue.js 2 进行了优化，提高了渲染性能。例如，Vue.js 3 中的渲染器会更好地利用现代浏览器的新特性，例如动态引入、按需加载、懒加载等，从而提高应用程序的性能。
- 支持 Fragments： Vue.js 3 中的虚拟 DOM 支持 Fragments，即可以在组件的根级别返回多个子节点，而不需要将它们包裹在一个父节点中。这个特性使得组件的结构更加灵活，可以更好地组织和重用组件的代码。
- 支持 Teleport： Vue.js 3 中的虚拟 DOM 支持 Teleport，即可以将组件的子节点渲染到 DOM 中的另一个位置。这个特性使得组件的渲染更加灵活，可以更好地实现一些复杂的 UI 功能。
- 提供了更好的调试工具： Vue.js 3 中的开发者工具提供了更好的调试功能，可以更加方便地查看组件的虚拟 DOM 树、状态和事件等信息，从而更加方便地进行开发和调试。
- 总之，Vue.js 3 相对于 Vue.js 2 在虚拟 DOM 层面进行了优化和改进，提高了渲染性能、提供了更好的灵活性和调试工具。这些改进使得 Vue.js 3 更加适合构建大规模、高性能的现代 Web 应用程序。