import { isObject } from "@mars/utils"

export const ret = isObject([])

export { reactive } from './reactive'
export { effect, track, trigger } from './effect'
export { ref } from './ref'