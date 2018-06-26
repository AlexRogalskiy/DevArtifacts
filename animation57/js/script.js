'use strict';
angular.module('BinaryClock', [])
.controller('ClockCtrl', ['$scope', '$interval',
	function( $scope, $interval ){
		
		$scope.time = {
			hours : 23,
			minutes: 59,
			seconds: 59
		};
		
		var dec2bin = function (dec){
    	return (dec >>> 0).toString(2);
		};
		
		var clockTimer = $interval(function(){
			var dt = new Date(Date.now());
			$scope.time.raw = dt.toString();
			$scope.time.hours		= dec2bin( dt.getHours() ).toString(); 
			$scope.time.minutes	= dec2bin( dt.getMinutes() ).toString(); 
			$scope.time.seconds = dec2bin( dt.getSeconds() ).toString(); 
			// $scope.time.hours		= dec2bin( 23 ).toString(); 
			// $scope.time.minutes	= dec2bin( 59 ).toString(); 
			// $scope.time.seconds = dec2bin( 59 ).toString();
			
			while($scope.time.hours.length < 5) {
				$scope.time.hours = String("0" + $scope.time.hours)
			}
			
			while($scope.time.minutes.length < 6) {
				$scope.time.minutes = String("0" + $scope.time.minutes)
			}
			
			while($scope.time.seconds.length < 6) {
				$scope.time.seconds = String("0" + $scope.time.seconds)
			}
			
			$scope.time.hours = $scope.time.hours.split("");
			$scope.time.minutes = $scope.time.minutes.split("");
			$scope.time.seconds = $scope.time.seconds.split("");
		}, 500);
	}
]);