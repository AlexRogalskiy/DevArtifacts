$('#3-5, #4-3, #4-6, #5-3, #5-6, #6-4').addClass('alive');
$(function(){ play(); });
$('div').on('click', function(){
	if ($(this).hasClass('alive')) {
		$(this).removeClass('alive');
	} else {
		$(this).addClass('alive');
	}
});
var on;
var playing = false;
function play(){
	if (!playing) {
		playing = true;
		$('button').html('Stop');
		on = window.setInterval(function(){
			$('div').each(function(){
				if ($(this).hasClass('willLive')) {
					$(this).removeClass('willLive').addClass('alive');
				}
				if ($(this).hasClass('willDie')) {
					$(this).removeClass('willDie alive');
				}
				
				var score = 0,
						coords = $(this).attr('id').split('-'),
						alive = $(this).hasClass('alive') ? true : false,

						topleft = '#'+(Number(coords[0])-1)+'-'+(Number(coords[1])-1),
						top = '#'+(Number(coords[0])-1)+'-'+(Number(coords[1])),
						topright = '#'+(Number(coords[0])-1)+'-'+(Number(coords[1])+1),
						left = '#'+(Number(coords[0]))+'-'+(Number(coords[1])-1),
						right = '#'+(Number(coords[0]))+'-'+(Number(coords[1])+1),
						bottomleft = '#'+(Number(coords[0])+1)+'-'+(Number(coords[1])-1),
						bottom = '#'+(Number(coords[0])+1)+'-'+(Number(coords[1])),
						bottomright = '#'+(Number(coords[0])+1)+'-'+(Number(coords[1])+1);

				if ($(topleft) && $(topleft).hasClass('alive')) { score++; }
				if ($(top) && $(top).hasClass('alive')) { score++; }
				if ($(topright) && $(topright).hasClass('alive')) { score++; }
				if ($(left) && $(left).hasClass('alive')) { score++; }
				if ($(right) && $(right).hasClass('alive')) { score++; }
				if ($(bottomleft) && $(bottomleft).hasClass('alive')) { score++; }
				if ($(bottom) && $(bottom).hasClass('alive')) { score++; }
				if ($(bottomright) && $(bottomright).hasClass('alive')) { score++; }
				
				if (alive && (score == 2 || score == 3)) { $(this).addClass('willLive') }
				else { $(this).addClass('willDie'); }
				if (!alive && score == 3) { $(this).removeClass('willDie').addClass('willLive'); }
			});
		}, 100);
	} else {
		$('button').html('Start');
		$('div').removeAttr('class');
		clearInterval(on);
		playing = false;
	}
}