(function () {
'use strict';

var events = {
  templateUrl: 'src/components/components/events.html',
  bindings: {
    data: '<'
  },
  controller: function () {
    var vm = this;
    vm.events = [1, 2, 3];
    vm.users = [];

    vm.$onInit = function () {
       console.log('init events component', vm.data);
       vm.users = vm.data;
    }

    vm.$onChanges = function() {
      console.log('changed');
      vm.users = vm.data;
    }
  }
}

angular
  .module('app')
  .component('myEvents', events);

}());
