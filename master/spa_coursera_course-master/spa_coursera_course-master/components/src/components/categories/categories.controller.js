(function () {
'use strict';

angular
  .module('categories')
  .controller('CategoriesController', categoriesController);


categoriesController.$inject = ['data'];
function categoriesController(data) {
  var vm = this;

  vm.data = data.data;
}

})();
