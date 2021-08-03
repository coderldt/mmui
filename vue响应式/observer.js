class Observer {
  constructor(vm) {
    this.data = vm.data
    this.walk(vm.data)
  }

  walk(data) {
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
      if (Object.prototype.toString.call(data[key]) === '[object Object]') {
        this.walk(data[key])
      }
    })
  }

  defineReactive(data, key, value) {
    let dep = new Dep()
    Object.defineProperty(data, key, {
      get() {
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      set(newVal) {
        if (value !== newVal) {
          value = newVal
          dep.notify()
        }
      }
    })
  }
}

class Dep {
  constructor() {
    this.subs = []
  }

  addSub(watcher) {
    this.subs.push(watcher)
  }

  notify() {
    this.subs.forEach(item => item.notify())
  }
}

class Watcher {
  constructor(data, key, cb) {
    this.data = data
    this.key = key
    this.cb = cb
    this.get()
  }

  get() {
    Dep.target = this
    this.data[this.key]
    Dep.target = null
  }

  notify() {
    this.cb(this.data[this.key])
  }
}