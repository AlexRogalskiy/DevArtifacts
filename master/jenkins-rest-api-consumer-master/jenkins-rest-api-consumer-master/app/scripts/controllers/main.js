'use strict';

/**
 * @ngdoc function
 * @name angularRestConsumerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularRestConsumerApp
 */
angular.module('angularRestConsumerApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
