"use strict";
(function () {

    angular.module("minimalg", ["ui.router",
        "ui.bootstrap",
        'satellizer',
        'restangular',
        'toaster',
        'mg.places',
        'mg.faces',
        'mg.templates',
        'mg.common'
    ])

        .config(function ($stateProvider, $urlRouterProvider, $sceProvider, RestangularProvider, $authProvider) {
            RestangularProvider.setBaseUrl('/api/v1');

            $urlRouterProvider.otherwise("/main/places");
            $stateProvider
                .state("main", {
                    abtract: true,
                    url: "/main",
                    templateUrl: "app/main.html",
                    controller: 'MainCtrl'
                })
                .state("main.places", {
                    url: "/places",
                    templateUrl: "app/places/places.tpl.html",
                    controller: 'PlacesCtrl',
                    resolve: {
                        authenticated: ['$location', '$auth', function ($location, $auth) {
                            if (!$auth.isAuthenticated()) {
                                return $location.path('/main/login');
                            }
                        }]
                    }})
                .state("main.faces", {
                    url: "/faces",
                    templateUrl: "app/faces/faces.tpl.html",
                    controller: 'FacesCtrl',
                    resolve: {
                        authenticated: ['$location', '$auth', function ($location, $auth) {
                            if (!$auth.isAuthenticated()) {
                                return $location.path('/main/login');
                            }
                        }]
                    }})
                .state("main.login", {
                    url: "/login",
                    templateUrl: "app/login/login.tpl.html",
                    controller: 'LoginCtrl'})
                .state('logout', {
                    url: '/logout',
                    template: null,
                    controller: 'LogoutCtrl'
                });

            $authProvider.facebook({
                clientId: '657854390977827'
            });

            $authProvider.google({
                clientId: '631036554609-v5hm2amv4pvico3asfi97f54sc51ji4o.apps.googleusercontent.com'
            });
        })

        .controller("MainCtrl", ['$rootScope', '$scope', '$log' , '$state', '$modal', 'Restangular', '$location', '$auth',
            function ($rootScope, $scope, $log, $state, $modal, Restangular, $location, $auth) {
                $scope.test = 'pupa';
                $scope.navbarCollapsed = true;
                $scope.isActive = function (viewLocation) {
                    return viewLocation === $location.path();
                };

                $scope.isAuthenticated = function () {
                    return $auth.isAuthenticated();
                };

            }]
    )


        .controller("LoginCtrl", ['$rootScope', '$scope', '$auth', 'toasterService',
            function ($rootScope, $scope, $auth, toasterService) {
                $scope.login = function () {
                    $auth.login({ email: $scope.email, password: $scope.password })
                        .then(function () {
                            toasterService.success('You have successfully logged in');
                        })
                        .catch(function (response) {
                            toasterService.error(response.data.message);
                        });
                };
                $scope.authenticate = function (provider) {
                    $auth.authenticate(provider)
                        .then(function () {
                            toasterService.success('You have successfully logged in');
                        })
                        .catch(function (response) {
                            toasterService.error(response.data);
                        });
                };
            }])
        .controller("LogoutCtrl", ['$rootScope', '$scope', '$auth', 'toasterService',
            function ($rootScope, $scope, $auth, toasterService) {
                if (!$auth.isAuthenticated()) {
                    return;
                }
                $auth.logout()
                    .then(function () {
                        toasterService.success('You have logged out');
                    });
            }]);

    angular.module('mg.places', []);
    angular.module('mg.faces', []);
    angular.module('mg.common', []);
}());