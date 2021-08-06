let a = 12
export default a

export const a = {
  getA() {
    return a
  },
  use() {
    a += 1
  }
}