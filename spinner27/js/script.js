$(document).ready(Bricks);

function Bricks(){
	var settings = {
		container : $('.container').children('ul'),
		height : $(document).height()/2-45, //35 = 1/2 heigh li
		width : $(document).width()/2-240, //200 = count li * li.width
	}
	settings.elWidth = settings.width;

	settings.container.find('li').each(function(i,el){
		settings.elWidth += 60;
		$(el).css('top',settings.height);
		if(i != 0){
			$(el).css('left',settings.elWidth);
		}
	});

	addSettings(settings);


	function addSettings(settings){
		settings.elements = settings.container.find('li');
		settings.first = settings.elements.first();
		settings.last = settings.elements.last();

		bricksAnimate(settings);
	}

	function bricksAnimate(settings){
		settings.first.stop().animate({
			left: settings.width+60
		},150, function() {
			/* stuff to do after animation is complete */
			settings.last.prevAll().andSelf().each(function(i, el){
				var elPositionLeft = parseInt($(el).css('left'));
				$(el).stop().animate({
					left: elPositionLeft + 60
				},200, function() {});
			})
			/* stuff to do after animation is complete */
			settings.last.stop().animate({
				left: settings.width+330
			},150, function() {
				/* stuff to do after animation is complete */
				settings.last.delay(30).stop().animate({
					top: settings.height*2
				},200, function() {
					/* stuff to do after animation is complete */
					$(settings.last).prependTo(settings.container);
					settings.last.css({'top': settings.height, 'left':'-74px'});
					addSettings(settings);
				});
			});
		});
	}
}

$(window).resize(Bricks);