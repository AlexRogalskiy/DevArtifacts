const contains = (a, x) => typeof x === 'function' ? a.some(x) : a.includes(x)
const add = (a, x) => contains(a, x) ? a : [...a, x]
const remove = (a, x) => {
  const idx = typeof x === 'function' ? a.findIndex(x) : a.indexOf(x)
  if(idx >= 0) {
    a = a.slice()
    a.splice(idx, 1)
  }
  return a
}
const union = (a, b, compare) => {
  return compare
    ? a.concat(b.filter(x => !a.some(y => compare(x, y) === 0)))
    : a.concat(b.filter(x => !a.includes(x)))
}
const intersection = (a, b, compare) => {
  return compare
    ? a.filter(x => b.some(y => compare(x, y) === 0))
    : a.filter(x => b.includes(x))
}
const minus = (a, b, compare) => {
  return compare
    ? a.filter(x => !b.some(y => compare(x, y) === 0))
    : a.filter(x => !b.includes(x))
}

const arrayset= a => ({
  contains: x => contains(a, x),
  add: x => add(a, x),
  remove: x => remove(a, x),
  union: (b, compare) => union(a, b, compare),
  intersection: (b, compare) => intersection(a, b, compare),
  minus: (b, compare) => minus(a, b, compare),
  difference: (b, compare) => minus(a, b, compare),   // alias
})

arrayset.mutable = require('./arrayset-mutable')

module.exports = arrayset
