// 1. 深拷贝
function deepCopy (a) {
  switch (typeof a) {
    case 'object':
      if (Array.isArray(a)) {
        let res = []
        res = a.filter(item => item)
        return res
      } else {
        let res = {}
        Object.keys(a).forEach(key => {
          res[key] = deepCopy(a[key])
        })
        return res
      }
    default:
      return a
  }
}

// let a = { asd: 123 }
// const b = deepCopy(a)

// 2. 消除重复元素
function cancelRepeat(arr) {
  // return [...new Set(arr)]
  let a = []
  return arr.filter(item => {
    if (!a.includes(item)) {
      a.push(item)
      return item
    }
  })
}

// let a = [1,1,1,1,2,3,4,45,24,623,623,513,4,124,3,2441,1,1,1]
// console.log(cancelRepeat(a));

// 3. 数组对象去重
function cancelRepeatOfObj(arr, key) {
  let a = {}
  return arr.reduce((pre, next) => {
    console.log(pre, next);
    a[next[key]] ? '' : a[next[key]] = true && pre.push(next)
    return pre
  }, [])
  return arr.filter(item => {
    if (!a.find(i => i[key] === item[key])) {
      a.push(item)
      return item
    }
  })
}

// let a = [
//   { id: 0, age: 10 },
//   { id: 1, age: 100 },
//   { id: 2, age: 102 },
//   { id: 4, age: 130 },
//   { id: 2, age: 410 },
//   { id: 3, age: 01 },
//   { id: 4, age: 105 },
//   { id: 1, age: 104 },
//   { id: 1, age: 1032 },
//   { id: 4, age: 10234 },
//   { id: 2, age: 104 },
// ]
// const b = cancelRepeatOfObj(a, 'id')
// console.log(b);

// 4. 伪数组
// 无法调用数组的方法，但是有length，也有01234key的对象
let a = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, length: 6 }
// console.log(Array.from(a));
// Array.prototype.forEach.call(a, (e) => {
//   console.log(e);
// })

// 5. 方块随着鼠标移动
// 见drag.html

// 6. caller 和 callee
// caller 返回调用自身的对象，callee返回自己本身
// caller是函数的属性，返回谁调用的自己
// callee是arguments的属性，返回自己本身
function aa () {
  bb()
}

function bb () {
  console.log(arguments.callee);// [Function: bb]
  console.log(bb.caller); // [Function: aa]
}
aa()


// 7. 同步和异步任务的区别
// 同步任务会阻塞程序的执行，而异步任务不会，在进程遇到异步任务是，会继续往下执行，等待异步任务完成之后，在执行异步任务。异步任务会提高执行的效率，但是不能保证执行的先后顺序。

// setTimeout(_ => console.log(4))
// new Promise(resolve => {
//   resolve()
//   console.log(1)
// }).then(_ => {
//   console.log(3)
// })

// console.log(2)

// 8. cookie，sessionStorage，localStorage
// 存储时间，
  // cookie不设置存储时间，则存在内存中，浏览器关闭的时候自动清除，设置过期时间则存储硬盘，到时清除。
  // localStorage 提供持久存储数据，除非用户主动清除，否则不会清除，其实也可以
  // sessionStorage 提供临时存储数据，当用户关闭浏览器的时候，自动清除。
// 大小
  // cookie单次限制4k，其他没有限制

// 9. 快速排序
function quickSort (arr) {
  if (arr.length <= 1) {
    return arr
  }
  let res = JSON.parse(JSON.stringify(arr))
  const left = []
  const right = []
  let middleIndex = Math.floor(arr.length / 2)
  const middleVal = res.splice(middleIndex, 1)
  // const middleVal = res[middleIndex]

  res.forEach(item => {
    if (item < middleVal) {
      left.push(item)
    } else {
      right.push(item)
    }
  })
  return quickSort(left).concat(middleVal, quickSort(right))
}

const arr = [1,3,12,4,51,353,4,123,21,1,1,42,5,35,23]
// console.log(quickSort(arr));

// 10. 冒泡排序
function bubbleSort (arr) {
  let middleValue = ''
  for (let index = 0; index < arr.length; index++) {
    for (let i = index + 1; i < arr.length; i++)
      if (arr[index] > arr[i]) {
        middleValue = arr[index]
        arr[index] = arr[i]
        arr[i] = middleValue
      }
  }
  return arr
}
// console.log(bubbleSort(arr));

// 11. 计算总数
function getMaxCountOfStr (str) {
  const res = str.split('').reduce((pre, next) => {
    pre[next] ? (pre[next] += 1) : (pre[next] = 1)
    return pre
  }, {})

  const maxVal = Object.keys(res).reduce((pre, next) => {
    if (res[next] > res[pre]) {
      res[pre] = res[next]
    }
    return pre
  })
}
// getMaxCountOfStr('aaaabbbccccddfgh') // a

// 12. 写一个function，清除字符串前后的空格
function cancelSpace(str) {
  return str.trim()
}

console.log(cancelSpace('  asd asd sadas '))

// 13. 字符串添加空格
function spacify(str) {
  // let res = '';
  // [...str].forEach(i => {
  //   i && (res += `${i} `)
  // })
  // return res.slice(0, -1)
  return str.split('').join(' ')
}


// console.log(spacify('hello world'));
String.prototype.spacify = function() {
  return this.split('').join(' ')
}
console.log('hello world'.spacify())

// 函数声明和函数表达式的区别
  // 1.函数声明会把函数 变量提升到首部，在函数之前可以调用；       函数不可以在循环，判断等等的地方声明；
  // 2.函数表达式只会把函数变量提升到首部，必须在赋值后才可以调用； 函数表达式可以在任何地方声明；

// 14. 手写bind，call，apply
Function.prototype.myCall= function (content = window, ...arg) {
  content.fn = this
  const res = content.fn(...arg)
  delete content.fn
  return res
}

Function.prototype.myApply = function (content = window, arg = []) {
  content.fn = this
  const res = content.fn(...arg)
  delete content.fn
  return res
}

Function.prototype.myBind = function (content = window, ...arg) {
  content.fn = this
  return function(...arg1) {
    content.fn(...arg, ...arg1)
    delete content.fn
  }
}

let myaa = {age: 12}
var age = 23
function sayAge(a) {
  console.log(this.age, this.age + a);
}

// console.log('1.', sayAge());
// console.log('2.', sayAge(3));

// 15. 数组扁平化
function flat(arr) {
  let res = []
  arr.forEach(item => {
    if (Array.isArray(item)) {
      res.push(...flat(item))
    } else {
      res.push(item)
    }
  })
  return res
}

let flatArr = [1,2,3,4,5,[1,34,124,21], [3,421,4,214,21,4,21,4,[4214,214,12,124,[123]]]]
// console.log(flat(flatArr));

let flatArrObj = [
  { age: 12 },
  1,2,3,313,13,31,31,3131,[1,2,321, {age: 12}, 12, [123,21,4,12]]
]
console.log(flat(flatArrObj));
