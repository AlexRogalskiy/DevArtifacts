"use strict";
var firstname = Symbol()
var person = {}

person[firstname] = "Zack"

console.log(person[firstname] )

let symb = Symbol.for("uid")

let obj = {}

obj[symb] = 123

console.log(obj[symb])

let uid = Symbol.for("uid")

console.log(symb === uid)

console.log(Symbol.keyFor(uid))
console.log(Symbol.keyFor(symb))
