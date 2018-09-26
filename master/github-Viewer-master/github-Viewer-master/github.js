// github custom service
(function() {

	var github = function($http) {

		// github api url
		var api_user_url = 'https://api.github.com/users/';

		// get user data
		var getUser = function(username) {
			return $http.get(api_user_url + username)
						.then(function(response){
							return response.data;
						});
		};	
		

		// get all repos for particular user
		var getRepos = function(user) {
			return $http.get(user.repos_url)
						.then(function(response){
							return response.data;
						});
		};

		return {
			'getUser' : getUser,
			'getRepos' : getRepos
		};
	};

	var module = angular.module('githubViewer');
	
	// register service
	module.factory('github', github);


}());