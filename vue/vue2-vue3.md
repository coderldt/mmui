## vue2和vue3的区别
### 新特性
- api
  - 组合式api：可以通过函数的形式编写组件，从而可以将函数抽离，也就可以做hooks了，更好的复用逻辑
  - 选项式api：声明选项是结构编写组件。
- 组合式api的语法糖：在 script 中添加 setup 属性，是我们在单文件组件中，使用组合式aou的语法糖。可以实现更简洁的代码，更好的类型推导。
- teleport: 一个内置组件，可以把组件中的内容，挂载到组件指定 dom 中的任何位置。
- vue3 支持多节点组件，vue2 只支持单节点。
- 手动定义接受 props 、 emits 、 expose
- 可以在 style 中通过 v-bind 使用 变量

### 变动
- v-model
  - vue2：value and input 的语法糖
  - vue3：modelValue and update:modelValue 的语法糖；v—model 支持加参数使用，代替了v-model.sync。
- v-for and v-if
  - vue2: v-for 优先
  - vue3：v-if 优先
- v-bind="{}"
  - vue2: 会保留元素原有属性
  - vue3：会按照先后顺序覆盖
- $listeners 整合到了 $attrs 中
- 移除了 $on $once $off 可以使用 vuex ，插件， provide/inject 代替。
- ref reactive readonly



## 组件
- 了解了下，整个项目大致都是表单的形式进行输入，通过表格的形式进行输出。设计了几款通用的表单、表格、上传、step步骤条等等组件。
- 表单支持动态项查询，接受一个表单配置项，配置项中包含了 label、prop、span、rules、config、默认值、show。 首先通过计算属性生成配置项，生成一个表单对象，在将表单对象的值绑定在对应的表单item上。查询的时候，通过配置项和表单对象返回对应的结果，抛出一个事件，携带最终的结果。
- 通过会议，文档的形式，去传播组件的使用方案，在项目中使用配置项的方式驱动页面，加快大家的开发效率，减少bug。