'use strict';

var chai = require('chai');
var expect = chai.expect;

function isEven(num) {
  return num % 2 === 0;
}

describe('isEven', function () {
  it('should return true when number is even', function () {
    expect(isEven(4)).to.be.true;
  });

  it('should return false when number is odd', function () {
    expect(isEven(5)).to.be.false;
  });
})

function add(num1, num2) {
  return num1 + num2;
}

describe('add without setup/teardown', function () {
  var num = 5;
  it('should be ten when adding 5 to 5', function () {
    expect(add(num, num)).to.equal(10);
  });

  //xit skip test
  it('should be twelve when adding 7 to 5', function () {
    expect(add(num, 7)).to.equal(12);
  });
});