// githubViewer module
(function() {

var app = angular.module('githubViewer', []);

var mainController = function($scope, github, $interval, $log, $anchorScroll, $location) {
	
	// default username
	$scope.username = 'python';	
	
	
	// get user data and repos
	var onUserComplete = function(data) {
		$scope.user = data;
		github.getRepos($scope.user).then(onRepos, onError);

		// erase error message
		$scope.error_message = null;
		console.log($scope.user);

		$location.hash('user_details');
		$anchorScroll();
	};

	
	// get all repos for particular user
	var onRepos = function(data) {
		$scope.repos = data;
		console.log($scope.repos);
	};

	
	// Error, when user not found
	var onError = function(reason) {
		$scope.error_message = 'User not found (404)';
		// errase previous user data
		$scope.user = null;
		$log.error('User not found (404)');
	};	

	
	// seach user info from github
	$scope.search = function(username) {
		$log.info('searching for ' + username);
		// retrieve user data
		github.getUser(username).then(onUserComplete, onError);

		// stop if startCountDown is on
		if (countDownInterval) {
			$interval.cancel(countDownInterval);
			$scope.countdown = null;
		};
	};

	
	// wait 5 seconds and search automatically
	var decrementCountDown = function() {
		$scope.countdown -= 1;
		if ($scope.countdown === 0) {
			$scope.search($scope.username);
		}
	};

	var countDownInterval = null;
	var startCountDown = function() {
		countDownInterval = $interval(decrementCountDown, 1000, $scope.countdown);
	};

	// Sorting, default value
	$scope.repoSortOrder = '-name';
	$scope.countdown = 5;

	startCountDown();	
		
};

app.controller('mainController', mainController);

}());