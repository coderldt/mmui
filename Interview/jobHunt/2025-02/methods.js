
Function.prototype.myCall= function (content = window, ...arg) {
  content.fn = this
  const res = content.fn(...arg)
  delete content.fn
  return res
}

Function.prototype.myApply = function (content = window, arg) {
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

// 冒泡排序
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
          if (arr[j] > arr[j + 1]) {
              [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          }
      }
  }
  return arr;
}

function quickSort(arr) {
  if (arr.length <= 1) {
      return arr;
  }
  const pivot = arr[0];
  const left = [];
  const right = [];
  for (let i = 1; i < arr.length; i++) {
      if (arr[i] < pivot) {
          left.push(arr[i]);
      } else {
          right.push(arr[i]);
      }
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}

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

function getfbnqArr(length) {
  let res = [1, 1]
  for (let i = 2; i < length; i++) {
    res.push(res[i - 1] + res[i - 2])
  }
  return res
}

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