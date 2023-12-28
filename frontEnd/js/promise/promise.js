
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function Promise (fn) {
  const self = this
  self.status = PENDING
  self.onFulfilled = []
  self.onRejected = []

  function resolve (value) {
    if (self.status === PENDING) {
      self.status = FULFILLED
      self.value = value

      self.onFulfilled.forEach(fn => fn())
    }
  }

  function reject(reason) {
    if (self.status === PENDING) {
      self.status = REJECTED
      self.reason = reason

      self.onRejected.forEach(fn => fn())
    }
  }

  fn(resolve, reject)
}

Promise.prototype.then = function (onFulfilled, onRejected) {
  const self = this

  const promise = new Promise((resolve, reject) => {
    if (self.status === FULFILLED) {
      const val = onFulfilled(self.value)
      resolve(val)
    } else if (self.status === REJECTED) {
      const reason = onRejected(self.reason)
      reject(reason)
    } else {
      self.onFulfilled.push(() => {
        const val = onFulfilled(self.value)
        resolve(val)
      })
      self.onRejected.push(() => {
        const reason = onRejected(self.reason)
        reject(reason)
      })
    }
  })

  return promise
}

new Promise((resolve, reject) => {
  setTimeout(() => {
    let val = Math.random()
    if (val < 0.5) {
      resolve(val)
    } else {
      reject(`${val}-val-不能小于0.5`)
    }
  }, 1000)
}).then(res => {
  console.log('then-res', res)
  return res
}, error => {
  console.log('then-error', error)
}).then(ress => {
  console.log('then-2-res', ress)
}, errorr => {
  console.log('then-2-error', errorr)
})
