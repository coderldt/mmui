class Vue {
  constructor(vm) {
    console.log(vm);
    this.el = vm.el
    this.data = vm.data
    new Observer(vm)

    new Compiler(vm)
  }
}

