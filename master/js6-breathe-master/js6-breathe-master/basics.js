"use strict";

var count = 1

if (true) {
	let count = 40

	console.log(count)
}

var options = {name:"chef", position:"pupa"}
//doesn't work on node 0.12
//var {name, position} = options

//console.log("%s - %s", name, position)

var opts = ["first", "second"]
//array destructuring doesn't work on node 0.12, as well as object destructuring
//var [fir, scnd] = opts
console.log(Number.isFinite(25))
console.log(Number.isFinite("25"))
console.log(Number.isNaN(NaN))
console.log(Number.isNaN("NaN"))
console.log(Number.parseInt("11111"))
console.log(Number.parseFloat("11111.2222"))
console.log(Number.isInteger("11111.2222"))
console.log(Number.isInteger("11111.0"))
console.log(Number.isInteger("11111"))
console.log(Math.log2(32))
console.log(count)
if (true) {
	const chef = "chef"
	console.log(chef)
}

console.log(chef)

(function chef() {
	if (true) {
		let pupa1 = 1
	}
	console.log(pupa1)
})()

