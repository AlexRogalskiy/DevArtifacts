$(function(){
	
	var result = $('#result'),
		html = '', code = '';
	
	// Prepare the code editor
	code = ace.edit("code");
	code.setTheme("ace/theme/tomorrow_night");
	code.getSession().setMode("ace/mode/javascript");
	
	
	// Prepare the HTML Editor
	if($('#html').length){
		html = ace.edit("html")
		html.setTheme("ace/theme/tomorrow_night");
		html.getSession().setMode("ace/mode/html");
	}
	
	$('#run').click(function(){
		
		if(result.length){
			result.empty();
			
			var div = $('<div>').html(getEditorVal(html));
			
			if(!$('#html').hasClass('visible')){
				div.hide();
			}
			
			result.append(div);
		}
		
		var script = document.createElement('script');
		script.textContent = getEditorVal(code);
		
		$('body').append(script);
		
	});
	
	
	function getEditorVal(x){
		return x.getValue ? x.getValue() : x.toString();
	}
	
	// Globals
	
	window.log = function(){
		var arr = Array.prototype.slice.call(arguments);
		
		try{
			
			$.each(arr, function(k){
				if($.isPlainObject(this) || $.isArray(this)){
					arr[k] = JSON.stringify(this);
				}
			});
			
		} catch (e){}
		

		result.append('<p class="log">'+arr.join(' ').replace('<','&lt;').replace('>','&gt;')+'</p>');
	}
	
	window.log.clear = function(){
		$('.log').remove();
	};
	
	var times = {};
	
	window.timer = function(name){
		times[name] = new Date();
	};
	
	window.timer_result = function(name){
		
		if(!times[name]){
			log(name + ' timer is not defined!');
			return false;
		}
		
		log(name+': ' + (new Date() - times[name]) + 'ms');
		delete times[name];
	};
	
});

