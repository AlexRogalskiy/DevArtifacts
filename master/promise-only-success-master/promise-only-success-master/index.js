var q = require('q');

function onlySuccess(pFunc, maxTimes, paramsArray) {
	var d = q.defer();
	maxTimes = maxTimes || 10;
	paramsArray = paramsArray || [];
	var called = 0;
	
	function callPFunc() {
		called++;
		pFunc.apply(this, paramsArray)
			.then(function() {
				d.resolve(called)
			})
			.catch(function() {
				if (called < maxTimes) {
					callPFunc();
				}
				else { 
					d.reject(new Error('max amount of calls was reached'));
				}
			});
	}

	callPFunc();
	return d.promise;
}

module.exports = onlySuccess;
