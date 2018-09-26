"use strict";

app.controller('ContactsCtrl', function ($scope, ContactSvc) {
    $scope.contacts = ContactSvc.query();
    // which fields to display
    $scope.fields = ['name', 'created', 'hash'];

    $scope.sort = function (field) {    	
    	$scope.sort.field = field;
    	$scope.sort.order = !$scope.sort.order
    };
    
    $scope.sort.field = 'name';
    $scope.sort.order = false;    
});