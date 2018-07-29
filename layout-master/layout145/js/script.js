//==========================================//
//											//
//		The Movie List Jquery plugin		//
//		Created by Nicolas Slatiner			//
//		Uses jQuery Library					//
//											//
//==========================================//


(function($){
	
	$.fn.imdb=function(options) {
	
		// Default options for the plugin:
		var settings=$.extend({ 
				term		:'beauty',	// default term to search is Beauty	
				limit		:5, //default search result is 5
				clearOld 	:true, //default will clear the old list before fetching new values
				onComplete  : null
			},options),
			movies=[], //will arrange all results nice and tidy in this array
			moviesFound=0, // will store the amount of movies found
			list=this; // the list object
		
		//initializes the search. will clear old list if needed, and will re-check the validity of the search term
		function init(){
			if (settings.term==="") {
				settings.term='beauty';
			}
			$(list).addClass('imdb-list');
			 clearList(function(){
			 	getMovieData();
			 });		 
		}
		
		
		//clear current list. default value is YES.
		function clearList(callback) {
			if (settings.clearOld) {
				$(list).empty();
			}
			callback();
		}
		
		//creates and appends to the body a blank screen to indicate that the query is loading
		function buildLoadingScreen() {
			$('body').append('<div class="imdbLoading"></div>');
		}
		
		//destroys loading screen. will be invoked on sucess of the ajax request
		function destroyLoadingScreen() {
			$('.imdbLoading').fadeOut('slow',function(){
				$('.imdbLoading').remove();
			});
		}
		
		//gets the requiered data using ajax passes the data as a JS object
		function getMovieData() {
			buildLoadingScreen();
		    $.ajax({
		      url: "https://mymovieapi.com/?title=" + settings.term +"&limit="+settings.limit,
		      datatype: "jsonp",
		        success: function(data){
		        	ProcessData($.parseJSON(data));
		        },
		        error: function (response) {
				      var r = jQuery.parseJSON(response.responseText);
				      alert('Something went wrong: '+r.Message);
				}
		    });
		}
		
		//function arranges the JS object of movies in an array. 
		function ProcessData(data) {
			destroyLoadingScreen();
			// Will only process if movie exists and no code 404 is returned 
			if(data.code===404) {
				$(list).append("<li class='empty'>Sorry, no films found</li>");
			}
			else {
				moviesFound=data.length;
				for (i=0; i<moviesFound; i++) {
					var movie={
						title:data[i].title,
						url:data[i].imdb_url,
						posterURL:data[i].poster,
						year:data[i].year
					}
					//check to see if there is a poster img, otherwise will replace it with a 'no-img' message
					if (movie.posterURL===undefined) {
						movie.posterImg="<div class='img-container'>Sorry, no Image available</div>";
					}
					else {
						movie.posterImg="<div class='img-container' style='background-image:url("+movie.posterURL+")'></div>";
					}
					movies.push(movie);
				}
				returnData();
			}
		}
		
		//is emitted after items are inserted into DOM
		function loaded() {
			console.log('data loaded');
		}
		
		//function returns processed data into the DOM with a callback to loaded()
		function returnData() {
			return list.each(function(){
				$(this).addClass('imdb-list');
				for (i=0; i<moviesFound; i++) {
					$(this).append("<li>"+movies[i].posterImg+"<a href='"+movies[i].url+"'>"+movies[i].title+" ,("+movies[i].year+")"+"</a></li>");
				}
				loaded();
			});
		}
		
		
		init();
	};
	
})(jQuery);

//==========================================//
//											//
//		Select/Sort Jquery plugin			//
//		Created by Nicolas Slatiner			//
//		Uses jQuery Library	and Jquery UI	//
//											//
//==========================================//


(function($){
	
	$.fn.selectsort=function() {
		var list=this;
		
		//function recieves the list element and breaks it down to a string. the selected list item recieves an "*" before it's name
		function myEvent(list){
			var message="",
				elements=$(list).find('li');
				
			for (i=0;i<elements.length;i++) {
				
				if ($($(elements)[i]).hasClass('ui-sortable-helper')) {
					message+="* "+$($(elements)[i]).text()+" / ";
				}
				else {
					message+=$($(elements)[i]).text()+" / ";
				}
			}
			
			console.log(message);
		}
		
		//adds funcionality for selecting individual items.
		function selectItem(item){
			$(item).toggleClass('ui-sortable-helper');
			$(item).siblings('li').removeClass('ui-sortable-helper');
			myEvent($(event.target).parent('ul')[0]);
		}
		
		//plugin uses jquery UI sortable interaction for manually sorting the list items, and adds an on click event to each list item to add the selectable funcionality
		return list.each(function(){
			var currentUl=$(this);			
			$(this).sortable({ 
						placeholder: "sortable-placeholder", //reveals the placeholder dropdown area
						start: function (event,ui){ //at the begining of the drag event, will remove all selected classes of list items
							$(event.target).find('li').removeClass('ui-sortable-helper');
						},
						stop: function( event, ui ) {//at the end of the drag event, will add the helper class to the drag item and will fire the "myEvent" function
							$(ui.item).addClass('ui-sortable-helper');
							myEvent(event.target);
						},
					})
				   .off("click").on('click','li',function(){ //adds the select item funcionality after unbinding previous click events
				   		selectItem(this);
				   });
		});
	}

})(jQuery);

$(document).ready(function(){
  $('form').on('submit',function(e){
    e.preventDefault();
    $('ul#theList').imdb({
      term:$('#input-term').val(),
      clearOld:false,
      onComplete: $('ul#theList').selectsort()
    });
  });
});
