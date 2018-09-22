const contains = (a, x) => typeof x === 'function' ? a.some(x) : a.includes(x)
const add = (a, x) => {
  if(!contains(a, x)) a.push(x)
  return a
}
const remove = (a, x) => {
  const idx = typeof x === 'function' ? a.findIndex(x) : a.indexOf(x)
  if(idx >= 0) a.splice(idx, 1)
  return a
}
const union = (a, b, compare) => {
  if(compare)
    a.push(...b.filter(x => !a.some(y => compare(x, y) === 0)))
  else
    a.push(...b.filter(x => !a.includes(x)))
  return a
}
const intersection = (a, b, compare) => {
  for(let i=a.length-1; i>=0; i--) {
    if(compare && !b.some(x => compare(x, a[i]) === 0) || !b.includes(a[i])) a.splice(i, 1)
  }
  return a
}
const minus = (a, b, compare) => {
  for(let i=a.length-1; i>=0; i--) {
    if(compare && b.some(x => compare(x, a[i]) === 0) || b.includes(a[i])) a.splice(i, 1)
  }
  return a
}

const arraysetMutable = a => ({
  contains: x => contains(a, x),
  add: x => add(a, x),
  remove: x => remove(a, x),
  union: (b, compare) => union(a, b, compare),
  intersection: (b, compare) => intersection(a, b, compare),
  minus: (b, compare) => minus(a, b, compare),
  difference: (b, compare) => minus(a, b, compare),
})

module.exports = arraysetMutable
