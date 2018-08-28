"use strict";
angular.module('mg.places')
    .controller('PlacesCtrl', ['$rootScope', '$scope','Restangular',

        function ($rootScope, $scope, Restangular) {
            $scope.model = {selected:'Moscow',places:[]};

            $scope.add = function(val){
                Restangular.one("city", val).get().then(function(data){
                    $scope.model.places.push({address:data.address, icon:data, temp:data.temp});
                    $scope.model.selected='';
                });
            };
        }
    ]);