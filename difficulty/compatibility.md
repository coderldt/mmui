# 兼容性问题
## question: html-to-image 浏览器兼容问题
### #火狐浏览器 #浏览器
> makeaqrcode 二维码项目 html-to-image 转换 toPng 方法在火狐浏览器142版本转换失败
- [bug链接](https://github.com/bubkoo/html-to-image/issues?q=is%3Aissue%20state%3Aopen%20firefox)

# dom 转换 pdf 分页文字裁剪问题

# dom 转换 pdf 分页段落文字拆分功能 自己计算元素高度加margin 来分页展示 但在国内生成速度慢，开了翻墙还行，投放要加速

# dom 转换 pdf 慢的问题 转换dom的问题放在后端
1. 后端通过 puppeteer 加接受的dom，css（我存放在了一个项目内，单独抽离出来），构建dom，然后导出，速度从 60s 加速到了 5s（根据页面的长度动态）
2. 后端 字体问题 浏览器字体有自动降级处理，在后端无默认字体，如果没有这个字体，pdf会空，需要加载对应的字体。一个通用16m字体，就保存速度到了30s。
3. puppeteer 还能自动拆分段落去分页。

# 简历50个模版实现一些改动，curcor 很快，指标来了