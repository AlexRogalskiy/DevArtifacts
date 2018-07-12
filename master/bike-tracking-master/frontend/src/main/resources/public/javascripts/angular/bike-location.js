var entrypoint = function () {
  console.log("creating entrypoint");
    var directives = angular.module("directives");
    var controllers = angular.module("controllers");

    var mapDirective = directives.directive("mapDirective", function () {
        console.log("create directive");
        return {
            controller: 'MapController',
            templateUrl: "/fragments/bikelocation.html"
            };
    });
    mapDirective.$inject = [];

    var MapController = controllers.controller("MapController", function ($scope, $http) {
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
        //mock data
        var fogie = {
        "trackerMessageId":1475,
        "imei":"357454071854283",
        "timestamp":1488308177000,
        "gpsElement":{
            "gpsElementId":1475,
            "latitude":53.804805,
            "longitude":-1.5440366,
            "altitude":0,
            "angle":0,
            "satellites":0,
            "speed":0,
            "geocodedLocation":{
                "id":1298,
                "street":"Inner Ring Road",
                "postalCode":"LS2 8BQ",
                "adminArea5":"Leeds",
                "adminArea4":"",
                "adminArea3":"England",
                "adminArea2":null,
                "adminArea1":"GB"
                },
            "latLngString":"53.804805,-1.5440366"
            },
            "ioEvents":[
                {"ioEventId":5536,"type":1,"value":0},
                {"ioEventId":5537,"type":240,"value":0},
                {"ioEventId":5538,"type":66,"value":12669}
            ]
        }

        $scope.getCarState = function() {
            var ioEvents = $scope.carData.ioEvents;
            var movementState = 0;
            for (var iter in ioEvents){
                var ioEvent = ioEvents[iter];
                if (ioEvent.type == 240) {
                    movementState = ioEvent.value;
                }
            }
            return movementState == 1 ? "In Transit" : "Stationary";
        }

        $scope.getCarAddress = function() {
             var geocodedLocation = $scope.carData.gpsElement.geocodedLocation;
             var address = "";
             var components = ['street', 'adminArea5', 'adminArea4', 'adminArea3', 'adminArea2', 'postalCode'];
             for (var index in components) {
                var value = geocodedLocation[components[index]];
                console.log(value);
                if (value) {
                address += value + " ";
                }
             }
             return address;
        }

        $scope.markers = {};
        $scope.carData = {};

        function setCarData(carData) {
            $scope.carData = carData;
        }

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
            },
            defaults: {
//                doubleClickZoom: false,
//                scrollWheelZoom: false,
                attributionControl: false,
//                dragging:false,
//                zoomControl:false
            }
        });
        updateMarkers(fogie);
        setCarData(fogie);

        setTimeout(updateUi, 100);
        function updateUi() {
            console.log("get driver details");
           $http({
                    method: 'GET',
                    url: '/whereisfogie/location'
                }).then(function successCallback(response) {
                    var cars = response.data;
                    updateMarkers(cars);
                    setCarData(cars);
                }, function errorCallback(response) {
                    console.log(response);
                    updateMarkers(fogie);
                    setCarData(fogie);
                });
                setTimeout(updateUi, 60000);
        }


    });
    MapController.$inject = ["$scope", "$http"];


}();