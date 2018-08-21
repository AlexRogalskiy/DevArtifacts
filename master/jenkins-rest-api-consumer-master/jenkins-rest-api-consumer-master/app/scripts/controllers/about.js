'use strict';

/**
 * @ngdoc function
 * @name angularRestConsumerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the angularRestConsumerApp
 */
angular.module('angularRestConsumerApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
