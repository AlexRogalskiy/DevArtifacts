(function () {
'use strict';

angular
  .module('LunchCheck', [])
  .controller('LunchCheckController', LunchCheckController);

LunchCheckController.$inject = ['$scope'];

function LunchCheckController($scope) {
  $scope.lunch = {};
  $scope.lunch.menu = '';
  $scope.lunch.message = '';
  $scope.lunch.CheckIfTooMuch = CheckIfTooMuch;


  function CheckIfTooMuch() {
    if (!$scope.lunch.menu) {
      $scope.lunch.message = 'Please enter data first';
      return;
    }

    var numberOfItems = cleanFromEmptyOrSpacesValues($scope.lunch.menu.split(','));

    if (numberOfItems.length <= 3) {
      $scope.lunch.message = 'Enjoy!';
    } else {
      $scope.lunch.message = 'Too much!';
    }
  }

  function cleanFromEmptyOrSpacesValues(list) {
    var output = list.filter(function (item) {
      return Boolean(item.trim());
    });

    return output;
  }
}

})();
