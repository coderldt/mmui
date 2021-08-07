function People (name) {
  this.name = name
  this.friends = ['lijx', 'wgge']
}

People.prototype.sayName = function() {
  console.log(this.name);
}

function ManPeople(name, sex) {
  People.call(this, name)
  this.name = name
  this.sex = sex
}

// 重点
function object(o) {
  function f() {}
  f.prototype = new o()
  return new f()
}

// 重点
function inheritPrototype(parent, child) {
  let prototype = object(parent)
  child.prototype = prototype
  prototype.constructor = child
}

inheritPrototype(People, ManPeople)

let manPeople = new ManPeople('张三')
let man1People = new ManPeople('李四')

manPeople.friends.push('111')
man1People.friends.push('222')

console.log(manPeople.friends);
console.log(man1People.friends);

manPeople.sayName()
man1People.sayName()

// 重点：
//  1.改进构造函数的继承方式，通过拷贝副本的方式，将子类的的prototype指向父类的原型；并且将原型的constructor指向子类
// 还是需要在子类中调用父类构造函数

// 优点:

// 缺点：