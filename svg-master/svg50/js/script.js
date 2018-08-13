var perfis = ['very-low', 'low', 'moderate', 'high', 'very-high'],
    el = $('div[class^=thermometer]'),
    random = '';

setInterval(function() {
  random = perfis[Math.floor(Math.random() * perfis.length)];
	el.removeClass().addClass('thermometer--'+random);
}, 3500);