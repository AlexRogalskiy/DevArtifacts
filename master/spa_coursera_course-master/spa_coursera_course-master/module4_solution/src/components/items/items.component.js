(function () {
'use strict';

angular.module('items')
.component('itemsList', {
  templateUrl: 'src/components/items/items.component.html',
  bindings: {
    items: '<'
  }
});

})();
