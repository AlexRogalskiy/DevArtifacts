(function () {
'use strict';

angular.module('app', [
  // third-party
  'ui.router',
  // core
  'data',
  'categories',
  'items',
])
.run(runHandler);

runHandler.$inject = ['$rootScope'];
function runHandler($rootScope) {
  console.log('app is running');

  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    console.log('transition state error', error);
  });
}

})();
