"use strict";

app.directive('eventThumbnail', function ($compile) {
    return {
        restrict: 'E', // E - element, A - attr, C - class, default is A
        replace: true,
        templateUrl: 'js/app/templates/directives/eventThumbnail.html',
        scope: {
            event: "=event"
        }
    };
});