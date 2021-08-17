function myNew (o) {
  let obj = {}
  obj.__proto__ = o.prototype
  o.call(obj, ...[...arguments].slice(1))
  return obj
}
function People (name) {
  this.name = name
  this.friends = ['lijx', 'wgge']
}

People.prototype.sayName = function() {
  console.log(this.name);
}

let person = myNew(People, '张三')
console.log(person.name);
person.sayName()