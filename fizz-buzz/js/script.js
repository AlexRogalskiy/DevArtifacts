// JS FIZZBUZZ SOLUTION
var column = document.querySelector('.js');
for (var i=1; i<=100; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      column.innerHTML += "<div>fizzbuzz</div>";
    } else if (i % 3 === 0) {
      column.innerHTML += "<div>fizz</div>";
    } else if (i % 5 === 0) {
      column.innerHTML += "<div>buzz</div>";
    } else {
      column.innerHTML += "<div>" + i + "</div>";
    }
}