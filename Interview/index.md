# 面试

## 目录
- jobHunt 面试过程，复盘
- question 其他面试题
- resume 历史简历

## 面试题 question
- plane 当前手牌是否能一次性已飞机结构出完

- 自定义内页功能上线
    - 开发时间缩短
    - 通过 data-set 进行数据传递，如何书写 ' 转义是不行的
    - 转义是 js 规则， html 没有，所以是非法 结构
- nuxt3 setCookie 不是什么时候都能设置进去，在ssr阶段发送了接口，然后在接口里面调用 setCookie 不行
  - 原因: nuxt会分发任务下去，每个任务有每个任务的event，需要在页面级别设置 cookie
- 页面级别 cookie 和 接口级别 cookie (遇到的问题)
  - 原因: 浏览器安全模型策略的问题，页面级别的 cookie 信任度更高，接口级别的 cookie 信任度比较低，尤其在三方跳转回来时候，页面级别能够携带，接口级别不行 
  - 解决办法：
    - cookie 设置 sameSite: 'none' secure: true none 不限跨站返回，但需要https(secure) 结果是表现不一，
    - 登录完成，刷新页面，重置为页面级别信任的cookie
- 页面首页爬虫抓到了待上线的链接
  - 原因：页面还未上线，在语言包内提前预设了链接(因为要上报后台，支持在后台动态修改，就想提前预设支持这个功能)，在ssr和客户端水合的时候，以application/json传递的所有的语言包数据，爬虫也抓了，就拿到了数据
  - 解决：不能提前预设页面数据，以及提前支持的功能
- 项目集成 onlineoffice
  - 签名
  - 界面调整
  - pdf插入图片报错
  - onlineoffice 上方浮动工具栏元素，通过 useDraggable 实现拖动，但在快速移动时候，鼠标移出工具栏的时候，工具栏没有跟上
    - 原因：
      1. 页面里有 DocumentEditor 的 iframe，鼠标移动时：
      2. 指针在父页面 → 父页面的元素能收到 pointermove
      3. 指针进入 iframe → 事件会发给 iframe 里的文档，父页面不再收到 pointermove
      4. 拖拽 toolbar 时，如果鼠标快速划过 iframe，父页面的拖拽逻辑会收不到事件，看起来就像卡住或停顿。
    - 解决：useDraggable添加 setPointerCapture 指针捕获
      1. setPointerCapture(pointerId) 是 Pointer Events API 提供的“指针捕获”：
      2. 在某个元素上调用后，该指针后续的所有 pointer 事件都会发给这个元素，不再按“鼠标在谁上面”来分发
      3. 直到 pointerup 或 releasePointerCapture 才会恢复默认行为
  - pdf保存之后，需要重新创建key才能继续编辑。onlineoffice 内部设计
  - insertImage 有个 token 参数，cursor 查询源码之后，发现，传了 token 之后，应该是采用的其他jwt图片，不传，才是采用 api 传的 images 参数