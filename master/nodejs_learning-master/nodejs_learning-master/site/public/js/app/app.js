//(function (){
"use strict";

    var app = angular.module('app', ['ngResource', 'ngRoute']);

    // app.config(function ($routeProvider, $locationProvider) {
    	
    //     avoid hash-bang in url
    //     $locationProvider.html5Mode(true);
    	
    //     routes for Contacts page
    //     $routeProvider
    // 		.when('/contacts/new', { 
    //             templateUrl: 'js/app/templates/contacts/newContact.ejs', 
    //             controller: 'newContactCtrl'
    //         })            
    // });
    
    

    app.controller('mainCtrl', function ($scope){
        $scope.myVar = 'Hello Angular!';
    });


    app.controller('eventsCtrl', function ($scope, eventsData, $resource) {          
            
            $scope.eventSortOrder = '-votes';             
            
            $scope.events = eventsData.query();                        
            
            $scope.upVote = function (event) {
                event.votes += 1;
            };
            
            $scope.downVote = function (event) {
                event.votes -= 1;
            };


            
            // create resource
            $scope.saveUser = function (saveUserForm) {
               var newUser = $resource('http://localhost:4000/users');
               
                newUser.save($scope.user, function (data) {
                    console.log(data);
                }); 
            };


            $scope.deleteUser = function (id) {                
               console.log(id);
            }           

            
    });


    // About page controller
    app.controller('aboutCtrl', function ($scope, $location, $anchorScroll) {
        $scope.scrollTo = function (hash) {
            $location.hash(hash);            
            $anchorScroll();
        };
    });


    // custom filter
    app.filter('aditionToBody', function () {
        return function (input) {
            return input + "ADITION FROM FILTER";
        };
    });    


//}());
