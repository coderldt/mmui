### 路由
  - 动态路由，通过params去动态匹配对应的路由
  - 多级-嵌套路由，在routes中通过children属性配置二级，或者多集路由，在router-view中再次配置对应的router-vie渲染
  - 同级-命名路由在router-view设置name属性，通过制定不同的name属性，渲染不同地方
  - 重命名-别名：redirect和alias
  - 路由传参数：params和query两种
  - 导航首位
    - 全局导航守卫
      - router.beforeEach((to, from, next) => {})
      - router.afterEach((to, from, next) => {})
    - 路由守卫
      - 在路由配置内填写
      {
        beforeEnter((...) => {})
      }
    - 组件内守卫
      - beforeRouterEnter()
      - beforeRouterUpdate()
      - beforeRouterLeave()
  - 路由元信息
    - meta中携带的信息，可以通过.meta访问