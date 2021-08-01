const utils = {
  renderText(data, node, key) {
    new Watcher(data , key, (newVal) => {
      node.nodeValue = newVal
    })
    node.nodeValue = data[key]
  }
}

class Compiler {
  constructor(vm) {
    this.el = vm.el
    this.data = vm.data

    this.render(document.querySelector(vm.el))
  }

  render(node) {
    for(let i of node.childNodes) {
      if (this.isText(i)) {
        this.compilerText(i)
      }

      if (i.childNodes && i.childNodes.length) {
        this.render(i)
      }
    }
  }

  isText(node) {
    return node.nodeType === 3
  }

  compilerText(data) {
    const nodeVal = data.nodeValue
    let reg = /\{\{(.+?)\}\}/g; // 匹配模板编译器的内容
    if (reg.test(nodeVal)) {
      let res = nodeVal.replace('{{', '')
      res = res.replace('}}', '')
      res = res.trim()

      utils.renderText(this.data, data, res)
    }
  }
}