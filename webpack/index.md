# webpack
  > 本质是静态资源打包工具，会自动递归的构建出一个关系依赖图，根据这个依赖图的先后顺序一次进行分别进行加载，遇到不同类似的文件就用不同的loader进行处理，也可以添加plugin添加额外的功能。
  - 常用的loader，以及作用
    + babel-loader: 将es6语法翻译成es5语法，为了兼容低版本浏览器
    + jsx-loader：解析jsx语法
      - @vue/babel-preset-jsx
      - vModel
      - vOn
      - injectH
    + style-loader / css-loader：解析css文件
    + less-loader / sass-loader：解析 less / sass 文件
    + postcss-loader：赋予css更强的功能，例如自动添加浏览器前缀
    + url-loader：设置阀值，小于阀值的图片自动转换base64，减少http请求，加快加载速度，超过阀值则采用file-loader加载。
    + file-loader：解析文件的，例如通过url导入的资源什么的
    + svg-sprite-loader：解析svg格式的图片
  - 常用的plugins，以及作用
    + html-webpack-plugin：创建包含打包后js文件的index.html
    + clear-webpack-plugin: 清楚上次打包文件
    + source-map：映射打包后文件和源代码直接的关系，会在调试的时候用到。
    + splitChunks: 多次引入公共文件抽离chunk
    + purifycss-webpack：压缩css文件
    + webpackBundle_analyzer：展示打包后各个文件的大小，可以根据这个去优化包的大小