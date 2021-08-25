const data = {
  num: '张三',
  age: 20
}

let name = '李四'
let age = 1

function sett() {
  return age++
}

export {
  data,
  name,
  age,
  sett
}