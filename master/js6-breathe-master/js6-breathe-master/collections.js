"use strict";
let items = new Set()

items.add(5)
items.add(5)
items.add(51)
items.add(51)
console.log(items.size)

items = new Set([1,2,3,5,65,4,53,5,3])

console.log(items.size)
console.log(items.has(5))
items.delete(5)
console.log(items.has(5))

for (let num of items) {
	console.log(num)
}

items.forEach(function(elem) {console.log(elem)})

let map = new Map()

map.set("Chef", "Pupa")
map.set("Chef", "Pupa1")
console.log(map.get('Chef'))

let map1 = new Map([["chef", "pupa"],["yoy", 111]])

console.log(map1.get('chef'))

let set = new WeakSet([{},{chef:"11"},{fdf:"$#$"},{fdfdf:"43434"}])
let wmap = new WeakMap([[{ffdf:"#@#"},2],[{fdf:"Fdf"},4]])