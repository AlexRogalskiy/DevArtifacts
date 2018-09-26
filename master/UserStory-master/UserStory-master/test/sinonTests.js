'use strict';
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
chai.should();

describe('sinon tests', function () {
  var project;

  beforeEach(function () {
    project = {
      sayHello: function (creatorId, cb) {
        // do stuff
        cb();
      }
    }
  });

  describe('project.sayHello', function () {
    it('should call the callback', function () {
      var spy = sinon.spy();
      project.sayHello(2, spy);

      spy.called.should.be.true;
    });

    it('should call the callback and log to the console', function () {
      function logToConsole() {
        console.log('Logging to console!!!');
      }

      var spy = sinon.spy(logToConsole);
      project.sayHello(3, spy);

      spy.called.should.be.true;


    })
  });

})