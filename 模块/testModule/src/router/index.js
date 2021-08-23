import { createRouter, createWebHashHistory } from 'vue-router'
// 1. 定义路由组件.
// 也可以从其他文件导入
import common from '../views/common.vue'
import es from '../views/es6.vue'

// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
const routes = [
  { path: '/', component: common, name: 'first'},
  { path: '/common_2', component: () => import('../views/common_2.vue'), name: 'first_2'},
  { path: '/es6', component: es, name: 'second' },
  { path: '/es6_2', component: () => import('../views/es6_2.vue'), name: 'second_2' },
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
export default createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})