var digit = 5;

var sayHello = function() {
    // always use var keyword to define variable in context scope
    var test = 'test'
    console.log(test);
};

//var test = 'test2';
sayHello();

console.log(test);