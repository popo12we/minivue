class Observer {
  constructor(data) {
    this.walk(data)
  }
  walk(data) {
    if (!data || typeof data !== 'object') {
      return
    }
    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key])
    })
  }

  defineReactive(data, key, val) {
    //递归遍历 防止对象里还是对象
    this.walk(val)
    let that = this
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get() {
        return data[key]
      },
      set(newvalue) {
        if (data[key] === newvalue) {
          return
        }
        data[key] = newvalue
        //新修改上去的值也要是响应式的
        this.walk(newvalue)
        //发送通知
      },
    })
  }
}
