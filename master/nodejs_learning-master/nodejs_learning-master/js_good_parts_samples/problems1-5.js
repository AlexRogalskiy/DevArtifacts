// Problem-0: test
function funky(o) {
    o = null;        
};

var x = [];
funky(x);
console.log(x);

// What is x?
// Answer: []


// Problem-0-a: test
function swap(a, b) {
    var temp = a;
    a = b;
    b = temp;
};

var x = 1, y = 2;
swap(x, y);
console.log(x);

// What is x? Answer: 1


//////////////////////////////////////
// Problem-1: Write a function that takes an argument returns that argument
function returnArg(arg) {
    return arg;
};

console.log("\n### Problem-1 ###");
console.log(returnArg(3));
console.log(returnArg([1,2,3]));


// Problem-2: Write to binary functions, add and mul, that take two numbers and return their sum and product.
var sum = function (x, y) {
    return x + y;
};

var mul = function (x, y) {
    return x * y;
}; 

console.log("\n### Problem-2 ###");
console.log('add result:' + sum(2, 3));
console.log('mul result: ' + mul(2, 3));


// Problem-3: Write a function that takes an argument and returns a function that returns that arguments
function returnFunc(arg) {
    return function () {
        return arg;
    };
};

console.log("\n### Problem-3 ###");
var res = returnFunc(4);
console.log('result: ' + res());


// Problem-4: Write a function that adds from two invocations
function adds(x) {
    return function (y) {
        return x + y;
    };
};
console.log("\n### Problem-4 ###");
console.log('result: ' + adds(3)(4));


// Problem-5: Write a function that takes a binary function, and makes it callable with two invocations
function applyFunc(func) {
    return function (x) {
        return function (y) {
            return func(x, y);
        };
    };
};

console.log("\n### Problem-5 ###");
var sumResult = applyFunc(sum);
console.log('add result: ' + sumResult(3)(4));
console.log('mul result: ' + applyFunc(mul)(5)(6));


function applyFuncWithArg(func, x) {
    return function (y) {
        return func(x, y);
    }
};

console.log("\n### Problem-6 ###");
var addResult = applyFuncWithArg(sum, 3);
console.log('add result: ' + addResult(4));
console.log('mul result: ' + applyFuncWithArg(mul, 5)(6));


// Problem-7: Without writing any new functions, show three ways to create inc funtion
console.log("\n### Problem-7 ###");
var inc = adds(1);
var inc = applyFunc(sum)(1);
var inc = applyFuncWithArg(sum, 1);
console.log(inc(44));


// Problem-8: Write methodize, a function that converts a binary function to an method.
function methodize(func) {
    return function(y) {
        return func(this, y);
    };
};

Number.prototype.sum = methodize(sum);

console.log("\n### Problem-8 ###");
console.log("result: " + (4).sum(4));


// Problem-9: Write demethodize, a function that converts a method to a binary function.
function demethodize(func) {
    return function(that, y) {
        return func.call(that, y)
    };
};
console.log("\n### Problem-9 ###");
console.log("result: " + demethodize(Number.prototype.sum)(3, 5));


