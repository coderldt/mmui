function People (name) {
  this.name = name
  this.friends = ['lijx', 'wgge']
}

People.prototype.sayName = function() {
  console.log(this.name);
}

function ManPeople(name, sex) {
  // 重点
  People.call(this, name)
  this.name = name
  this.sex = sex
}

let manPeople = new ManPeople('张三')
let man1People = new ManPeople('李四')


// 问题
manPeople.friends.push('111')
man1People.friends.push('222')

console.log(manPeople.friends);
console.log(man1People.friends);

// 无法引用父类原型方法
// manPeople.sayName()
// man1People.sayName()

// 重点：
// 1.在子函数中通过call调用父类的构造函数。

// 优点:
//  1. 引用数据类型，所有实例不在共享
//  2. 能够进行参数传递

// 缺点：
//  1. 不可以访问父类原型的方法
