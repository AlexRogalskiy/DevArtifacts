var ab = "Chef has pupa"
var ab1 = "1chef has pupa"
var ab2 = "chef has pupa1"
var ab3 = "1chef has pupa1"

console.log(ab.startsWith('chef'))
console.log(ab1.endsWith('pupa'))
console.log(ab2.endsWith('pupa'))
console.log(ab3.endsWith('pupa'))
//doesn't work on node 0.12
//console.log(ab3.includes("pupa"))
var x = "x"
console.log(x = x.repeat(10))
console.log(x.length)
var regexp = /^chef/ig

console.log(regexp.test(ab))
console.log(regexp.test(ab1))

console.log(regexp.source)
//doesn't work on node 0.12
console.log(regexp.flags)

console.log(Object.is(+0, -0))
console.log(+0===-0)