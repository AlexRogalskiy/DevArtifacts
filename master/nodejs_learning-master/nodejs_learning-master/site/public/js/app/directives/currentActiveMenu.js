// "use strict";

// app.directive('currentActiveMenu', function ($location) {
    
//     var link = function (scope, element, attrs) {
//         scope.$watch(function() { return $location.path(); }, 
//         function (path) {
//             var elements = element.find('li'),
//                 i = 0,
//                 length = elements.length;

//             console.log(path);



//             // if (url) {
//             //     //url = url.substring(1);
//             //     console.log(url)
//             // }

//             // if (path == url) {
//             //     element.addClass("active");
//             // } else {
//             //     element.removeClass('active');
//             // }

//         });
//     };

//     return {
//         restrict: 'A',
//         link: link
//     }
// });