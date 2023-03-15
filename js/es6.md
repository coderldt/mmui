## es6
## var let const
- let const 块级作用域，var 函数作用域
- var 会变量提升，值为 undefined，let const 不会变量提升，提前访问报错。

## 结构赋值
> 数组，对象，字符串，函数都可以进行结构赋值，**按照对应的位置，对变量进行赋值**

## 字符串扩展
- 模板字符串：**就是普通字符串，支持多行编写，支持变量**，还会保留格式（空格）
- includes，startWith，endWith
- repeat
- padStart，padEnd 字符串补全功能
- trimStart,trinEnd
- at

## 数字的扩展
- isFinite 非数值返回false
- isNan
- isInteger 是否为整数
- parseInt、parseFloat 字符串转换为整数或者小数
- bigInt 类型

## 函数
- 尾调用：在函数的尾部只调用另一个函数，不做任何计算，用来做性能优化，如果做了任何计算的话， js 会保留当前执行环境，尾调用的话不会保留执行环境，性能会好些。

## 数组
- 扩展运算符 ... **将一个数组，转换为逗号分割的形式**
- form 类数组转换为真数组
- of 生成一个数组，弥补了 array 构造函数怪异的情况。
- find fill keys values entries
- flat includes
- isArray

## 对象
- keys values entries
- is 用来判断两个值是否相同

## symbol
- 是一种原始数据类型，表示独一无二的值。

## set or map
- set 一个类数组，但成员不会重复 add has clear delete size
- weakSet 一个类数组，成员只能是对象，弱引用 add has delete
- map 一个对象，该对象的 key 不止局限与字符串，可以是对象。 set get has delete size
- weakmap 一个对象，该对象的 key 只能是对象。

## proxy
> 用来做代理的，代理语言层面的内容，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，

## reflect
> 是一个操作对象的api，补充对象的一些内容。把命令式修改成了函数式。

## promise
> Promise **是异步编程的一种解决方案，解决的异步回调地狱的问题，是个异步微任务**。比传统的解决方案——回调函数和事件——更合理和更强大。它由社区最早提出和实现，ES6 将其写进了语言标准，统一了用法，原生提供了Promise对象。
- 有三种状态：pending，fulfilled,reject 一旦改变，不可修改
- 原型上有 then catch finally
- promise方法
  - all
  - race
  - allSettled
  - any
  - resolve
  - reject

## iterator
> iterator 是 es6 提供**统一的接口机制，来处理所有不同的数据结构**。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作。
> 内部有一个指针，遍历的时候，返回当前的值，并自动移动到下一个地方，直到最后一个。返回 value 和 done .

## generator
- 一种**异步编程解决方案**,提供了函数暂停的能力，函数返回一个 iterator 遍历器，每次调用 next 的时间，就跳转到下一个 yield ， 直到 return 。
- 特征: 函数名和 function 关键字中间有个 * 号。

## async
- 是 generator 的语法糖， async -> * ， await -> yidle . 都是暂停函数的执行，等待结果的返回。
- 函数返回一个 Promise

##  class
- es5 编写类通过 function + prototype 的方式来实现类，和面向对象语言的写法差距很大，为了更接近传统语言的写法，引入了 class 类，是一种语法糖吧。
- constructor
- get set 自定义 读取/赋值 属性的操作方法
- 静态方法
  - 静态方法 static 标识的方法，只能通过类本身去调用，可以备子类继承，静态方法可以从 super 调用。
  - 静态属性 static 标识的属性，只能通过类本身去调用。
  - 私有属性 # 标识的属性，只能在类内部使用，
