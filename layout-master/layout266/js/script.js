// Angular JS Test App

(function(){
	
	var app = angular.module('store', []);
	
	app.controller("StoreController", function(){
		this.products = gems;
	});
	
	var imgPath = "http://pre05.deviantart.net/e7cc/th/pre/f/2012/199/0/8/";
	
	var gems = [ 
		{
			name : "Product 1",
			price: "2.50",
			description : "AngularJS is a toolset for building the framework most suited to your application development. AngularJS is a toolset for building the framework most suited to your application development. AngularJS is a toolset for building the framework most suited to your application development.",
			canPurchase : false,
			soldOut : true,
			image : imgPath + "gem_png_by_doloresdevelde-d57oyqr.png"
		},
		{
			name : "Product 2",
			price: "1.50",
			description : "AngularJS is a toolset for building the framework most suited to your application development. AngularJS is a toolset for building the framework most suited to your application development. AngularJS is a toolset for building the framework most suited to your application development.",
			canPurchase : true,
			soldOut : false,
			image : imgPath + "gem_png_by_doloresdevelde-d57oyqr.png"
		},
		{
			name : "Product 3",
			price: "1.25",
			description : "AngularJS is a toolset for building the framework most suited to your application development. AngularJS is a toolset for building the framework most suited to your application development. AngularJS is a toolset for building the framework most suited to your application development.",
			canPurchase : true,
			soldOut : false,
			image : imgPath + "gem_png_by_doloresdevelde-d57oyqr.png"
		},
		{
			name : "Product 4",
			price: "1.75",
			description : "AngularJS is a toolset for building the framework most suited to your application development. AngularJS is a toolset for building the framework most suited to your application development. AngularJS is a toolset for building the framework most suited to your application development.",
			canPurchase : true,
			soldOut : false,
			image : imgPath + "gem_png_by_doloresdevelde-d57oyqr.png"
		},
		{
			name : "Product 5",
			price: "3.50",
			description : "AngularJS is a toolset for building the framework most suited to your application development. AngularJS is a toolset for building the framework most suited to your application development. AngularJS is a toolset for building the framework most suited to your application development.",
			canPurchase : false,
			soldOut : true,
			image : imgPath + "gem_png_by_doloresdevelde-d57oyqr.png"
		},
		{
		
			name : "Product 6",
			price: "2.75",
			description : "AngularJS is a toolset for building the framework most suited to your application development. AngularJS is a toolset for building the framework most suited to your application development. AngularJS is a toolset for building the framework most suited to your application development.",
			canPurchase : true,
			soldOut : false,
			image : imgPath + "gem_png_by_doloresdevelde-d57oyqr.png"
		}
	]
})();