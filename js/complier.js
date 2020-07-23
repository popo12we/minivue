class Compiler {
  constructor(vm) {
    this.el = vm.$el
    this.vm = vm
    this.compile(this.el)
  }
  // 编译模板,处理文本节点和元素节点
  compile(el) {
    let childNodes = el.childNodes
    Array.from(childNodes).forEach((node) => {
      if (this.isTextNode(node)) {
        //处理文本节点
        this.compileText(node)
      } else if (this.isElementNode(node)) {
        //处理元素节点
        this.compileElement(node)
      }
      // 有子节点的话 要递归遍历
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }
  // 编译元素节点,处理差值表达式
  compileElement(node) {
    Array.from(node.attributes).forEach((attr) => {
      //拿到属性名
      let attrName = attr.name
      //判断是不是指令名字 v-model v-text等
      if (this.isDirective(attrName)) {
        //v-text===》text
        attrName = attrName.substr(2)
        //指令值
        let key = attr.value
        this.update(node,key,attrName)
      }
    })
  }

  update(node,key,attrName){
      let updateFn =this[attrName+"Updater"]
      updateFn&&updateFn(node,this.vm[key])
  }
  
  // 处理v-text 指令
  textUpdater(node,value){
      node.textContent=value
  }
  // v-model
  modelUpdater(node,value){
      node.value=value
  }
  // 编译文本节点,处理差值表达式
  compileText(node) {
    //用正则匹配替换插值表达式里的内容
    let reg = /\{\{(.+?)\}\}/
    let value = node.textContent
    if (reg.test(value)) {
      let key = RegExp.$1.trim()
      node.textContent = value.replace(reg, this.vm[key])
    }
  }
  // 判断元素属性是否是指令
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }
  // 判断节点是否是文本节点
  isTextNode(node) {
    return node.nodeType === 3
  }
  // 判断节点是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }
}
