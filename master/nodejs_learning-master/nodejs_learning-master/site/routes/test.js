function test(number) {
    if (number > 5) {
            console.log(number + ' is greater than 5');
            return;
    };

    console.log('after')
}

a = test(10);
console.log(a);

var obj_arr = [
    {one: 1},
    {two: 2},
    {three: 3}
];

console.log(obj_arr);
console.log("#######");

var test = obj_arr.map(function(item){
    item.extra = 'extra';
    item.extra2 = { extra: 'extra2' };
    return item;
});

console.log(test);