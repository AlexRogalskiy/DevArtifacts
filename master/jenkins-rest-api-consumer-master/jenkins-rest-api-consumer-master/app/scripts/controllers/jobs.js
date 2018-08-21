'use strict';

/**
 * @ngdoc function
 * @name angularRestConsumerApp.controller:JobsCtrl
 * @description
 * # JobsCtrl
 * Controller of the angularRestConsumerApp
 */
angular.module('angularRestConsumerApp')
  .controller('JobsCtrl', function ($scope, jenkinsRESTService) {
    $scope.jobFilter = null;
    $scope.jobsList = [];

    /**
     * Filter jobs
     */
    $scope.jobSearchFilter = function(job) {
      var keyword = new RegExp($scope.jobFilter, 'i');
      return !$scope.jobFilter || keyword.test(job.url) || keyword.test(job.color);
    };

    /**
     * Get all jobs [name, url, color] from Jenkins
     */
    jenkinsRESTService.getJobs().success(function(response) {
      console.log(response.jobs);
      angular.forEach(response.jobs, function(job) {
        if (job.color) {
          this.push(job);
        }
      }, $scope.jobsList);
      //$scope.jobsList = response.jobs;
    });

  });
