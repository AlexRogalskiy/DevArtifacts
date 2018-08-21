'use strict';

/**
 * @ngdoc overview
 * @name angularRestConsumerApp
 * @description
 * # angularRestConsumerApp
 *
 * Main module of the application.
 */
angular
  .module('angularRestConsumerApp', [
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/jobs', {
        templateUrl: 'views/jobs.html',
        controller: 'JobsCtrl'
      })
      .when('/jobs/:jobname', {
        templateUrl: 'views/job.html',
        controller: 'JobCtrl'
      })
      .when('/jobs/:jobname/:buildNumber', {
        templateUrl: 'views/build.html',
        controller: 'BuildCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
