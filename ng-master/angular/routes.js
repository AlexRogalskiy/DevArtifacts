var ProductsApp = angular.module("products", ["ngResource", "ngRoute"]);

ProductsApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when("/", { controller: "ProductsCtrl" }).
    when("/products/new", {
      controller:  "ProductNewCtrl as productFormCtrl",
      templateUrl: "/templates/form.html"
    }).
    when("/products/:id/edit", {
      controller:  "ProductEditCtrl as productFormCtrl",
      templateUrl: "/templates/form.html"
    }).
    when("/products/:id", {
      controller:  "ProductCtrl as productCtrl",
      templateUrl: "/templates/show.html"
    }).
    otherwise({ redirectTo: "/" });
}]);
