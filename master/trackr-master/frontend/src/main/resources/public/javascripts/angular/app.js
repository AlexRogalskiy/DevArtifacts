var entrypoint = function () {
    console.log("starting application");
    var main = angular.module("main", ["controllers", "services", "directives", "leaflet-directive"]);

    var controllers = angular.module("controllers", []);
    var services = angular.module("services", []);
    var directives = angular.module("directives", []);
    console.log("created controller, service, directives");

    main.run(function ($rootScope, $timeout) {
        $rootScope.$on('$viewContentLoaded', function () {
            $timeout(function () {
                componentHandler.upgradeAllRegistered();
            })
        })
    });


    //MAPS
    var mapDirective = directives.directive("mapDirective", function () {
        console.log("create directive");
        return {
            controller: "MapController",
            template: "<style>html {height: 100%;} .mapContainer { position: absolute; height: 100%; width: 100%;}</style> <div class='mapContainer' style='z-index: 1'><leaflet width='100%' height='100%' markers='markers' center='ukCenter'></leaflet></div>"
        };
    });



    mapDirective.$inject = [];


    var mapController = controllers.controller("MapController", function ($scope, $http) {
        console.log("creating map controller");
        var local_icons = {
            default_icon: {},
            active_icon: {
                iconUrl: 'https://cdn2.iconfinder.com/data/icons/function_icon_set/circle_green.png',
                iconSize: [20, 20]
            },
            idle_icon: {
                iconUrl: 'https://cdn2.iconfinder.com/data/icons/function_icon_set/circle_orange.png',
                iconSize: [20, 20]
            },
            inactive_icon: {
                iconUrl: 'https://cdn2.iconfinder.com/data/icons/function_icon_set/circle_red.png',
                iconSize: [20, 20]
            }
        };

        $scope.markers = {};

        $http({
            method: 'GET',
            url: '/whereisfogie/location'
        }).then(function successCallback(response) {
            var cars = response.data;
            updateMarkers(cars);
        }, function errorCallback(response) {
            console.log(response);
        });

        function updateMarkers(car) {
            $scope.markers = {};
            console.log(car)
                $scope.markers[car.imei] = {
                    lat: car.gpsElement.latitude,
                    lng: car.gpsElement.longitude,
                    message: "Fogie",
                    draggable: false,
                    icon: local_icons.inactive_icon

            }
             $scope.ukCenter.lat = car.gpsElement.latitude;
             $scope.ukCenter.lng = car.gpsElement.longitude;
             $scope.ukCenter.zoom = 16;
        }
        angular.extend($scope, {
            ukCenter: {
                lat: 53.490395,
                lng: -2.252197,
                zoom: 10
            }
        });
    });
    mapController.$inject = ["$scope", "$http"];


}();