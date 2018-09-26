var digit_name = (function (){
    var names = ['zero', 'one', 'two', 'three'];

    return function (n) {
        return names[n];
    };

}());

console.log(digit_name(1));
console.log(digit_name(2));