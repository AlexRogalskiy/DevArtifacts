'use strict';

var chai = require('chai');
var expect = chai.expect;


describe('isArray', function () {
  it('should return true when data is array', function () {
    expect([1,2,3]).to.be.instanceof(Array);
  });

});