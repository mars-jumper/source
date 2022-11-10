import { describe, it, expect } from "vitest";
import { effect, reactive, ref } from '../src';
describe('reactive响应式', () => {
  it('reactive基本功能', () => {
    let obj = reactive({count: 1})
    let val
    effect(() => {
      val = obj.count
    })
    expect(val).toBe(1)
    obj.count ++
    expect(val).toBe(2)
  })

  it('reactive支持嵌套', () => {
    let obj = reactive({count: 1, usr: {name: 'moon'}})
    let val
    effect(() => {
      val = obj.usr.name
    })
    expect(val).toBe('moon')
    obj.usr.name = 'jupiter'
    expect(val).toBe('jupiter')
  })

  it('ref基本测试', () => {
    let obj = ref(1)
    let val
    effect(() => {
      val = obj.value
    })
    expect(val).toBe(1)
    obj.value ++
    expect(val).toBe(2)
  })

  it('ref支持复杂类型测试', () => {
    // 有 convert 之后，外层都是ref的imp对象
    let obj = ref({count: 1})
    let val
    effect(() => {
      val = obj.value.count
    })
    expect(val).toBe(1)
    obj.value.count ++
    expect(val).toBe(2)
  })

  it('删除属性测试', () => {
    let obj = reactive({count: 1, name: 'mars'})
    let val
    effect(() => {
      val = obj.name
    })
    expect(val).toBe('mars')
    delete obj.name
    expect(val).toBe(undefined)
  })
})

// {}, [] // 采用reactive proxy
// number, string // 采用ref
// map, set, weakMap, weakSet // 采用proxy，但是特殊的是 add方法等，触发的都是proxy里的get
describe('支持set/map', () => {
  it('set的size和add', () => {
    let set = reactive(new Set([1, 2]))
    let val
    effect(() => {
      val = set.size
    })
    expect(val).toBe(2)

    set.add(3)
    expect(val).toBe(3)
  })

  it('set的delete', () => {
    let set = reactive(new Set([1, 2]))
    let val
    effect(() => {
      val = set.size
    })
    expect(val).toBe(2)

    set.delete(2)
    expect(val).toBe(1)
  })
})