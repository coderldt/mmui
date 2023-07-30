function People (name) {
  this.name = name
  this.friends = ['lijx', 'wgge']
}

People.prototype.sayName = function() {
  console.log(this.name);
}

function ManPeople(name, sex) {
  this.name = name
  this.sex = sex
}

// 重点
ManPeople.prototype = new People()

let manPeople = new ManPeople('张三')
let man1People = new ManPeople('李四')

manPeople.sayName()
man1People.sayName()

// 问题
manPeople.friends.push('111')
man1People.friends.push('222')

console.log(manPeople.friends);

// 重点：
//  1.把父类new一个实例，赋值给子类的prototype

// 优点:
//  1. 共享父类的属性和方法

// 缺点：
//  1. 不能够进行参数传递
//  2. 父类引用数据类型，所有实例共享，一个改变，全部改变