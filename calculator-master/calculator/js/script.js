var result = document.querySelector('.result');
var operations = document.querySelector('.operations');
var total = 0;
var operation = '+';

function keyPress(key) {
  var value = result.innerHTML;
  var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  var operators = ['*', '/', '-', '+', '=']
  if (operation == '=') {
    value = 0;
    total = 0;
    operation = '+';
    operations.innerHTML = '';
  }

  if (numbers.indexOf(key) >= 0 || (key == '.' && value.indexOf('.') < 0)) {
    if (value == '0') {
      value = key;
    } else {
      value += '' + key;
    }
  } else if (key == 'C') {
    if (value) {
      value = value.substr(0, value.length - 1);
    }
  } else if (operators.indexOf(key) >= 0) {
    operations.innerHTML = operations.innerHTML + ' ' + value + ' ' + key;
    total = eval(total + operation + value);
    operation = key;
    if (key == '=') {
      value = total;
    } else {
      value = 0;
    }
  }

  if (!value) {
    value = 0;
  }

  result.innerHTML = (value+'').substr(0, 13);
}