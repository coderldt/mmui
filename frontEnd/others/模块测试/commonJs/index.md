## commonJs
> 在js没有模块化之前，我们只能通过块级作用域对数据进行封装，立即执行函数
``` js
  const myModule = () => {
    const _age = 12
    const _name = '张三'

    return { _age, _name }
  }()
```

- 同步加载
  - 使用fs.readFileSync 同步读取， 因为资源都在磁盘中，读取较快
- 导入的是值得拷贝，引用文件内的修改，影响不到原始文件
- 一个文件内的多次引用会使用缓存

``` js
  function loadModule(filename, module, require) {
    const wrappedSrc = `
      (function(module, exports, require) => {
        ${fs.readFileSync(filename, "utf-8")}
      })(filename, module.exports, require)
    `
    eval(wrappedSrc)
  }
```

