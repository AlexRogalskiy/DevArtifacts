ProductsApp.controller("ProductsCtrl", function($resource, $rootScope) {
  var Products = $resource('/products.json');
  this.get = function() {
    this.products = Products.query();
  };
  $rootScope.$on("products.updated", this.get.bind(this));
});

ProductsApp.controller("ProductCtrl", function($resource, $routeParams) {
  var Product = $resource('/products/:id.json', { id: "@id" });
  this.product = Product.get({ id: $routeParams.id });
});

ProductsApp.controller("ProductEditCtrl", function($resource, $routeParams,
  $location, $rootScope) {

  var Product = $resource('/products/:id.json',
    { id: "@id" },
    { update: { method: 'PUT' } }
  );

  var id = $routeParams.id;
  this.product = Product.get({ id: id });

  this.saveProduct = function() {
    var self = this;
    Product.update(self.product, function() {
      alert("Product Updated");
      $location.path("/products/" + self.product.id);
      $rootScope.$broadcast("products.updated");
    });
  };
});

ProductsApp.controller("ProductNewCtrl", function($resource, $location,
  $rootScope) {

  var Product = $resource('/products.json');
  this.product = new Product();

  this.saveProduct = function() {
    var self = this;
    Product.save(self.product, function(product) {
      alert("Product Created");
      self.product = product;
      $location.path("/products/" + self.product.id);
      $rootScope.$broadcast("products.updated");
    });
  };
});
