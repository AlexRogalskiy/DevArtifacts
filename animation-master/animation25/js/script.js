const DIM = 1600, 
			N_TYPES = 2, 
			T_PAUSE = 100;

var k, r = .5*1600, p, data, auto = $$('#auto').checked, 
		dk = .01, rID = null, pause = false, t0, 
		prog = $$('#prog'), out = $$('#out'), 
		style = $.body._add('', null, 'style');

var Polygon = function(f = 0, n = 3) {
	var vertices, sym, poly_s, poly_c, f = f;
	
	this.draw = function(k) {
		var plist = [], j;
		
		if(k > .5) k = 1 - k;
		k *= pow(-1, f);
		
		if(f) {
			plist = vertices.map(c => c.map(c => round(c*k)));
		}
		else {
			for(var i = 0; i < n; i++) {
				j = (i + 1)%n;
				
				plist.push(pmix(vertices[i], vertices[j], k));
				plist.push(pmix(vertices[j], vertices[i], k));
			}
		}
		
		poly_c._attr({
			'points': plist.join(' ')
		});
		poly_s._attr({
			'points': plist.join(' ')
		});
	};
	
	this.switch = function() {
		f = 1 - f;
	};
	
	this.init = (function() {
		var ba = 2*PI/n, ca;
		
		vertices = [];
		poly_s = $$('#ps-' + f);
		poly_c = $$('#pc-' + f);
		sym = $$('#s-' + f);
		sym._attr({'viewBox': [-r, -r, DIM, DIM].join(' ')});
		
		for(var i = 0; i < n; i++) {
			ca = i*ba -.5*PI;
			vertices.push([r*cos(ca), r*sin(ca)]);
		}
	})();
};

var mix = function(a, b, k) {
	return round((1 - k)*a + k*b);
};

var pmix = function(a, b, k) {	
	return [mix(a[0], b[0], k), mix(a[1], b[1], k)];
}

var update = function(fa) {
	var newK = prog.value*.01, 
			f, j, tz, oc = '', err = .005;
	
	if(newK !== k) {
		for(var i = 0; i < N_TYPES; i++) {
			if((newK > .5 && k <= .5) || 
				 (newK <= .5 && k > .5))
				p[i].switch();
			p[i].draw(newK);
		}
		
		if(fa !== 1) pause = false;
		
		k = newK;
		f = (k > .5)*1;
		j = (f ? (1 - k) : k);
		tz = (1 - 2*j)*data.dr4hedron;
		style.textContent = 
			'.type-' + (1 - f) + 
			'{transform: translateZ(' + tz + 'px)}';
		
		switch(true) {
			case j < err:
				oc = 'tetrahedron';
				pause = true;
				break;
			case abs(j - .333) < err:
				oc = 'truncated tetrahedron';
				pause = true;
				break;
			case abs(j - .5) < err:
				oc = 'octahedron';
				pause = true;
		}
		
		out.textContent = oc;
	}
};

var ani = function(t) {
	if(pause) {
		if(!t0) t0 = t;
		else if(t - t0 > T_PAUSE) {
			pause = false;
			t0 = null;
		}
	}
	else {
		if(!(k*(1 - k))) dk *= -1;
		prog.value = round(((k || 0) + dk)*100);
		update(1);
	}
	
	rID = requestAnimationFrame(ani.bind(this, ++t));
};

(function init() {
	var _el = $$('.s2d')[0], 
			_s = getComputedStyle(_el), 
			_dim = _s.width.split('px')[0], _a;
	
	p = [];
	data = {
		'n3gon': 3, 
		'rc3gon': .5*_dim
	};
	data.ca3gon = 2*PI/data.n3gon;
	data.a3gon = (data.n3gon - 2)*PI/data.n3gon;
	_a = .5*data.ca3gon;
	data.ri3gon = data.rc3gon*cos(_a);	
	data.l3gon = 2*data.rc3gon*sin(_a);
	data.h3gon = data.l3gon*sin(data.a3gon);
	data.da4hedron = acos(data.ri3gon/data.h3gon);
	data.ri4hedron = data.rc3gon/tan(data.da4hedron);
	data.rc4hedron = data.rc3gon/sin(data.da4hedron);
	data.dr4hedron = data.rc4hedron - data.ri4hedron;
		
	for(var i = 0; i < N_TYPES; i++)
		p.push(new Polygon(i));
	
	update();
	
	if(auto) ani(0);
})();

prog.addEventListener('input', update, false);
prog.addEventListener('update', update, false);

addEventListener('click', function(e) {
	var tg = e.target;
	
	if(tg.tagName.toLowerCase() === 'label') {
		auto = !auto;
		
		if(auto) ani(0);
		else {
			cancelAnimationFrame(rID);
			rID = null;
		}
	}
}, false);