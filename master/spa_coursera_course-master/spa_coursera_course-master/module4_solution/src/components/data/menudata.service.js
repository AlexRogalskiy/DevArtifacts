(function (){
'use strict';

angular.module('data')
  .service('MenuDataService', menuDataService);


menuDataService.$inject = ['$q', '$http'];
function menuDataService($q, $http) {
  var service = this;

  service.getAllCategories = function () {
    var deffered = $q.defer();

    $http.get('https://davids-restaurant.herokuapp.com/categories.json')
      .then(function (response) {
        deffered.resolve(response);
      })
      .catch(function (response) {
        deferred.reject(response);
      });

    return deffered.promise;
  }


service.getItemsForCategory = function (categoryShortName) {
   var deffered = $q.defer();

    $http.get('https://davids-restaurant.herokuapp.com/menu_items.json?category=' + categoryShortName)
      .then(function (response) {
        deffered.resolve(response);
      })
      .catch(function (response) {
        deferred.reject(response);
      });

    return deffered.promise;
  }
}

})();
