var boxes = document.querySelectorAll('li');

var hDiff = 100;
var hStart = 210;

// random numbers and magic numbers to pick random-ish hues for the box colours
boxes.forEach(function(li) {
   li.style.setProperty('--hue', Math.floor(Math.random() * hDiff * 2) + hStart);
});


// var boxes = Array.from(document.querySelectorAll('li'));