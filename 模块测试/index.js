// 在js早起，没有模块的概念，通过script标签的src属性加载js文件，这样会导致
// 1. 变量全都不在顶层，会导致变量污染
// 2. 不易于维护，和开发。
// 3. 完全依赖文件的加载顺序，只要一个不对，全盘报错

// 1. commonjs
const name = required('./common.js')
const { age, name: nname } = required('./common.js')
// 2. 解构使用

// 3. 不会重复倒入
console.log(
  age, nname
);

// 4. 导出的是值得拷贝，不会修改原数据。

// es6模块
// 1. 只能写在文件的顶部，不能写在表达式中
import age, { age, name } from './es6'