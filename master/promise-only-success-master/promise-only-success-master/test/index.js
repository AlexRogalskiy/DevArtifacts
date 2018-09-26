describe("Unit: call until success", function() {
    var q = require('q');
    var should = require('should');
    var onlySuccess = require('../index.js');

    function onAmountResolve() {
        var executionCount = 0;
        return function(amount) {
            executionCount++;
            var d = q.defer();
            if (executionCount === amount) {
                d.resolve('resolved');
            }
            else {
                d.reject('rejected only ' + executionCount);
            }
            return d.promise;
        }
    }

    var test = onAmountResolve();

    it ('should be called 3 times and be resolved', function() {
        return new onlySuccess(test, 3, [3])
            .should.be.fulfilledWith(3);
    })

    test1 = onAmountResolve();

    it ('should be called be rejected', function() {
        return new onlySuccess(test1, 3, [6])
            .should.be.rejectedWith('max amount of calls was reached');
    })

    test2 = onAmountResolve()

    it ('should be called 3 times and be resolved', function() {
        return new onlySuccess(test2, 5, [4])
            .should.be.fulfilledWith(4);
    })

});