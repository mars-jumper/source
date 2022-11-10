import { isObject } from "@mars/utils"
import { track, trigger, reactive } from "./index"
export function ref (obj: any) {
  return new RefImpl(obj)
}

class RefImpl {
  isRef: boolean
  _val: any
  constructor(val) {
    this.isRef = true
    this._val = convert(val)
  }
  get value() {
    track(this, 'ref-get', 'value')
    return this._val
  }
  set value(newValue) {
    if (newValue !== this._val) {
      this._val = newValue
      trigger(this, 'ref-set', 'value')
    }
  }
}

function convert(val) {
  return isObject(val) ? reactive(val) : val
}