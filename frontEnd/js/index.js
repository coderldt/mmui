// 1.写一个 mySetInterVal(fn, a, b),每次间隔 a,a+b,a+2b 的时间，然后写一个 myClear，停止上面的 mySetInterVal
let time = null
function mySetInterVal(fn, a, b) {
  let i = 0
  start = () => {
    time = setTimeout(() => {
      fn()
      i += 1
      start()
    }, a + i * b)
  }
  start()
}

mySetInterVal(() => {console.log('1');}, 1000, 2000)

function myClear() {
  time && clearTimeout(time)
}
myClear()

// 2.斐波那契数列
// 从第三项开始，等于前两项之和的数组
function getfbnqArr(length) {
  let res = [1, 1]
  for (let i = 2; i < length; i++) {
    res.push(res[i - 1] + res[i - 2])
  }
  return res
}

console.log(getfbnqArr(10))

// 获取第n项
function getCountOffbnq(n) {
  let pre = 1
  let next = 1
  for (let i = 2; i < n - 1; i++) {
    let count = pre + next
    pre = next
    next = count
  }
  return pre + next
}

console.log(getCountOffbnq(10));

// 3. 防抖和节流原理和代码
// 防抖：触发事件后n秒后执行，如果在n秒内重复触发，则重新计时  => 可以防止用户频繁触发事件，之发送最后一次；输入框防止联想事件，之发送最后一次
// 节流：在单位事件内只会触发一次，其他情况不会触发。 => 例如监听页面resize，scroll事件等等

// 防抖 最后一次执行
function debounceLast(fn, lazy) {
  let time = null
  return function de() {
    time && clearTimeout(time)
    time = setTimeout(fn, lazy)
  }
}

function debounceFirst(fn, lazy) {
  let time = null
  return function de() {
    time && clearTimeout(time)
    !time && fn()
    time = setTimeout(() => {
      time = null
    }, lazy)
  }
}

// 节流
function throttle(fn, lazy) {
  let time
  let start = 0
  return function () {
    let end = new Date()
    if (end - start > lazy) {
      fn()
      start = end
    }
  }
}
