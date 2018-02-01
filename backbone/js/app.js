$(function(globals) {

	var showNotice = function(code, notice) {
		var model = { code: code, message: notice };
		var noticeView = new NoticeView({model: model});
	};

	Product = Backbone.Model.extend({
		defaults: {
			name: 		 "",
			description: "",
			price: 		 ""
		},
		url: function() {
			return (this.isNew() ? "/products.json" : "/products/" + this.id + ".json");
		}
	});

	ProductsCollection = Backbone.Collection.extend({
		model: Product,
		url: '/products.json'
	});

	ProductView = Backbone.View.extend({
		template: $("#product_template"),
		initialize: function() {
			this.render();
		},
		events: {
			"click .delete": "remove"
		},
		remove: function(e) {
			console.log("asdf");
			//e.preventDefault();
			var self = this;
			this.model.destroy({
				success: function(data) {
					//self.remove();
				},
				error: function(data, error) {
					showNotice("010", "ERROR: cannot delete product");
					// $("#notice").html("ERROR: cannot delete product");
				}
			});
			globals.router.navigate("#");
		},
		render: function() {
			var html = Mustache.to_html(this.template.html(), this.model.toJSON());
			$(this.el).html(html);
			return this;
		}
	});

	ListView = Backbone.View.extend({
		el: $("#list"),
		template: $("#product_template"),
		initialize: function() {
			this.collection.bind("add", this.renderProduct, this);
			this.render();
		},
		renderProductBefore: function(product) {
			var productView = new ProductView({model: product});
			this.el.prepend(productView.render().el)
		},
		renderProduct: function(product) {
			var productView = new ProductView({model: product});
			this.el.append(productView.render().el)
		},
		render: function() {
			if(this.collection.length > 0) {
				this.collection.each(this.renderProduct, this);
			} else {
				showNotice("010", "There are not products to display");
				// $("#notice").html("There are not products to display");
			}
		}
	});

	ProductsRouter = Backbone.Router.extend({
		routes: {
			"new": "newProduct",
			"": "index"
		},
		newProduct: function() {
			new FormView({model: new Product()});
		},
		index: function() {
			globals.products.fetch({
				success: function() {
					new ListView({collection: globals.products});
				},
				error: function() {
					showNotice("010", "Cannot load products list");
					// $("#notice").html("Cannot load products list");
				}
			});
		}
	});

	FormView = Backbone.View.extend({
		el: $("#form"),
		template: $("#product_form_template"),
		initialize: function() {
			this.render();
		},
		events: {
			"click .delete": "remove"
		},
		events: {
			"click #cancel": "close",
			"submit form": "save"
		},
		remove: function(e) {
			console.log("destroy");
		},
		close: function(e) {
			$(this.el).unbind();
			$(this.el).empty();
			globals.router.navigate("#");
		},
		save: function(e) {
			e.preventDefault();
			data = {
				name: 		 $("#product_name").val(),
				description: $("#product_description").val(),
				price: 		 $("#product_price").val()
			};
			var self = this;
			this.model.save(data, {
				success: function(model, response) {
					$("#notice").html("Product saved.");
					globals.products.add(self.model);
					globals.router.navigate("#");
					self.close();
				},
				error: function(model, response) {
					showNotice("010", "ERROR: cannot save product");
					// $("#notice").html("ERROR: cannot save product");
				}
			});
		},
		render: function() {
			var html = Mustache.to_html(this.template.html(), this.model.toJSON());
			$(this.el).html(html);
		}
	});

	NoticeView = Backbone.View.extend({
		el: $("#notice"),
		template: $("#product_notice"),
		initialize: function() {
			this.render();
		},
		render: function() {
			var html = Mustache.to_html(this.template.html(), this.model);
			$(this.el).html(html);
		}
	});

	globals.products = new ProductsCollection();
	$.ajaxSetup({ cache: false });
	globals.router = new ProductsRouter();
	Backbone.history.start();
}(window));