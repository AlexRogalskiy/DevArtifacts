"use strict";

app.directive('validateString', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, controller) {
            // some
        };      
    };

    function properLength(string) {
        return string.length > 5;
    }
});