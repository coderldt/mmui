1. '  -6' -6 == -12

2. null 和 0 的关系
``` js
  null > 0 // false null转换为 0
  null == 0 // false 相关运算符 null 会转换为false
  null >= 0 // true
```

3. ?? || 的区别
?? 空值合并运算符
```js
  let a = 0
  let b = null
  a || 'asd' // 0
  b ?? 'asd' // 'asd'
  // null undefined ?? 会返回原本的值
```