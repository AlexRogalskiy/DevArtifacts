'use strict';

/**
 * @ngdoc function
 * @name angularRestConsumerApp.controller:BuildCtrl
 * @description
 * # BuildCtrl
 * Controller of the angularRestConsumerApp
 */
angular.module('angularRestConsumerApp')
  .controller('BuildCtrl', function ($scope, $routeParams, jenkinsRESTService) {

    $scope.buildNumber = $routeParams.buildNumber;
    $scope.jobname = $routeParams.jobname;

    /**
     * Get build details from Jenkins
     */
    jenkinsRESTService.getJobBuildDetails($scope.jobname, $scope.buildNumber).success(function(response) {
      console.log(response.fullDisplayName);
      $scope.build = response;
    });

  });
