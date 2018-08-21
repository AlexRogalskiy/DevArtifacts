'use strict';

/**
 * @ngdoc function
 * @name angularRestConsumerApp.controller:JobCtrl
 * @description
 * # JobCtrl
 * Controller of the angularRestConsumerApp
 */
angular.module('angularRestConsumerApp')
  .controller('JobCtrl', function ($scope, $routeParams, jenkinsRESTService) {

    $scope.jobname = $routeParams.jobname;
    $scope.job = null;
    $scope.builds = [];

    /**
     * Get jobs details from Jenkins
     */
    jenkinsRESTService.getJobDetails($scope.jobname).success(function(response) {
      console.log(response.displayName);
      $scope.job = response;
      $scope.builds = response.builds;
    });

  });
