## Vue
### computed watch
在Vue.js中，computed和watch是两种用于处理数据变化的属性，用于监测和响应Vue实例中的数据的变化。

- computed是Vue实例中的计算属性，它是基于已有的数据属性计算而来的属性，类似于一个计算字段。computed属性的值是根据相关的数据属性的值动态计算得到的，当相关的数据属性发生变化时，computed属性会自动重新计算，并且具有缓存的功能，只有当相关的数据属性发生变化时，computed属性才会重新计算，否则会直接返回之前缓存的计算结果，从而提高性能。

- watch是Vue实例中的观察属性，用于监测数据属性的变化，并在数据变化时执行相应的回调函数。watch属性可以监听一个或多个数据属性，当被监听的数据属性发生变化时，watch会执行相应的回调函数，从而实现对数据变化的自定义处理。

### key
在 Vue.js 中，key 是用于标识 Vue.js 列表渲染中每个子组件的特殊属性。key 的作用有以下几点：

提高性能：key 可以帮助 Vue.js 在列表渲染时，识别每个子组件的唯一性，从而在更新列表时更加高效地定位到需要更新的子组件，从而提高性能。如果没有使用 key，Vue.js 在列表更新时可能会导致不必要的 DOM 操作，从而降低性能。

保持组件状态：key 可以帮助 Vue.js 在列表渲染时保持组件的状态。如果没有使用 key，Vue.js 在列表更新时会销毁和重新创建所有子组件，导致组件的状态丢失。而使用 key 可以让 Vue.js 在更新列表时尽量复用已存在的子组件，从而保持组件的状态。

解决列表渲染中的问题：在 Vue.js 列表渲染时，如果列表中的子组件包含有表单元素（如 input、textarea 等），如果不使用 key，在输入框中输入内容后，列表更新时可能会导致输入内容被重置。使用 key 可以解决这个问题，让 Vue.js 在更新列表时能够正确地保留表单元素的输入内容。

总而言之，key 在 Vue.js 列表渲染中起到了唯一标识子组件、提高性能、保持组件状态和解决列表渲染问题的作用。在使用 Vue.js 进行列表渲染时，建议使用 key 来明确指定子组件的唯一标识，从而充分发挥 Vue.js 的优化性能和状态保持的特性。