function isPlane1(arr) {
  let arrRepeat = [...new Set(arr)]

  let sameThreeNums = arrRepeat.filter(num => {
    if (arr.filter(i => i === num).length >= 3) {
      return num
    }
  })

  if (arr.length - sameThreeNums.length * 3 !== sameThreeNums.length) {
    return 0
  }

  let min = Math.min(...sameThreeNums)
  let max = Math.max(...sameThreeNums)
  if (max - min !== sameThreeNums.length - 1) {
    return 0
  }

  return sameThreeNums.length
}

// let a = [3, 4, 3, 3]
// let f = [3, 3, 4, 4, 4, 3, 4, 5]
// let b = [3, 3, 4, 4, 4, 3, 4, 5, 5, 5, 7, 7]
// let c = [3, 3, 3, 5, 5, 5, 6, 7]
// let d = [3, 4, 3, 3, 5]
// let e = [3, 4, 3, 3, 4]
// console.log(isPlane(a));
// console.log(isPlane(f));
// console.log(isPlane(b));
// console.log(isPlane(c));
// console.log(isPlane(d));
// console.log(isPlane(e));
function isContinuou(arr) {
  let min = Math.min(...arr)
  let max = Math.max(...arr)
  return max - min === arr.length - 1
}

function isPlane(arr) {
  let zeros = arr.filter(i => i === 0)
  let arrRepeat = [...new Set(arr.filter(i => i !== 0))]

  let aggr = {
    1: [],
    2: [],
    3: []
  }
  let aggrSum = []

  arrRepeat.forEach(num => {
    const count = arr.filter(i => i === num).length
    aggr[count > 3 ? 3 : count ].push(num)
  })

  const oneLength = aggr['1'].length
  const twoLength = aggr['2'].length
  const threeLength = aggr['3'].length
  console.log(aggr, aggrSum);
  console.log(arr.length, 'length');

  // threeLength.forEach(item => {
  //   if (arr.length - threeLength * 3 === threeLength) {
  //     if (isContinuou(aggr['3'])) {
  //       return threeLength
  //     }
  //   } else if {

  //   }
  // })

  if (arr.length - threeLength * 3 === threeLength) {
    if (isContinuou(aggr['3'])) {
      return threeLength
    }
  }

  console.log(threeLength * 3 + twoLength * 2, );
  if (arr.length - (threeLength * 3 + twoLength * 2) - twoLength === threeLength + twoLength) {
    if (isContinuou([...aggr['3'], ...aggr['2']])) {
      return threeLength + twoLength
    }
  }

  if (  arr.length - (threeLength * 3 + twoLength * 2 + oneLength) - twoLength - oneLength * 2 === threeLength + twoLength + oneLength) {
    if (isContinuou([...aggr['3'], ...aggr['2'], ...aggr['1']])) {
      return threeLength + twoLength + oneLength
    }
  }
  return 0
}

let a = [3, 4, 3, 3]
let f = [3, 3, 4, 4, 4, 3, 4, 5]
let b = [3, 3, 4, 4, 4, 3, 4, 5, 5, 5, 7, 7]
let c = [3, 3, 3, 5, 5, 0, 6, 7]
let d = [3, 4, 3, 3, 5, 6, 0, 0]
let e = [3, 4, 3, 3, 4]

let gg = [3, 3, 3, 4, 4, 5, 5, 0]
// console.log(isPlane(a));
// console.log(isPlane(f));
// console.log(isPlane(b));
// console.log(isPlane(c));
console.log(isPlane(d));
// console.log(isPlane(e));
// console.log(isPlane(g));

// console.log(isPlane(gg))
