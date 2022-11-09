export function isObject(val: any) {
  return typeof val === 'object' && val != null
}

export function isOn(key: string) {
  const re = /^on[A-Za-z]+$/
  return re.test(key)
}
