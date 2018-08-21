'use strict';

/**
 * @ngdoc function
 * @name angularRestConsumerApp.services:JenkinsAPI
 * @description
 * # JenkinsAPI
 * Controller of the angularRestConsumerApp
 */

angular.module('angularRestConsumerApp').
  factory('jenkinsRESTService', function($http) {

    var hostname = 'localhost';
    var port = '8081';
    var prefix = '/';
    var url = 'http://' + hostname + ':' + port + prefix;

    var jenkinsAPI = {};

    jenkinsAPI.getJobs = function() {
      var restUrl = url + 'api/json?tree=jobs[name,url,color]';
      return $http.get(restUrl);
    };

    jenkinsAPI.getJobDetails = function(id) {
      var restUrl = url + 'job/' + id + '/api/json';
      return $http.get(restUrl);
    };

    jenkinsAPI.getJobBuildDetails = function(job, build) {
      var restUrl = url + 'job/' + job + '/' + build + '/api/json';
      return $http.get(restUrl);
    };


    return jenkinsAPI;
  });
