// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

    .run(function ($ionicPlatform, $http, $cordovaGeolocation, $interval, $cordovaMedia, $timeout) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            var isPlaying = false;
            var media = $cordovaMedia.newMedia('/android_asset/www/test.wav');
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
            $interval(function () {
                var posOptions = {timeout: 10000, enableHighAccuracy: true};
                $cordovaGeolocation
                    .getCurrentPosition(posOptions)
                    .then(function (position) {
                        console.log(JSON.stringify(position));
                        $http.post('https://api-eu.clusterpoint.com/741/barracuda/.json',
                            {
                                "id": new Date().getTime(),
                                lat: position.coords.latitude,
                                long: position.coords.longitude
                            });
                    }, function (err) {
                        console.log(JSON.stringify(err));
                        console.log(err);
                    });
            }, 60000);

            $interval(function () {
                $http.get('https://api-eu.clusterpoint.com/741/barracuda/911/.json')
                    .success(function (data) {
                        console.log('DATA PROVIDED' + JSON.stringify(data));
                        if (data.documents['911'].funcId === 'alarm' && isPlaying === false) {
                            isPlaying = true;
                            $timeout(function () {
                                isPlaying = false;
                                media.stop();
                                $http.put('https://api-eu.clusterpoint.com/741/barracuda/911/.json',
                                    {
                                        "funcId": "not",
                                        "timestamp": "1432428918002",
                                        "id": "911"
                                    });
                            }, 5000);
                            media.play();
                        }
                    })
                    .error(function (data) {
                        console.log('DATA NOT PROVIDED' + JSON.stringify(data))
                    });
            }, 10000);

        });
    })

    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })

            .state('app.search', {
                url: "/search",
                views: {
                    'menuContent': {
                        templateUrl: "templates/search.html"
                    }
                }
            })

            .state('app.browse', {
                url: "/browse",
                views: {
                    'menuContent': {
                        templateUrl: "templates/browse.html"
                    }
                }
            })
            .state('app.playlists', {
                url: "/playlists",
                views: {
                    'menuContent': {
                        templateUrl: "templates/playlists.html",
                        controller: 'PlaylistsCtrl'
                    }
                }
            })

            .state('app.single', {
                url: "/playlists/:playlistId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/playlist.html",
                        controller: 'PlaylistCtrl'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/playlists');
        $httpProvider.defaults.headers.common['Authorization'] = 'Basic cm9vdEBqYXZhYmVhbi5ydToyNDgwMXg=';
    });


