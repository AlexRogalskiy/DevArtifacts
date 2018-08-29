"use strict";

function *createIterator() {
	yield 1
	yield 2
	yield 3
}

let iterator = createIterator()

for (let i of iterator) {
	console.log(i)
}

let createIterator1 = function *(items) {
	for (let i=0; i< items.length;i++) {
		yield items[i]
	}
}

let iter = createIterator([1,2,3])

console.log(iter.next())
console.log(iter.next())
console.log(iter.next())
console.log(iter.next())
console.log(iter.next())
console.log(iter.next())

let values = [1,2,3]

let it = values[Symbol.iterator]();

console.log(it.next())
console.log(it.next())
console.log(it.next())
console.log(it.next())
console.log(it.next())
console.log(it.next())

function isIterable(object) {
	return typeof object[Symbol.iterator] === "function";
}

console.log(isIterable([1,2,3]))
console.log(isIterable(1))
console.log(isIterable("Chef"))
console.log(isIterable(new Map()))
console.log(isIterable(new Set()))

let ctr = "CHEF"
let iterat = ctr[Symbol.iterator]();
let print = (j) => console.log(j)
let printAll = (iter) => {for (let i of iter) {
	print(i)
}}

printAll(ctr)

let map = new Map()

map.set("Chef", "Pupa")
map.set("Bupa", "Diop")

printAll(map.entries())
printAll(map.values())
printAll(map.keys())