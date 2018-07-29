//=====================================//
//======== Font license info  =========//
//=====================================//
/*    
## Entypo
   Copyright (C) 2012 by Daniel Bruce
   Author:    Daniel Buce
   License:   SIL (http://scripts.sil.org/OFL)
   Homepage:  http://www.entypo.com

## Font Awesome
   Copyright (C) 2012 by Dave Gandy
   Author:    Dave Gandy
   License:   CC BY 3.0 (http://creativecommons.org/licenses/by/3.0/)
   Homepage:  https://fortawesome.github.com/Font-Awesome/

## Web Symbols
   Copyright (c) 2011 by Just Be Nice studio. All rights reserved.
   Author:    Just Be Nice studio
   License:   SIL (http://scripts.sil.org/OFL)
   Homepage:  http://www.justbenicestudio.com/studio/websymbols/
*/
//=====================================//


$('nav ul#main_nav').on('click','li',function(){
	var $type=$(this).attr('data-title');
	$('nav ul#main_nav li').removeClass('active')
	if ($type=='all') {
		$('nav ul#main_nav li').addClass('active');
		$('div#timeline_container >ul> li').removeClass('hidden');
		$('div#timeline_container >ul> li').removeClass('active');
		$($('div#timeline_container >ul> li')[0]).addClass('active');
	} else {
		$(this).addClass('active');
		$('div#timeline_container >ul> li').addClass('hidden');	
		$('div#timeline_container >ul> li.'+$type+'_event').removeClass('hidden');
		$('div#timeline_container >ul> li').removeClass('active');
		$($('div#timeline_container >ul> li.'+$type+'_event')[0]).addClass('active');
	}
			
});

$(document).on('scroll',function(){
	$('div#instructions_container').fadeOut('fast');
	$('div#info_container').fadeIn('fast');
});
$(document).on('click','div#info_container',function(){
	$('div#instructions_container').fadeIn('fast');
	$('div#info_container').fadeOut('fast');
});

$(document).on('click','li.icon-down-open',function(){
	scrollToNext();
});

$(document).on('click','li.icon-up-open',function(){
	scrollToPrev();
});

$(document).on('keypress',function(e){
	if(e.which==106) {
		scrollToNext();
	} else if(e.which==107) {
		scrollToPrev();
	}
});

$('div#timeline_container').on('click','li', function(){
	showNext($(this));
});

function showNext(li){
	var $itms=$('div#timeline_container li');
	$itms.removeClass('active');
	$(li).addClass('active');
	$('html,body').stop().animate({ scrollTop: $(li).offset().top-$(li).height()}, 500,function(){
		$('html,body').stop();
	});
}

function scrollToNext() {
	var $itms=$('div#timeline_container > ul > li');
	var $current=$itms.index($('div#timeline_container li.active'));
	
	if ($($itms[$current+1]).length>0 && !$($itms[$current+1]).hasClass('hidden')) {
		$itms.removeClass('active');
		$($itms[$current+1]).addClass('active');
		$('html,body').stop().animate({ scrollTop: $($itms[$current+1]).offset().top-$($itms[$current+1]).height()}, 500);
	} else {
		$('html,body').stop().animate({ scrollTop: $(document).height()}, 500);
	}
}
function scrollToPrev() {
	var $itms=$('div#timeline_container > ul > li');
	var $current=$itms.index($('div#timeline_container li.active'));
	
	if ($($itms[$current-1]).length>0 && !$($itms[$current-1]).hasClass('hidden')) {
		$itms.removeClass('active');
		$($itms[$current-1]).addClass('active');
		$('html,body').stop().animate({ scrollTop: $($itms[$current-1]).offset().top-$($itms[$current-1]).height()}, 500);
	} else {
		$('html,body').stop().animate({ scrollTop: 0}, 500);
	}
}
