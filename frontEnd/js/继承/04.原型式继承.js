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

// function ManPeople(name, sex) {
//   this.name = name
//   this.sex = sex
// }

let manPeople = object(People)
manPeople.name = '张三'
let man1People = object(People)
man1People.name = '李四'

manPeople.sayName()
console.log(manPeople.name);
console.log(man1People.name);

manPeople.friends.push('111')
man1People.friends.push('222')

console.log(manPeople.friends);
console.log(man1People.friends);


// 重点：
//  1.通过函数实现继承，但一般传入的都是对象，不然一直需要执行构造函数
// or
  // function object(o) {
  //   function f() {}
  //   f.prototype = o
  //   return new f()
  // }

  // let pro = new People
  // let manPeople = object(pro)

// 优点:
//  1. 引用数据类型，所有实例不在共享
//  2. 能够进行参数传递
//  3. 调用原型方法