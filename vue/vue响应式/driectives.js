const driectives = {
  show(data, node, key) {
    const value = utils.getValue(data, key)
    // 记录原始display值
    node.oldStatus = node.style.display
    new Watcher(data , key, (newVal) => {
      node.style.display = newVal ? node.oldStatus : 'none'
    })
    node.style.display = value ? node.oldStatus : 'none'
  },
}

const events = {
  click(vm, node, key) {
    const { data, methods } = vm
    node.addEventListener('click', () => {
      // 判断是否是表达式
      if (key.includes('=')) {
        const keyItem = key.replace('{', '').replace('}', '').replace(' ', '').split('=')
        utils.setValue(data, keyItem[0], keyItem[1])
      } else {// 函数
        if (Object.keys(methods).includes(key.trim())) {
          methods[key].call(vm.data)
        } else {
          console.error('没有定义该函数');
        }
      }
    })
  }
}