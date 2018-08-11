var app = angular.module('loadingApp', ['ngAnimate']);

var controllers = {};
app.controller(controllers);

controllers.globalController = function ($scope) {
	
}

app.directive('imageLoader', function() {
	return {
		restrict: 'E',
		template: '<div images-wrap class="images-wrap"><img class="hd-img" data-hd-img src="{{hdImage}}"><img class="ld-img" data-ld-img src="{{ldImage}}"></div>',
		scope: {
			hdImage: '@hdImage',
			ldImage: '@ldImage'  
		},
		link: function(scope, elem, attrs) { 
			var wrap, hd, ld, hdUrl, ldUrl, hdRealW, hdRealH;
			wrap = $(elem[0]).find('[images-wrap]');
			hd = $(elem[0]).find('[data-hd-img]');
			ld = $(elem[0]).find('[data-ld-img]'); 
			hdUrl = scope.hdImage;
			ldUrl = scope.hdImage;
			
		  //get hd image height before it's in the DOM
		  var hdPreload = $("<img />");
		  hdPreload.attr("src", hdUrl);
		  hdPreload.unbind("load");
		  hdPreload.bind("load", function () {
		  	hdRealW = this.width;
		  	hdRealH = this.height;
		  	
		  	var wrapW = wrap.width();
		  	var wrapH = wrapW*hdRealH/hdRealW; 
		  	ld.width(wrapW);
		  	ld.height(wrapH);
		  });
		  
		  
		  hd.one('load', function() {
		  	hd.fadeIn(); 
		  	ld.fadeOut();
            //elem.attr('src', scope.hires);
        });  
		}
	};
});