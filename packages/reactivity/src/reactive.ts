import {track, trigger} from './index'
import { isObject, toRawType } from '@mars/utils';

export const COL_KEY = Symbol('collection')

const enum TargetType {
  INVALID = 0,
  COMMON = 1, // 普通对象
  COLLLECTION = 2 // set、map
}

function targetTypeMap(type:string) {
  switch(type) {
    case 'Object':
    case 'Array':
      return TargetType.COMMON
    case 'Map':
    case 'Set':
    case 'WeakMap':
    case 'WeakSet':
      return TargetType.COLLLECTION
    default:
      return TargetType.INVALID
  }
}

const baseHandler = {
  get(target, key, receiver) {
    // 收集依赖关系
    const val = target[key]
    console.log('收集依赖')
    track(target, 'get', key)
    // return val
    return isObject(val) ? reactive(val) : val
  },
  set(target, key, val, receiver) {
    
    const ret = Reflect.set(target, key, val, receiver)
    trigger(target, 'set', key)
    return ret

    // target[key] = val
    // trigger(target, 'set', key)
    // return true
    // 修改数据，执行副作用函数
  },
  deleteProperty(target, key) {
    const ret = Reflect.deleteProperty(target, key)
    trigger(target, 'delete', key)
    return ret
  },
  // deleteProperty，delete，has，onKeys
}

const collectionActions = {
  
  add(key){

    // track(target, 'collection-size', key)
    // return Reflect.get(target, key);

    const target = this['__reactive_origin']
    console.log('add', target, `key:${key}`)
    const ret = target.add(key)
    trigger(target, 'collection-add', key)
    return ret
  },
  delete(key){
    const target = this['__reactive_origin']
    console.log('delete', target, `key:${key}`)
    const ret = target.delete(key)
    trigger(target, 'collection-delete', key)
    return ret
  },
  has(key){},
}

const collectionHandler = {
  get(target, key, receiver) {

    console.log('collectionHandler', {target, key, receiver})
    // set.add set.delete set.has
    if(key === '__reactive_origin') return target // 用这种方式把target传递进collectionActions里

    if(key === 'size') {
      track(target, 'collection-size', COL_KEY)
      return Reflect.get(target, key); // 属性挂上来
    }
    
    return collectionActions[key]
    // delete has
  },
  set(target, key, val, receiver) {
    
    const ret = Reflect.set(target, key, val, receiver)
    trigger(target, 'set', key)
    return ret

    // target[key] = val
    // trigger(target, 'set', key)
    // return true
    // 修改数据，执行副作用函数
  },
  deleteProperty(target, key) {
    const ret = Reflect.deleteProperty(target, key)
    trigger(target, 'delete', key)
    return ret
  },
}

export function reactive (obj: any) {
  const handler = targetTypeMap(toRawType(obj)) === TargetType.COMMON ? baseHandler : collectionHandler
  return new Proxy(obj, handler)
}