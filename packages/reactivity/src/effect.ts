import {COL_KEY} from './reactive'
let targetMap = new WeakMap() 
// 对象 => {
//    属性1: [effect1, effect2]
// }
//

let activeEffect
let effectStack:any = []

export function effect(fn) {
  console.log('effect', fn)
  activeEffect = fn
  effectStack.push(fn)
  fn() // 这里手动执行，里面的取值，会触发Proxy的get方法，执行track，执行完重置（弹出栈之后，恢复为上一个的值）
  effectStack.pop()
  // 不能直接赋值null
  // activeEffect = null
  activeEffect = effectStack[effectStack.length - 1]
}

export function track(obj, type, key) {
  console.log('track', obj, type, key)
  if (!activeEffect) {
    return
  }
  let depsMap = targetMap.get(obj)
  if(!depsMap) {
    targetMap.set(obj, (depsMap = new Map())) // obj: {}
  }
  let deps = depsMap.get(key)
  if(!deps) {
    depsMap.set(key, (deps = new Set())) // 去重数组 key: []
  }
  deps.add(activeEffect)
}

export function trigger(obj, type, key) {
  console.log('trigger', obj, type)
  const depsMap = targetMap.get(obj)
  if(!depsMap) return

  if( type === 'collection-add') {
    key = COL_KEY
  }
  if (type === 'collection-delete') {
    key = COL_KEY
  }
  const deps = depsMap.get(key)
  if(deps) {
    
    deps.forEach(effect => effect());
  }
}