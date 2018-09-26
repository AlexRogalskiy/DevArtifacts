// custom service
app.factory('eventsData', function ($resource, $timeout) {
    "use strict";
    
    return $resource('http://localhost:4000/users');
    
});
    


// var getUsersData = function (callback){
//         $http.get('http://localhost:4000/users').
//             success(function(data, status, headers, config) {
//                 callback(data);
//              }).
//             error(function(data, status, headers, config) {
//                 $log.warn(data);
//             });
//     };

//     return {
//         'getUsersData': getUsersData
//     };