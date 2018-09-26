(function () {
'use strict';

angular
  .module('app')
  .component('myCalendar', {
    templateUrl: 'src/components/components/calendar.html',
    controllerAs: 'vm',
    controller: calendarController
  });

function fetchUsers($http) {
  var url = 'https://jsonplaceholder.typicode.com/users';
  return $http.get(url).then(function (response) {
    return response.data;
  });
}

calendarController.$inject = ['$http'];
function calendarController($http) {
    var vm = this;
    vm.users = [];

    vm.$onInit = function () {
      console.log('on init component');
      fetchUsers($http).then(function (data) {
        console.log('response', data);
        vm.users = data;
      });
    }

    vm.$onDestroy = function () {
      console.log('destroyed calendar component');
    }
    vm.message = 'calendar message';
  }

}());
