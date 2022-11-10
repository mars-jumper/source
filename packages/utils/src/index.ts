export function isObject(val: any) {
  return typeof val === 'object' && val != null
}

export function isOn(key: string) {
  const re = /^on[A-Za-z]+$/
  return re.test(key)
}

export function toRawType(value: any) {
  return Object.prototype.toString.call(value).slice(8, -1)
}