	$(function() {

		var picOffset = 0;
		function morePics(callback) {
			
			picOffset += 10;
		
			$.getJSON("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20flickr.photos.interestingness("+(picOffset-10)+", 10)%20where%20api_key%20%3D%20%22a8e4d12443378a1e012553505e4c90b1%22&format=json&diagnostics=true&callback=?", function(data) {

				var photos = data.query.results.photo;
				for (var i=0; i < photos.length; i++) {
					$('<div><img class="no-preview" src="https://farm'+photos[i].farm+'.static.flickr.com/'+photos[i].server+'/'+photos[i].id+'_'+photos[i].secret+'.jpg"></div>')
						.appendTo('#coverflow');
				};

				callback && callback(data.query.results.photo);

			});
			
		}
		
		function moreCheck(val) {
			
			var items = $('#coverflow > div').length;
			var nearEnd = items - (val+1) < 5;
			
			if(nearEnd) morePics(function() {
				$("#slider").slider('option', 'max', items).slider('option', 'value', $("#slider").slider('option', 'value')); //update slider, setting its own value is needed
				$('#coverflow').coverflow('refresh'); //refresh the coverflow to include the new pics
			});
			
		}
		
		// Request the first batch of pics, and then initialize the coverflow and slider components
		morePics(function() {
			
			$("#coverflow").coverflow({
				opacity: false,
				transformation: function(mod, side) {
					return window.alternate ? 'rotate('+(mod*(side == 'right' ? -1 : 1)*30)+'deg) scale('+(1+((1-mod)*0.5))+')' : 'matrix(1,'+(mod * (side == 'right' ? -0.5 : 0.5))+',0,1,0,0) scale('+(1+((1-mod)*0.5))+')';
				},
				select: function(event, ui) {
					
					// move the slider handle to the new value
					$('#slider').slider('value', ui.value+1);
					
					// check if we'd want more pictures when coming to the end
					moreCheck(ui.value);
					
					// refocus the slider to allow continous keyboard navigation
					$('#slider a')[0].focus();
					
				}
			});

			$("#slider").slider({
				min: 1,
				max: $('#coverflow > div').length,
				slide: function(event, ui) {
					
					// Call the select method in the coverflow, since it's zero-based we need to substract 1
					// Note: Third argument is set to true because we don't want to fire the callback (no race cond.)
					$('#coverflow').coverflow('select', ui.value-1, true);
					
					// check if we'd want more pictures when coming to the end
					moreCheck(ui.value-1);
					
					// unset a previous preview state if needed
					if($('div.fade').is(':visible')) {
						$('#coverflow > div').removeClass('preview');
						$('#coverflow > div img').removeClass('preview').addClass('no-preview');
						$('div.fade').hide();
					}
					
				},
				stop: function() {
					$("#slider").slider('option', 'max', $('#coverflow > div').length).slider('option', 'value', $("#slider").slider('option', 'value')); //update slider, setting its own value is needed
				}
			});
			
			// set the focus to the newly initialized slider
			$('#slider a')[0].focus();
			
		});

		// those are events to toggle the preview mode of images
		$('#coverflow > div').live('dblclick', function() {
			$(this).toggleClass('preview');
			$('img', this).toggleClass('preview no-preview');
			$('div.fade').toggle();
		});
		
		$(document).bind('keydown', function(e) {
			if(e.keyCode == 32) {
				$('#coverflow > div.current').trigger('dblclick');
			}
		});
		
		//Alternate version
		window.alternate = false;
		$('#alternate').click(function() {
			
			window.alternate = !window.alternate;
			
			// make transitionable temporarily
			$('#coverflow > div').css('webkitTransition', '-webkit-transform 0.3s'); 
			
			//refresh the coverflow
			$('#coverflow').coverflow('refresh');
			
			// remove transitions
			window.setTimeout(function() { $('#coverflow > div').css('webkitTransition', ''); }, 300); 
			
			// refocus slider
			$('#slider a')[0].focus();
			
			return false;
			
		});
		
	});