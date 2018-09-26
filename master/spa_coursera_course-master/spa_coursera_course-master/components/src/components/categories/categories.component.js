(function () {
'use strict';

angular.module('categories')
.component('categoriesList', {
  templateUrl: 'src/components/categories/categories.component.html',
  bindings: {
    items: '<'
  }
});

})();
