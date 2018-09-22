const arrayset = require('../arrayset')

describe('immutable', () => {

  test('contains (positive)', () => {
    expect(arrayset([7,8,6]).contains(8)).toBe(true)
  })

  test('contains (negative)', () => {
    expect(arrayset([7,5,8]).contains(4)).toBe(false)
  })

  test('contains (empty)', () => {
    expect(arrayset([]).contains(4)).toBe(false)
  })

  test('add', () => {
    expect(arrayset([8,3,9]).add(4).sort()).toEqual([3,4,8,9])
  })

  test('add (empty)', () => {
    expect(arrayset([]).add(1)).toEqual([1])
  })

  test('remove (existing)', () => {
    expect(arrayset([5,1,6]).remove(1).sort()).toEqual([5,6])
  })

  test('remove (empty)', () => {
    expect(arrayset([]).remove(1)).toEqual([])
  })

  test('union (overlap)', () => {
    expect(arrayset([5,2,3]).union([6,2,3,7]).sort()).toEqual([2,3,5,6,7])
  })

  test('union (no overlap)', () => {
    expect(arrayset([9,3,5]).union([2,8,4]).sort()).toEqual([2,3,4,5,8,9])
  })

  test('union (left empty)', () => {
    expect(arrayset([]).union([5,6,7])).toEqual([5,6,7])
  })

  test('union (right empty)', () => {
    expect(arrayset([1,2,3]).union([])).toEqual([1,2,3])
  })

  test('union (both empty)', () => {
    expect(arrayset([]).union([])).toEqual([])
  })

  test('intersection (overlap)', () => {
    expect(arrayset([8,5,1]).intersection([5,9,1]).sort()).toEqual([1,5])
  })

  test('intersection (no overlap)', () => {
    expect(arrayset([8,2,5]).intersection([9,1,4])).toEqual([])
  })

  test('intersection (left empty)', () => {
    expect(arrayset([]).intersection([4,5,6])).toEqual([])
  })

  test('intersection (right empty)', () => {
    expect(arrayset([1,2,3]).intersection([])).toEqual([])
  })

  test('minus', () => {
    expect(arrayset([5,8,6]).minus([5,6]).sort()).toEqual([8])
  })

  test('minus (left empty)', () => {
    expect(arrayset([]).minus([2])).toEqual([])
  })

  test('minus (right empty)', () => {
    expect(arrayset([1,2,3]).minus([])).toEqual([1,2,3])
  })

  test('minus (no overlap)', () => {
    expect(arrayset([1,2,3]).minus([4])).toEqual([1,2,3])
  })

})

describe('mutable', () => {

  test('contains (positive)', () => {
    expect(arrayset.mutable([7,8,6]).contains(8)).toBe(true)
  })

  test('contains (negative)', () => {
    expect(arrayset.mutable([7,5,8]).contains(4)).toBe(false)
  })

  test('contains (empty)', () => {
    expect(arrayset.mutable([]).contains(4)).toBe(false)
  })

  test('add', () => {
    const a = [8,3,9]
    arrayset.mutable(a).add(4).sort()
    expect(a).toEqual([3,4,8,9])
  })

  test('add (empty)', () => {
    const a = []
    arrayset.mutable(a).add(1)
    expect(a).toEqual([1])
  })

  test('remove (existing)', () => {
    const a = [5,1,6]
    arrayset.mutable(a).remove(1).sort()
    expect(a).toEqual([5,6])
  })

  test('remove (empty)', () => {
    const a = []
    arrayset.mutable(a).remove(1)
    expect(a).toEqual([])
  })

  test('union (overlap)', () => {
    const a = [5,2,3]
    arrayset.mutable(a).union([6,2,3,7]).sort()
    expect(a).toEqual([2,3,5,6,7])
  })

  test('union (no overlap)', () => {
    const a = [9,3,5]
    arrayset.mutable(a).union([2,8,4]).sort()
    expect(a).toEqual([2,3,4,5,8,9])
  })

  test('union (left empty)', () => {
    const a = []
    arrayset.mutable(a).union([5,6,7])
    expect(a).toEqual([5,6,7])
  })

  test('union (right empty)', () => {
    const a = [1,2,3]
    arrayset.mutable(a).union([])
    expect(a).toEqual([1,2,3])
  })

  test('union (both empty)', () => {
    const a = []
    arrayset.mutable(a).union([])
    expect(a).toEqual([])
  })

  test('intersection (overlap)', () => {
    const a = [8,5,1]
    arrayset.mutable(a).intersection([5,9,1]).sort()
    expect(a).toEqual([1,5])
  })

  test('intersection (no overlap)', () => {
    const a = [8,2,5]
    arrayset.mutable(a).intersection([9,1,4])
    expect(a).toEqual([])
  })

  test('intersection (left empty)', () => {
    const a = []
    arrayset.mutable(a).intersection([4,5,6])
    expect(a).toEqual([])
  })

  test('intersection (right empty)', () => {
    const a = [1,2,3]
    arrayset.mutable(a).intersection([])
    expect(a).toEqual([])
  })

  test('minus', () => {
    const a = [5,8,6]
    arrayset.mutable(a).minus([5,6]).sort()
    expect(a).toEqual([8])
  })

  test('minus (left empty)', () => {
    const a = []
    arrayset.mutable(a).minus([2])
    expect(a).toEqual([])
  })

  test('minus (right empty)', () => {
    const a = [1,2,3]
    arrayset.mutable(a).minus([])
    expect(a).toEqual([1,2,3])
  })

  test('minus (no overlap)', () => {
    const a = [1,2,3]
    arrayset.mutable(a).minus([4])
    expect(a).toEqual([1,2,3])
  })

})
