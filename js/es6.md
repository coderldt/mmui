## es6
## var let const
- let const 块级作用域，var 函数作用域
- var 会变量提升，值为 undefined，let const 不会变量提升，提前访问报错。



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