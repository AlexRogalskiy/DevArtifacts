var trajectories = document.querySelectorAll('.radial-menu-trajectory');
var area = 360;
var sector = area / trajectories.length;
var sectorMiddle = sector / 2;

var rMenu = $('.radial-menu-wrapper');

$('.menu').on('click', function() {
	
	if (rMenu.hasClass('active')) {
		rMenu.removeClass('active');
		$(this).removeClass('active');
		$(this).children('i.material-icons').html('menu');
		for (var i = 0, l = trajectories.length; i < l; i++) {
			trajectories[i].style.transition = '.4s ease-in-out';
			trajectories[i].style.transitionDelay = '(.05s * ' + i +') - 0.5s';
	trajectories[i].style.transform = 'rotate(' + ((sector) - sectorMiddle) + 'deg)';
		}
	} else {
		rMenu.addClass('active');
		$(this).addClass('active');
		$(this).children('i.material-icons').html('close');
		for (var i = 0, l = trajectories.length; i < l; i++) {
			trajectories[i].style.transform = 'rotate(' + ((sector * (i + 1)) - sectorMiddle) + 'deg)';
			var rotation = trajectories[i].style.transform;
			var deg = rotation.split('(');
			var getDeg = deg[1].split('d');
			var items = trajectories[i].children[0].firstElementChild;
			items.style.transform = 'rotate(' + (getDeg[0] * -1) + 'deg)'
		}
	}
})