"use strict";

var app = angular.module('app', ['ngRoute', 'ngResource']);


app.config(function ($routeProvider, $locationProvider) {
    
    // avoid hash-bang in url
    $locationProvider.html5Mode(true);
    
    //routes for Contacts App
    $routeProvider
        .when('/contacts', {
            templateUrl: 'js/contact_app/templates/list.html',
            controller: 'ContactsCtrl'
        })
        .when('/contacts/new', { 
            templateUrl: 'js/contact_app/templates/newContact.html', 
            controller: 'newContactCtrl'
        })            
});