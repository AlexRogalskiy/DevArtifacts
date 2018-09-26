(function () {
'use strict';

var buyList = [
  { name: "cookies", quantity: 10 },
  { name: "Sprite", quantity: 4 },
  { name: "Red Bull", quantity: 3 },
  { name: "snickers", quantity: 1 },
  { name: "bounty", quantity: 6 },
];

angular
  .module('ShoppingListCheckOff', [])
  .controller('ToBuyController', ToBuyController)
  .controller('AlreadyBoughtController', AlreadyBoughtController)
  .service('ShoppingListCheckOffService', ShoppingListCheckOffService);

ToBuyController.$inject = ['ShoppingListCheckOffService'];
AlreadyBoughtController.$inject = ['ShoppingListCheckOffService'];


function ToBuyController(ShoppingListCheckOffService) {
  var vm = this;
  vm.toBuyItems = ShoppingListCheckOffService.toBuyItems;
  vm.buyItem = buyItem;

  function buyItem(item, index) {
    ShoppingListCheckOffService.buyItem(item, index);
  }
}


function AlreadyBoughtController(ShoppingListCheckOffService) {
  var vm = this;
  vm.boughtItems = ShoppingListCheckOffService.boughtItems;
}


function ShoppingListCheckOffService() {
  var service = this;
  var toBuyItems = buyList;
  var boughtItems = [];

  function getToBuyItems() {
    return toBuyItems;
  };

  function getboughtItems() {
    return boughtItems;
  };

  service.buyItem = function (item, index) {
    boughtItems.push(item);
    toBuyItems.splice(index, 1);
  };

  service.toBuyItems = getToBuyItems();
  service.boughtItems = getboughtItems();

  return service;
}


})();


