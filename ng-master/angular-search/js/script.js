var myApp = angular.module("myApp",[]);

// search form
myApp.directive("imageSearch", function($http){
  return {
    restrict: "A",
    link: function(scope,elem,attrs){
      
			var $element = angular.element(elem);
     
      $element.bind("submit", function(e){
        
        e.preventDefault();
        
        var searchTerm = document.getElementById("search").value,
            imageSearchUrl = "http://www.splashbase.co/api/v1/images/search?query=",
            fullQuery = imageSearchUrl+searchTerm,
            searchResult = {};
        
        		scope.searchedImages = "";
        		scope.noResults = false;
        
            $http.get(fullQuery).
              success(function(data, status, headers, config) {
              console.log(data);
              	if(data.images.length){
              		scope.searchedImages = data.images;
                }else{
                  scope.noResults = true;
                }
              }).
              error(function(data, status, headers, config) {
                console.log(data);
              });
        
      });
      
      
    }
  }
});

// random background image
myApp.factory("bgImage", function($http){
	
	var bgImage = {},
	remoteAPI = "http://www.splashbase.co/api/v1/images/random";
	
	bgImage.getImages = function(){
		return $http({
			method: "GET",
			url: remoteAPI
		});
	}
	
	return bgImage;
	
});

myApp.controller("myCtrl", function($scope,bgImage){
  
	bgImage.getImages().success(function(response){
    document.body.style.backgroundImage = "url("+response.url+")";
  });
  
});

