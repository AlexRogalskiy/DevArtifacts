var x = 3;

if (x % 2 == 0) {
    console.log('Even');
} else {
    console.log('Odd');
}

if (x % 2 == 0) {
    console.log('Even');
} else if (x % 3 == 0) {
    console.log('Divisible by 3');
} else {
    console.log('Not a multiple of 2 or 3');
}

var y = 11;

if (y % 2 == 0) {
    console.log('Even');
} else if (y % 3 == 0) {
    console.log('Divisible by 3');
} else {
    console.log('Not a multiple of 2 or 3');
}

var z = "Eat Me";

switch (z.toLowerCase()) {
    case "eat me":
        console.log('Grow');
        break;
    case "drink me":
        console.log('Shrink');
        break;
    default:
        console.log('Why is a raven'
            + 'like a writing desk?');
        break;
}