function uuid() {
  return new Date().getTime()
}

// console.log(uuid());
// console.log(uuid());
// console.log(uuid());

// var [d, [c, [b, [a]]]] = ['a', ['b', ['c', ['d', null]]]]
let a = ['a', ['b', ['c', ['d', null]]]]

function reverser(arr) {
  const flatArr = arr.flat(10)

  const finalArr = [flatArr.slice(-1)[0], ...flatArr.slice(1, -1)]

  let b = []
  finalArr.forEach((i, index) => {
    if (index === 0) {
      b = [i]
    } else {
      b = [i, b]
    }
  })
  console.log(b);
  // const finalRes = []
  // function generArr(res) {
  //   res.forEach(item => {
  //     finalRes[finalRes.length - 1].push(item, [])
  //     finalRes.push()
  //     array.push(item, [])
  //     generArr(array[1])
  //   })
  // }


}

reverser(a)