/*
	by Troshkin Pavel, 2015,
  troshkin.pavel@yandex.ru
*/

var cyrillic = {'а':'._', 'б':'_...', 'в':'.__', 'г':'__.', 'д':'_..','е':'.','ж':'..._','з':'__..','и':'..','й':'.___','к':'_._','л':'._..','м':'__','н':'_.','о':'___','п':'.__.','р':'._.', 'с':'...', 'т':'_','у':'.._','ф':'.._.','х':'....','ц':'_._.','ч':'___.','ш':'____','щ':'__._','ь':'_.._','ы':'_.__','э':'.._..','ю':'..__', 'я':'._._'};
	var latin = {'a':'._', 'b':'_...', 'c':'_._.', 'd':'_..', 'e':'.','f':'.._.','g':'__.','h':'....','i':'..','j':'.___','k':'_._','l':'._..','m':'__','n':'_.','o':'___','p':'.__.','q':'__._','r':'._.', 's':'...', 't':'_','u':'.._','v':'..._','w':'.__','x':'_.._','y':'_.__','z':'__..'};
	var symbol = {'1':'.____', '2':'..___', '3':'...__', '4':'...._', '5':'.....','6':'_....','7':'__...','8':'___..','9':'____.','0':'_____'};

	$(document).ready(function(){
		var language = extendedLanguage();

		$('.button').click(function(e){
			var s = convert($('#user_text').val(), language);
			if(s){
				animation(s, 0);	
			}else{
				$('#user_text').val('').attr('placeholder', 'please enter a valid text!');

			}
		})
	});

	function extendedLanguage(){
		var language = $.extend(latin, cyrillic);
		$.extend(language, symbol);
		return language;
	}
	function animation(el, index){
		var duration = 0;
		$('.morze').html('');
		for(var i = 0; i < el[index].arr.length; i++){

			if(el[index].arr[i] == '_'){
				duration = 900;
			}else if(el[index].arr[i] == '.'){
				duration = 300;
			}

			sr(i, duration, el, index);
		}
	}
	var sl = 0;
	function sr(i, duration, el, index){
		$('.footer-center').children('p').remove();
		$('.footer-center').prepend('<p class="text">'+el[index].el+'</p>');
		$('.morze').append('<li>'+el[index].arr[i]+'</li>');

		var time = (duration*2);
		sl += time;

		var razn = 0;
		if(el[index].arr[i-1]){
			if(el[index].arr[i-1] == '.' && el[index].arr[i] == '_'){
				razn = 300;
				sl = (sl + razn*2)-(duration*2);
			}else if(el[index].arr[i-1] == '_' && el[index].arr[i] == '.'){
				razn = 900;
				sl = (sl + razn*2)-(duration*2);
			}
		}else{
			if(index){
				sl = 900;
			}else{
				sl = 0;
			}
		}
		setTimeout(function(){
			$('.morze').children('li').css('background-color', 'rgba(255,255,255,.2)');
			$('.morze').children('li').eq(i).css('background-color', 'rgba(255,255,255,.4)');

			$({brightness:1}).animate({
				brightness: 2
			}, {
			    duration: duration,
			    step: function() {
			    	$('.bg').css('-webkit-filter', 'brightness('+this.brightness+')');
            			    	$('.bg').css('filter', 'brightness('+this.brightness+')');
			    },
			    complete: function() {
			        $({brightness:this.brightness}).animate({
			        	brightness: 1
			        },{
			        	duration: duration,
			        	step: function(){
                  $('.bg').css('-webkit-filter', 'brightness('+this.brightness+')');
			        		$('.bg').css('filter', 'brightness('+this.brightness+')');
			        	},
			        	complete: function(){
			        		if(i == el[index].arr.length-1 && index < el.length-1){
			        			sl = 0;
			        			animation(el, index+1);
			        		}
			        	}
			        });
			    }
			});
		}, sl);
	}
	function convert(str, language){
		str = str.toLowerCase();
		var str = str.replace(/[^а-яА-Яa-zA-Z0-9]/g, '');
		if(str == '' || !str) return false;
		var arr = str.split('');
		var result = [];
		for(var j = 0; j < arr.length; j++){
			var obj = {
				el: arr[j],
				arr: language[arr[j]]
			}
			result.push(obj);
		}
		return result;
	}