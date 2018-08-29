"use strict";
//default params don't work on node 0.12
//(function def(chef=111, pupa=222) {
//	console.log(chef, pupa)
//})()
//rest params don't work on node 0.12
//function restParams(chef, ...rest) {
//	console.log(chef, rest)
//}

//restParams(1,2,3,4,5,6,7,8)
//destructuring doesn't work on node 0.12
//function({chef, pupa}) {
//	console.log(111)
//}

let struct = [1,3,5,7]
//the spread operator doesn't work on node 0.12
//console.log(Math.max(...struct))

function doSomething() {}

var doAnotherThing = function(){}

console.log(doSomething.name)
console.log(doAnotherThing.name || NaN)

if (true) {
	console.log(typeof doSomething1)
	//console.log(typeof doSmthng)
	function doSomething1() {}
	let doSmthng = function() {}
	console.log(typeof doSmthng)
	doSomething1()
}

console.log(typeof doSomething1)

let reflect = value => value
let reflect2 = (value1, value2) => value1+value2
let reflect3 = () => "Arrow function"
let reflect4 = (arg1, arg2) => {return arg1 + arg2}
let doNothing = () => {}
let getItem = () => ({chef:"Pupa"})
let iife = ((name)=> {return name+1})("Nick")
console.log(iife)
let list = ["my","name","is", "chef"]

console.log(list.reduce((a,b) => a+" "+b))
console.log(list)
let some = () => "JS IS AWESOME"

console.log(some())

let sum = (a,b) => a+b

console.log(sum.call(null, 1,2))
console.log(sum.apply(null, [1,2]))

console.log(reflect("Chef"))
console.log(reflect2("Chef", "Pupa"))
console.log(reflect4("Chef", "Pupa"))
console.log(reflect3())
console.log(getItem())
