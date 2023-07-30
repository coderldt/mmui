function People (name) {
  this.name = name
  this.friends = ['lijx', 'wgge']
}

People.prototype.sayName = function() {
  console.log(this.name);
}

ManPeople.prototype = new People()

function ManPeople(name, sex) {
  // 重点
  People.call(this, name)
  this.name = name
  this.sex = sex
}

let manPeople = new ManPeople('张三')
let man1People = new ManPeople('李四')

manPeople.friends.push('111')
man1People.friends.push('222')

console.log(manPeople.friends);
console.log(man1People.friends);

manPeople.sayName()
man1People.sayName()

// 重点：
//  1.将构造函数继承和原型继承合并使用。

// 优点:
//  1. 引用数据类型，所有实例不在共享
//  2. 能够进行参数传递
//  3. 调用原型方法

// 缺点：
//  1. 父类构造函数执行两次
