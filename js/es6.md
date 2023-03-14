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
-

// 1.set
// 类似一个数组，但是所有成员都是唯一的，不能重复，一半用来数组去重
let newSet = new Set()
// 方法
newSet.add(1)
newSet.add(1)
newSet // [1] 类似
newSet.delete(1)
newSet.has(1)
newSet.clear()

// 遍历方法
newSet.keys()
newSet.values()
newSet.entries()
newSet.forEach()

// 2. weakSet
// 只接受对象作为成员，不可重复
let newWeakSet = new WeakSet()
newWeakSet.add(1)
newWeakSet.add(1)
newWeakSet // [1] 类似
newWeakSet.delete(1)
newWeakSet.has(1)

// 遍历方法
// 因为是弱引用，所以无法遍历

// 3. map
// js的普通对象值能接受字符串-值的类型存储，map提供了js存储对象-对象数据的能力。
let newMap = new Map()

newMap.set(document.querySelector('body'), { age: 12 })
newMap.set(2, { age: 12 })

newMap.get(2)
newMap.delete(2)
newMap.clear()

// 遍历
newMap.keys()
newMap.values()
newMap.entries()
newMap.forEach()

// 4. weakMap
// 只接受对象作为key，不接受其他类型。都是弱引用，不计入垃圾回收机制。
let newWeakMap = new WeakMap()

newWeakMap.set(document.querySelector('body'), { age: 12 })
newWeakMap.set(2, { age: 12 })

newWeakMap.get(2)
newWeakMap.delete(2)
newWeakMap.clear()

// 遍历（不支持）