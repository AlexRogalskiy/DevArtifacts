"use strict";

app.directive('mySample', function ($compile) {
    return {
        restrict: 'A', // E - element, A - attr, C - class, default is A
        template: "<input type='text' ng-model='sampleData' /> {{ sampleData }}<br/><hr>",
        scope: {
            
        }
    };
});