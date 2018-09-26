(function () {
'use strict';

angular
  .module('app')
  .config(RoutesConfig);

RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
function RoutesConfig($stateProvider, $urlRouterProvider) {

  // Redirect to home page if no other URL matches
  $urlRouterProvider.otherwise('/');

  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'src/components/home/home.html'
  })

  .state('categories', {
    url: '/categories',
    templateUrl: 'src/components/categories/categories.html',
    controller: 'CategoriesController',
    controllerAs: 'categories',
    resolve: {
      data: ['MenuDataService', function (MenuDataService) {
        return MenuDataService.getAllCategories();
      }]
    }
  })

  .state('categories.items', {
    url: '/{categoryShortName}/items',
    templateUrl: 'src/components/items/items.html',
    controller: 'ItemsController',
    controllerAs: 'items',
    params: {
      categoryShortName: null
    },
    resolve: {
      categoriesItems: ['MenuDataService', '$stateParams', function (MenuDataService, $stateParams) {
        return MenuDataService.getItemsForCategory($stateParams.categoryShortName);
      }]
    }
  });
}

})();
