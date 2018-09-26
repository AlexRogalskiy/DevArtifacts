(function () {
'use strict';

angular
  .module('items')
  .controller('ItemsController', itemsController);

itemsController.$inject = ['data', 'categoriesItems'];
function itemsController(data, categoriesItems) {
  var vm = this;
  vm.category = categoriesItems.data.category.name;
  vm.menu_items = categoriesItems.data.menu_items;

  console.log('categoriesItems', categoriesItems);
  console.log('data from parent state: ', data);
}

})();
