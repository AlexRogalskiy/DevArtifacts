$(function(){
	// Populate the world info, if available
	$('li').each(function(){
		let id = $(this).attr('id');
		let search = sector.find(o=>o.id === id);
		if (search) {
			let infostring = '<p class="info">'+search.name+'<br>'+search.upp+'</p>';
			$(this).addClass('occupied');
			$(this).find('p').after(infostring);
		}
	});
});

const sector = [
	{ id: '0101', name: 'Adulbel', upp: 'B100699-14' },
	{ id: '0104', name: 'Aludam', upp: 'D352546-4' },
	{ id: '0105', name: 'Petelea', upp: 'C877544-4' },
	{ id: '0108', name: 'Jelenuria', upp: 'BAC39C9-10' },
	{ id: '0109', name: 'Foxjor', upp: 'A581520-8' },
	{ id: '0201', name: 'Blokaium', upp: 'C7B0645-9' },
	{ id: '0203', name: 'Zinlax', upp: 'B332986-10' },
	{ id: '0204', name: 'Nudusvania', upp: 'B655999-10' },
	{ id: '0205', name: 'Trumenliv', upp: 'D57AA63-7' },
	{ id: '0206', name: 'Jelliv', upp: 'D972110-5' },
	{ id: '0302', name: 'Sizej', upp: 'C38A655-11' },
	{ id: '0303', name: 'Foiran', upp: 'C446565-6' },
	{ id: '0304', name: 'Rutenbel', upp: 'C459552-7' },
	{ id: '0306', name: 'Cattica', upp: 'C120400-11' },
	{ id: '0307', name: 'Aco', upp: 'E646755-3' },
	{ id: '0310', name: 'Laklin', upp: 'E562323-5' },
	{ id: '0401', name: 'Zinlis', upp: 'B535000-9' },
	{ id: '0402', name: 'Xantos', upp: 'D49A546-6' },
	{ id: '0403', name: 'Parodia', upp: 'E3647C9-4' },
	{ id: '0404', name: 'Cinlia', upp: 'C410233-11' },
	{ id: '0406', name: 'Resulore', upp: 'A3009A9-16' },
	{ id: '0407', name: 'Pentium', upp: 'C642221-6' },
	{ id: '0501', name: 'Pordreus', upp: 'C575557-6' },
	{ id: '0502', name: 'Freelerty', upp: 'C8C9877-11' },
	{ id: '0503', name: 'Alven', upp: 'C465304-8' },
	{ id: '0506', name: 'Nimbus', upp: 'D534789-5' },
	{ id: '0507', name: 'Aludam', upp: 'C779664-8' },
	{ id: '0508', name: 'Prism', upp: 'E691378-8' },
	{ id: '0510', name: 'Sion', upp: 'D779200-9' },
	{ id: '0601', name: 'Mulroid', upp: 'E000544-9' },
	{ id: '0602', name: 'Sizru', upp: 'C963677-6' },
	{ id: '0603', name: 'Biliv', upp: 'X885273-3' },
	{ id: '0607', name: 'Dolzar', upp: 'B343889-10' },
	{ id: '0608', name: 'Zyne', upp: 'X7B3224-9' },
	{ id: '0610', name: 'Triss', upp: 'E649746-6' },
	{ id: '0701', name: 'Elozar', upp: 'D442220-4' },
	{ id: '0704', name: 'Z\'Rutl', upp: 'D57A355-9' },
	{ id: '0707', name: 'Pelgua', upp: 'E261320-4' },
	{ id: '0709', name: 'Helix', upp: 'A2317C9-13' },
	{ id: '0710', name: 'Rizeldan', upp: 'BA767A6-9' },
	{ id: '0801', name: 'Rivtos', upp: 'E7B4123-9' },
	{ id: '0803', name: 'Petoid', upp: 'C697201-9' },
	{ id: '0805', name: 'Jasulis', upp: 'C994354-5' },
	{ id: '0810', name: 'Xamea', upp: 'C655212-5' }
]