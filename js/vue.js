class Vue {
  constructor(options) {
    //1 保存选项数据
    this.$options = options || {}
    //2将data数据注入到vue实例中 
    this.$data = options.data || {}
    this.$el =
      typeof options.el === 'string'
        ? document.querySelector(options.el)
        : options.el
    this._proxyData(this.$data)
    //3调用observer对象监听数据变化
  }
  _proxyData(data) {
      Object.keys(data).forEach(key => {
          Object.defineProperty(this,key,{
              enumerable:true,
              configurable:true,
              get(){
                  return data[key]
              },
              set(newvalue){
                 if(data[key]===newvalue){
                     return
                 }
                 data[key]=newvalue
              }
          })
      });
  }
}
