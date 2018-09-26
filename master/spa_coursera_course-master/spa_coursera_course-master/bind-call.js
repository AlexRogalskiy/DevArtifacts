function Person(name) {
  this.name = name;
}

var mike = new Person('mike');

console.log(mike);

function test(text) {
  this.text = text;
  return this;
}

var b = {name: 'john'}

var c = test.bind(b)('text');
var d = test.call(b, 'text');
var e = test.apply(b, ['text']);


console.log('c: ', c);
