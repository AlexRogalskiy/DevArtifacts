$(document).ready(function (){
	$('#button a').click(function(){
		var integer = $(this).attr('rel');
		$('#myslide .cover').animate({left:-160*(parseInt(integer)-1)})  /*----- Width of div mystuff (here 160) ------ */
		$('#button a').each(function(){
		$(this).removeClass('active');
			if($(this).hasClass('button'+integer)){
				$(this).addClass('active')}
		});
	});	
});