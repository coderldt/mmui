- ssr 和 nuxt 乾坤不匹配， 乾坤依赖于js动态添加，不符合ssr
- 文生视频公共参数配置、参数配置支持自定义选项，顺序、切换模型校验参数合法性（自动赋值有的选项）
- 接口返回参数信息，我这还有相关配置信息，上传限制
- ai 聊天
    - 从聊天项id链接可以直接进入(/work-bench/ai-chat/3)，从 work-bench/ai-chat 也可以切换路由，但切换后，不希望让他滚动
        - 在 work-bench/ai-chat 页面动手加载 3 的数据，然后通过 静默 的方式更换路由
        - 在 work-bench/ai-chat/3 页面 也正常加载 这个聊天项的数据
        - window.history.replaceState(null, '', localePath(`/work-bench/ai-chat/${id}`))  静默 方式， 只能通过 history 实现，vue-router 不可以
    - 在用户聊天没有触底的时候，显示按钮可以直接滑动的底部，但useScroll只监听用户手动滚动，dispatchEvent手动触发
        - const { y, arrivedState } = useScroll(currentChatRef)
          const { height } = useElementSize(currentChatChildRef)
        - watch(height, () => {
          currentChatRef.value?.dispatchEvent(new Event('scroll'))
          })
        - 流失md格式渲染数据
    - 查询历史分页功能实现，滚动到一半加载更多
- ai 音乐
    - 录音
    - 录音过程中，动态根据声音大小，显示波段
- 在页面离开的时候，如何取消之前的方法或者请求
    - js单线程，只要执行了，没办法取消，在某些地方判断变量
    - 请求呢，AbortController 在请求中携带，然后在onMounted里面取消请求
    - Web Worker 可以手动停止，但交互和环境隔离需要注意一些内容
- ai 去水印
    - https://codermonkie.github.io/js-watermarker/ 图片添加文字水印
    - https://www.npmjs.com/package/watermarkjs 图片添加图片水印
    - 但项目好似要自己实现 canvas 拖拉拽 的方式
    - fabric 三方库，功能齐全
- 打包速度优化
    - 原430s
    - 更换 rolldown 打包 124s 164s
    - 更换 rolldown + nuxt-build-cache 193s

- 在 ssr 阶段的接口，不能设置 cookie 二维码在第一次获取渠道信息的时候，想设置cookie进去，但不行，因为是ssr阶段
