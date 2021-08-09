console.log(typeof 11); // number
console.log(typeof '11'); // string
console.log(typeof undefined); // undefined
console.log(typeof null); // object
console.log(typeof []); // object
console.log(typeof {}); // object
console.log(typeof function(){}); // function
console.log([] instanceof Array); // true
console.log({} instanceof Object); // true
console.log(null instanceof Object); // false

// 都是用来判断数据的类型
// typeof 可以判断基本数据类型，不会出错，但是在引用数据类型，数组对象和null的时候都是返回null
// instanceof 是判断该变量是否是当前构造函数的实例，可以正确判断是数据和对象

function myInstance(variable, type) {
  let prototype = type.prototype
  let proto = variable.__proto__

  while (true) {
    if (proto === null) {
      return false
    }
    if (proto === prototype) {
      return true
    }
    proto = proto.__proto__
  }
}

console.log('myInstance', myInstance({}, Object));