$(document).ready(function (){
	$('#button a').click(function(){
		var integer = $(this).attr('rel');
		$('#myslide .cover').css({left:-160*(parseInt(integer)-1)}).hide().fadeIn(); /*----- Width of div mystuff (here 160) ------ */
		$('#button a').each(function(){
		$(this).removeClass('active');
			if($(this).hasClass('button'+integer)){
				$(this).addClass('active')}
		});
	});	
});