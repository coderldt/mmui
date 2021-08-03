const utils = {
  getValue(data, key) {
    let keys = key.split('.')
    return keys.reduce((pre, next) => pre[next], data)
  },
  setValue(data, key, val) {
    let keys = key.split('.')
    let temporaryData = data
    for(let i = 0; i < keys.length; i++) {
      if (i === keys.length - 1) {
        temporaryData[key] = val
      } else {
        // 如果为空，则创建新对象，并复制临时对象temporaryData
        !temporaryData[key] && (temporaryData[key] = {})
        temporaryData = temporaryData[key]
      }
    }
  },
  renderText(data, node, key) {
    new Watcher(data , key, (newVal) => {
      node.nodeValue = newVal
    })
    node.nodeValue = this.getValue(data, key)
  },
  // 解析v-所有指令
  getVRedir(node) {
    if (!node.attributes) return []
    const redir = []
    const attrs = [...node.attributes]
    attrs.filter(attr => /^v-/.test(attr.name)).forEach(item => {
      const { name, textContent } = item
      const dir = name.split('v-')[1]
      redir.push({ key: dir, value: textContent })
    })
    return redir
  },
  // 解析所有事件
  getListenersOfElement(node) {
    if (!node.attributes) return []
    const event = []
    const attrs = [...node.attributes]

    attrs.filter(attr => /^@/.test(attr.name)).forEach(item => {
      const { name, textContent } = item
      const dir = name.split('@')[1]
      event.push({ key: dir, value: textContent })
    })
    return event
  }
}

class Compiler {
  constructor(vm) {
    this.el = vm.el
    this.data = vm.data
    this.methods = vm.methods || {}

    this.render(document.querySelector(vm.el))
  }

  render(node) {
    for(let i of node.childNodes) {
      if (this.isText(i)) {
        this.compilerText(i)
      }

      if (this.isElement(i)) {
        this.compilerDir(i)
      }

      if (i.childNodes && i.childNodes.length) {
        this.render(i)
      }
    }
  }

  isText(node) {
    return node.nodeType === 3
  }

  isElement(node) {
    return node.nodeType === 1
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

  compilerDir(node) {
    // 处理指令
    const keysValue = utils.getVRedir(node)
    keysValue.forEach(item => {
      const { key, value } = item
      driectives[key](this.data, node, value)
    })

    // 处理事件
    const eventsValue = utils.getListenersOfElement(node)
    eventsValue.forEach(item => {
      const { key, value } = item
      events[key](this, node, value)
    })
  }
}