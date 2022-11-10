import { describe, it, expect, vi } from "vitest";
import { effect, reactive, ref } from '../src';
describe('effect', () => {
  it('effect嵌套', () => {
    const data = {tmp1: 'foo', tmp2: 'bar'}
    const obj = reactive(data)
    let tmp1, tmp2
    let fn1 = vi.fn(() => {})
    let fn2 = vi.fn(() => {})
    effect(() => {
      fn1()
      effect(() => {
        fn2()
        tmp2 = obj.tmp2
      })
      tmp1 = obj.tmp1
    })

    expect(fn1).toBeCalledTimes(1)
    expect(fn2).toBeCalledTimes(1)
    // expect(tmp1).toBe('foo')
    // expect(tmp2).toBe('bar')
    // obj.tmp2 = 'test'
    // expect(fn1).toBeCalledTimes(1)
    // expect(fn2).toBeCalledTimes(2)
    obj.tmp1 = 'hello'
    expect(fn1).toBeCalledTimes(2)
    // expect(fn2).toBeCalledTimes(1)
  })
})