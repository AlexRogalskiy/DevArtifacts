// messy, messy code! ye have been warned! just experimenting here

// click anywhere to regenerate

var c = document.querySelector( 'canvas' ),
	ctx = c.getContext( '2d' ),
	w = 800,
	h = 600,
	standers = [],
	walkers = [],
	PI = Math.PI,
	TAU = PI * 2,
	count = 0,
	countMax = 800,
	iterations = 50,
	radius = 12,
	angleType = true,
	startHue,
	rangeHue,
	stop,
	raf,
	dpr;

function rand( min, max ) {
	return Math.random() * ( max - min ) + min;
}

function dist( p1, p2 ) {
	var dx = p2.x - p1.x,
		dy = p2.y - p1.y;
	return Math.sqrt( dx * dx + dy * dy );
}

function Walker( x, y, r, color, standing ) {
	count++;
	this.x = x;
	this.y = y;
	this.r = r;
	this.color = color || '#fff';
	this.standing = standing || false;
}

Walker.prototype.step = function( i ) {
	if( this.standing ) {
		return;	
	}
	this.x += rand( -this.r * 2, this.r * 2 );
	this.y += rand( -this.r * 2, this.r * 2 );
	
	this.x = Math.min( w, Math.max( 0, this.x ) );
	this.y = Math.min( h, Math.max( 0, this.y ) );
	
	var j = standers.length;
	while( j-- ) {
		var other = standers[ j ],
			compDist = this.r + other.r;
			
		if( dist( this, other ) <= compDist && !this.standing ) {
			var distOrigin = dist( this, standers[ 0 ] );
			this.standing = true;
			this.r = Math.max( 1, radius - ( distOrigin / ( w / 2 ) ) * radius * 1.1 );
			var hue = startHue + ( distOrigin / w ) * rangeHue;
			this.color = 'hsla(' + hue + ', 100%, 60%, 1)';
			var dx = other.x - this.x
			var dy = other.y - this.y;
			var angle = Math.atan2( dy, dx );
			this.hitAngle = angle;
			standers.push( this );
			walkers.splice( i, 1 );
		}
	}
};

Walker.prototype.draw = function( final ) {
	if( final ) {
		ctx.fillStyle = this.color;
		ctx.save();
		var size = this.r * 2;
		ctx.translate( this.x, this.y );
		ctx.rotate( rand( 0, TAU ) );
		ctx.shadowBlur = this.r * 10;
		ctx.shadowColor = this.color;
		ctx.globalAlpha = 0.2;
		ctx.fillRect( -size / 2, -size / 2, size, size );
		ctx.restore();
		
		ctx.strokeStyle = this.color;
		ctx.lineWidth = this.r * 1;
		ctx.beginPath();
		ctx.moveTo( this.x, this.y );
		var dx = this.x - w / 2;
		var dy = this.y - h / 2;
		var angle = Math.atan2( dy, dx );
		if( angleType ) {
			angle = this.hitAngle;	
		}
		var x = this.x + Math.cos( angle ) * this.r * 3;
		var y = this.y + Math.sin( angle ) * this.r * 3;
		ctx.lineTo( x, y );
		ctx.shadowBlur = this.r * 10;
		ctx.shadowColor = this.color;
		ctx.globalAlpha = 0.75;
		ctx.stroke();
	} else {
		ctx.rect( this.x, this.y, 2, 2 );
	}
};

function init() {
	cancelAnimationFrame( raf );
	angleType = !angleType;
	startHue = rand( 0, 360 );
	rangeHue = rand( 90, 360 );
	stop = false;
	count = 0;
	dpr = window.devicePixelRatio;
	c.width = w * dpr;
	c.height = h * dpr;
	c.style.width = w + 'px';
	c.style.height = h + 'px';
	ctx.scale(dpr, dpr);
	walkers.length = 0;
	standers.length = 0;
	standers.push( new Walker(
		w / 2,
		h / 2,
		radius,
		'hsl(' + startHue + ', 100%, 50%)',
		true
	));
	loop();
}

function step() {
	if( !stop && count < countMax - 1 ) {
		walkers.push( new Walker(
			rand( 0, 1 ) < 0.5 ? 0 : w,
			rand( 0, 1 ) < 0.5 ? 0 : h,
			radius
		));
	}
	
	var i = standers.length;
	while( i-- ) {
		standers[ i ].step( i );
	}
	
	var j = walkers.length;
	while( j-- ) {
		walkers[ j ].step( j );
	}
}

function draw( final ) {
	ctx.clearRect( 0, 0, w, h );
	
	if( final ) {
		ctx.globalCompositeOperation = 'lighter';
	}
	
	var i = standers.length;
	while( i-- ) {
		if( final ) {
			standers[ i ].draw( final );
		} else {
			ctx.beginPath();
			standers[ i ].draw();
			ctx.fillStyle = '#fff';
			ctx.fill();
		}
	}
	
	var j = walkers.length;
	while( j-- ) {
		if( final ) {
			walkers[ j ].draw();
		} else {
			ctx.beginPath();
			walkers[ j ].draw();
			ctx.fillStyle = '#fff';
			ctx.fill();
		}
	}
}

function loop() {
	if( !stop ) {
		raf = requestAnimationFrame( loop );
	}
	draw()
	for( var i = 0; i < iterations; i++ ) {
		step();
		if( standers.length > countMax - 2 ) {
			stop = true;
			cancelAnimationFrame( raf );
			draw( true );
			break;
		}
	}
}

init();

addEventListener( 'click', init );