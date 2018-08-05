const _SVG = document.querySelector('svg'), 
			_SHAPE = document.getElementById('shape'), 
			D = 1000 /* viewBox size */,
			O = {} /* data object */,
			/* number of cubic curves/ polygon vertices */
			P = 5, 
			NF = 50 /* total number of frames for transition */, 
      TFN = { /* timing functions */
        'ease-out': function(k) {
          return 1 - Math.pow(1 - k, 1.675)
        }, 
        'ease-in-out': function(k) {
          return .5*(Math.sin((k - .5)*Math.PI) + 1)
        },
        'bounce-ini-fin': function(k, s = -.65*Math.PI, e = -s) {
          return (Math.sin(k*(e - s) + s) - Math.sin(s))/(Math.sin(e) - Math.sin(s))
        }
      };

let dir = -1, rID = null, cf = 0, m;

function getStarPoints(f = .5) {
	const RCO = f*D /* outer (pentagram) circumradius*/, 
				BAS = 2*(2*Math.PI/P) /* base angle for star poly */, 
				BAC = 2*Math.PI/P /* base angle for convex poly */, 
				RI = RCO*Math.cos(.5*BAS) /*pentagram/ inner pentagon inradius */, 
				RCI = RI/Math.cos(.5*BAC) /* inner pentagon circumradius */, 
				ND = 2*P /* total number of distinct points we need to get */, 
				BAD = 2*Math.PI/ND /* base angle for point distribution */, 
				PTS = [] /* array we fill with point coordinates */;

	for(let i = 0; i < ND; i++) {
		let /* radius at end point (inner)/ control point (outer) */
				cr = i%2 ? RCI : RCO, 
				/* angle of radial segment from origin to current point */
				ca = i*BAD + .5*Math.PI, 
				x = Math.round(cr*Math.cos(ca)), 
				y = Math.round(cr*Math.sin(ca));

		PTS.push([x, y]);
		/* for even indices double it, control points coincide here */
		if(!(i%2)) PTS.push([x, y]);
	}

	return PTS
};

function getHeartPoints(f = .25) {
	const R = f*D /* helper circle radius  */, 
				RC = Math.round(R/Math.SQRT2) /* circumradius of square of edge R */, 
				XT = 0, YT = -RC /* coords of point T */, 
				XA = 2*RC, YA = -RC /* coords of A points (x in abs value) */, 
				XB = 2*RC, YB = RC /* coords of B points (x in abs value) */, 
				XC = 0, YC = 3*RC /* coords of point C */, 
				XD = RC, YD = -2*RC /* coords of D points (x in abs value) */, 
				XE = 3*RC, YE = 0 /* coords of E points (x in abs value) */, 
				/* const for cubic curve approx of quarter circle */
				C = .551915, 
        CC = 1 - C, 
        /* coords of ctrl points on TD segs */
				XTD = Math.round(CC*XT + C*XD), YTD = Math.round(CC*YT + C*YD), 
        /* coords of ctrl points on AD segs */
				XAD = Math.round(CC*XA + C*XD), YAD = Math.round(CC*YA + C*YD), 
        /* coords of ctrl points on AE segs */
				XAE = Math.round(CC*XA + C*XE), YAE = Math.round(CC*YA + C*YE), 
        /* coords of ctrl points on BE segs */
				XBE = Math.round(CC*XB + C*XE), YBE = Math.round(CC*YB + C*YE);
	
	return [
		[XC, YC], [XC, YC], [-XB, YB], 
		[-XBE, YBE], [-XAE, YAE], [-XA, YA], 
		[-XAD, YAD], [-XTD, YTD], [XT, YT], 
		[XTD, YTD], [XAD, YAD], [XA, YA], 
		[XAE, YAE], [XBE, YBE], [XB, YB]
	].map(([x, y]) => [x, y - .09*R]);
};

function fnStr(fname, farg) { return `${fname}(${farg})` };

function range(ini, fin) {
	return (typeof ini == 'number') ? 
					fin - ini : 
					ini.map((c, i) => range(ini[i], fin[i]))
};

function int(ini, rng, tfn, k, cnt) {
	return (typeof ini == 'number') ? 
					Math.round(ini + cnt*(m + dir*tfn(m + dir*k))*rng) : 
					ini.map((c, i) => int(ini[i], rng[i], tfn, k, cnt))
};

function stopAni() {
  cancelAnimationFrame(rID);
  rID = null;  
};

function update() {
  cf += dir;
	
  let k = cf/NF;
	
	for(let p in O) {
		let c = O[p];
		
		_SHAPE.setAttribute(...[
			p, 
			c.afn(int(c.ini, c.rng, TFN[c.tfn], k, c.cnt ? dir : 1))
		]);
	}
  
  if(!(cf%NF)) {
    stopAni();
    return
  }
  
  rID = requestAnimationFrame(update)
};

(function init() {	
	_SVG.setAttribute('viewBox', [-.5*D, -.5*D, D, D].join(' '));
	
	O.d = {
		ini: getStarPoints(), 
		fin: getHeartPoints(), 
		afn: function(pts) {
			return pts.reduce((a, c, i) => {
				return a + (i%3 ? ' ' : 'C') + c
			}, `M${pts[pts.length - 1]}`)
		},
		tfn: 'ease-in-out'
	};
	
	O.transform = {
		ini: -180, 
		fin: 0, 
		afn: (ang) => fnStr('rotate', ang),
		tfn: 'bounce-ini-fin',
		cnt: 1
	};
	
	O.fill = {
		ini: [255, 215, 0], 
		fin: [220, 20, 60], 
		afn: (rgb) => fnStr('rgb', rgb),
		tfn: 'ease-out'
	};
	
	for(let p in O) {
		O[p].rng = range(O[p].ini, O[p].fin);
		_SHAPE.setAttribute(p, O[p].afn(O[p].ini));
	}
	
	_SHAPE.addEventListener('click', e => {
		if(rID) stopAni();
		dir *= -1;
		m = .5*(1 - dir);
		update();
	}, false);
})();