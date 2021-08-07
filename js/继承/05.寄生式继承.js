function People (name) {
  this.name = name
  this.friends = ['lijx', 'wgge']
}

People.prototype.sayName = function() {
  console.log(this.name);
}

// 重点
function object(o) {
  function f() {}
  f.prototype = new o()
  return new f()
}

function createAnother(o) {
  let cloneObj = object(o)
  cloneObj.sayName = function() {
    console.log(1111);
  }
  return cloneObj
}

let person1 = createAnother(People)
let person2 = createAnother(People)
console.log(person1, person2);

// 04-05都是为了从一个对象的基础上扩展为另一个对象。