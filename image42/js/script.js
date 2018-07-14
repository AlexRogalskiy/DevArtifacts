(function() {

var isDebugMode = false;
var pi = Math.PI, pi180 = Math.PI / 180, pi2 = pi + pi, pi05 = pi * 0.5, pi25 = pi * 0.25;
var ctx, canvas;
var stageW, stageH, stageW0, stageH0, screenW, stageCx, stageCy, worldW, worldX, worldH, worldY, worldWmax;
var cam, timespeed = 1, timespeedR, oldTime, totalFrame;
var mouseXw = 0, mouseYw = 0;
var deviceScale = 1, deviceScale2 = 1;
var windX, windY, windXr, windYr;
var logo, cat, tree, fish, sun, hphone, models, renderList;
var mouseX, mouseXp, mouseXo, mouseY, mouseYo, mouseX2, mouseY2, pind = 0, taptype = -1;
var modelx, modely, modelz;
var isMouseDown, isMouse, isPC, isIPAD, isSafari, isIE, isStageResize;
var bgColor = "rgb( 80%, 0%, 40% )";
var closeper, closeperR, state = 0, mouseXpsa = 0, mouseXpR = 0;
var isCanvasClear, colcc = 0, finishCC = 0;
var crect_xx = 0, crect_yy = 0, crect_w = 1, crect_xstart = 1, crect_hh = 1;
var snsbtn;

if( window.devicePixelRatio == 2 ) {
	deviceScale = 1.98;
	deviceScale2 = 1 / deviceScale;
}

document.write('<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1" />');

var addListener = function( e, str, func ) {
	if( e.addEventListener ) {
		e.addEventListener( str, func, false );
	}else if( e.attachEvent ) {
		e.attachEvent( "on" + str, func );
	}else {
		
	}
};
addListener( window, "load", init );

var arrIconL, arrIconR, isShowArrow = false, arrCC = 0;

//init
function init() {
	var style = document.body.style;
	style.fontFamily = "Verdana, Arial, Helvetica, sans-serif";
	style.margin = style.padding = 0;
	style.overflow = "hidden";
	style.backgroundColor = bgColor;
	style.width = style.height = "100%";
	
	var el;
	snsbtn = document.getElementById( "sns" );
	snsbtn.style.width = "250px";
	snsbtn.style.position = "absolute";
	snsbtn.style.zIndex = 100;
	snsbtn.style.left = "95px";
	snsbtn.style.top = "17px";
	snsbtn.style.whiteSpace = "nowrap";
	
	el = arrIconL = document.createElement("div");
	document.body.appendChild( el );
	el.innerHTML = "&gt;&gt;";
	el.style.zIndex = 101;
	var el2 = arrIconR = document.createElement("div");
	document.body.appendChild( el2 );
	el2.innerHTML = "&lt;&lt;";
	el.style.fontSize = el2.style.fontSize = "16px";
	arrIconL.style.position = arrIconR.style.position = "absolute";
	el2.style.fontSize = "right";
	el2.style.zIndex = 102;
	arrIconL.style.display = arrIconR.style.display = "none";
	arrIconL.style.cursor = arrIconR.style.cursor = "default";
	arrIconL.style.whiteSpace = arrIconR.style.whiteSpace = "nowrap";
	el.style.fontWeight = el2.style.fontWeight = "bold";
	
	var chk = true;
	var ua = navigator.userAgent.toUpperCase();
	isIE = ua.indexOf( "MSIE" ) > -1;
	isMouse = !( "ontouchstart" in window );
	
	if ( ua.indexOf( "ANDROID" )  > -1 || ua.indexOf( "IPHONE" ) > -1 || ( isIPAD = ua.indexOf( "IPAD" ) > -1 ) || ua.indexOf( "IPOD" )  > -1 ) {
		isPC = false;
		if( ua.indexOf( "ANDROID" )  == -1 ) {
			deviceScale = 1;
			deviceScale2 = 1;
		}
	}else {
		isPC = true;
	}
	
	if ( ua.indexOf( "SAFARI" ) > -1 && ua.indexOf( "CHROME" ) == -1 && ua.indexOf( "ANDROID" )  == -1 ) {
		isSafari = true;
		var idx0 = ua.indexOf( "VERSION" ) + 8;
		var idx1 = ua.indexOf( " ", idx0 );
		var versions = (ua.substring( idx0, idx1)).split(".");
		var version = versions[0];
		if ( versions.length > 1 ) version += "." + versions[1] + ( versions.length > 2 ? versions[2] : "" );
		version = Number( version );
	}else {
		isSafari = false;
	}
	
	canvas = document.createElement("canvas");
	if ( !canvas || !canvas.getContext ) {
		chk = false;
	}
	
	if ( !chk ) {
		//var el = document.getElementById("message"); 
		//el.style.display = "block";
		//return;
	}else {
		setTimeout( init2 , 60 );
	}
};

function init2() {
	ctx = canvas.getContext("2d");
	document.body.appendChild( canvas ); 
	canvas.style.position = "absolute";
	
	canvas.width = screen.availWidth * deviceScale << 0;
	canvas.height = screen.availHeight * deviceScale << 0;
	
	logo = new Logo();
	logo.init();
	
	models = [ cat = new Cat(), hphone = new HeadPhone(), fish = new Fish(), sun = new Sun(), tree = new Tree(), txtf = new TextField() ];
	renderList = [ sun, tree, cat, fish, hphone, txtf ];
	for( i = 0; i < models.length; ++i ){
		models[i].init( i );
	}
	
	sun.setTarget( cat.spine3 );
	fish.setTarget( cat.spine3 );
	tree.createTrees( cat.spine2, cat.spine3, cat.spine4 );
	cam = new Camera();
	
	mouseX = mouseXp = mouseXo = mouseY = mouseYo = mouseX2 = mouseY2 = 0;
	addListener( window, "resize", stageResize );
	
	setTimeout( start , 900 );
};

function setBtnEvent( bt ) {
	bt.style.color = bt.normalColor;
	if( isMouse ){
		bt.addEventListener( "mouseover", function() { bt.style.color = bt.overColor; } , false );
		bt.addEventListener( "mouseout", function() { bt.style.color = bt.normalColor; } , false );
	}
};

function start() {
	worldX = 0;
	doStageResize();
	
	logo.show( true );
	eventSet( canvas );
	eventSet( arrIconL );
	eventSet( arrIconR );
	if( window.orientation != null ){
		addListener( window, "orientationchange", windowOrientation );
	}
	
	cat.opening();
	arrIconR.style.left = ( stageW0 - 36 ) + "px";
	arrIconL.style.left = "10px";
	arrIconL.style.top = arrIconR.style.top = ( stageH0 - 30 ) + "px";
	arrIconL.style.display = arrIconR.style.display = "block";
	isShowArrow = true;
	snsbtn.style.display = "block";
	
	var interval = 1000 / 48 >> 0;
	totalFrame= 0;
	oldTime = new Date().getTime();
	windX = windY = 0;
	windXr = windYr = 0;
	var timer = setInterval( update, interval );
};

function finish(){
	state = 2;
	cat.finish();
	fish.finish();
	tree.finish();
	cam.finish();
	renderList = [ sun, cat, hphone, tree, txtf ];
};

var isShowSns = false;
var snsCC = 0;

function showSns(){
	//isShowSns = true;
	//snsbtn.style.display = "block";
	//layoutSns();
};

function update() {
	var now = new Date().getTime();
	var passt = now - oldTime;
	oldTime = now;
	timespeed = passt / 33;
	if( timespeed < 0.4 ) timespeed = 0.4;
	else if( timespeed > 2 ) timespeed = 2;
	timespeedR = ( 2 / timespeed - 1 ) / 4;
	
	var ts = timespeed;
	if( isStageResize ){
		doStageResize();
	}
	
	if( !isPC ){
		var devZZr;
		var ms0 = 0.6 * ts;
		var ms1 = 0.3 + timespeedR * 0.4;
		if( state == 2 ){
			mouseXp += ( deviceW - mouseXp ) * 0.35 * ts;
		}
		else if( !isMouseDown ){
			devZZr = 0.35;
			if( mouseXp < devZZr * deviceW ){
				mouseXp += ( devZZr * deviceW - mouseXp ) * 0.6 * ts;
			}
			if( mouseXp > stageW ){
				mouseXp += ( stageW - mouseXp ) * 0.6 * ts;
			}
		}else{
			devZZr = 0.19;
			if( mouseXp < devZZr * deviceW ){
				mouseXp += ( devZZr * deviceW - mouseXp ) * 0.5 * ts;
			}
			ms1 *= 0.6;
		}
		mouseXpR += mouseXpsa = ( mouseXp - mouseXpR ) * ms0 + mouseXpsa * ms1;
		worldW = worldX = mouseXpR * cam.zz;
	}
	
	var wdbmin = isPC ? 3300 : 1500;
	var wdb =  Math.min( 4900, deviceW * cam.zz - wdbmin );
	closeper = Math.max( 0, ( worldW - wdbmin ) / wdb );
	
	if( state == 0 ){
		if( closeper < 0.3 ){
			state = 1;
		}
	}else if( state == 1 && closeper > 0.92 ){
		finishCC += ts;
		if( finishCC > 50 ){
			finish();
		}
	}else if( state == 2 ){
		finishCC = 0;
		closeper = 1;
		if( !isShowSns && ( snsCC += ts ) > 90 ){
			showSns();
		}
	}else{
		finishCC = 0;
	}
	
	closeperR = Math.max( -1, 1 - closeper );
	totalFrame += ts;
	if( totalFrame > 2 ){
		totalFrame = 0;
		txtf.setTitle();
	}
	
	windX = ( Math.cos( windXr ) * 1 - 0 + Math.random() * 1 - 0.5 ) * ts;
	windY = ( Math.cos( windYr ) * 1 + Math.random() * 1 - 0.5 ) * ts;
	windXr += ( Math.random() * 0.2 + 0.05 ) * ts;
	windYr += ( Math.random() * 0.05 + 0.025 ) * ts;
	
	cam.update();
	
	var i, len = models.length, m;
	ctx.fillStyle = bgColor;
	
	if( isCanvasClear ){
		isCanvasClear = false;
		ctx.fillRect( 0, 0, canvas.width, canvas.height );
	}else{
		for( i = 0; i < len; ++i ){
			m = models[i];
			m.clearCanvas( ctx );
		}
	}
	
	if( !isPC ){
		ctx.fillStyle = bgColor;
		ctx.fillRect( crect_xx, crect_yy, crect_w,  crect_hh );
		ctx.fillRect( 0, crect_yy, crect_xstart,  crect_hh );
		
		ctx.fillStyle = "#000";
		var xx = ( worldX >> 1 ) * cam.zz_r + stageCx;
		var hh = stageH * 1 >> 0;
		var yy = stageH - hh >> 1;
		var xstart = stageW - xx;
		ctx.fillRect( xx, yy, stageW,  hh );
		ctx.fillRect( 0, yy, xstart,  hh );
		crect_xx = xx - 1;
		crect_yy = yy - 1;
		crect_w = stageW + 2;
		crect_xstart = xstart + 2;
		crect_hh = hh + 2;
	}
	
	for( i = 0; i < len; ++i ){
		models[i].update();
	}
	len = renderList.length;
	for( i = 0; i < len; ++i ){
		renderList[i].render();
	}
};

function eventSet( evtg ) {
	evtg.addEventListener( ( isMouse ? "mousedown" : "touchstart" ), touchStartHandler, false );
	evtg.addEventListener( ( isMouse ? "mousemove" : "touchmove" ), touchMoveHandler, false );
	evtg.addEventListener( ( isMouse ? "mouseup" : "touchend" ), touchEndHandler, false );
};

var windowOrientation = function() {
	stageResize();
};

var touchStartHandler = function( e ) {
	e.preventDefault();
	if ( !isMouseDown ) {
		isMouseDown = true;
		mouseX = e.pageX;
		mouseY = e.pageY;
		touchMoveHandler( e );
	}
};

var touchMoveHandler = function( e ) {
	if ( isMouseDown ) {
		if ( isMouse ) {
			taptype = 0;
			setMousePoint( e );
		}
		else{
			var ot = taptype;
			if ( ot != 1 ) {
				taptype = ( event.changedTouches.length == 1 ) ? 0 : 1;
			}
			var pt = e.changedTouches[0];
			mouseX = pt.pageX;
			mouseY = pt.pageY;
		}
		
		if ( taptype == 0 ) {
			
		}else {
			pt = event.changedTouches[1];
			mouseX2 = pt.pageX;
			mouseY2 = pt.pageY;
			var l0 = mouseX - mouseX2;
			var l1 = mouseY - mouseY2;
			var l = Math.sqrt( l0 * l0 + l1 * l1 );
			if( pind > 0 ){
				var d = ( l - pind ) * 1 * deviceScale;
				mouseXp += d;
			}
			pind = l;
			
			if( isShowArrow && ++arrCC > 1 ){
				isShowArrow = false;
				arrIconL.style.display = arrIconR.style.display = "none";
			}
		}
	}
};

function setMousePoint( e ){
	if( e ) {
		mouseX = e.pageX;
		mouseY = e.pageY;
	}else{
		mouseX = event.x + document.body.scrollLeft;
		mouseY = event.y + document.body.scrollTop;
	}
};

var touchEndHandler = function( e ) {
	if( isMouseDown ){
		isMouseDown = false;
		taptype = -1;
		pind = 0;
	}
};

function stageResize() {
	isStageResize = true;
};

function doStageResize() {
	isStageResize = false;
	var w = window.innerWidth;
	var h = window.innerHeight;
	stageW0 = w;
	stageH0 = h;
	stageW = w * deviceScale;
	stageH = h * deviceScale;
	stageCx = stageW >> 1;
	stageCy = stageH >> 1;
	
	cam.stageResize( isPC );
	
	if( isPC ){
		if( stageW > canvas.width ){
			canvas.width = stageW;
			isCanvasClear = true;
		}
		if( stageH > canvas.height ){
			canvas.height = stageH;
			isCanvasClear = true;
		}
	}else{
		canvas.width = stageW;
		canvas.height = stageH;
		canvas.style.width = w + "px";
		canvas.style.height = h + "px";
		isCanvasClear = true;
	}
	
	if( mouseXp == 0 ){
		mouseXp = stageW;
		mouseXpR = mouseXp;
	}
	
	var xx = stageW * cam.zz;
	worldX = worldW = xx >> 0;
	worldWmax = xx >> 0;
	
	var yy = stageCy * cam.zz;
	worldY = -yy;
	worldH = worldY << 1;
	
	deviceW = screen.availWidth * deviceScale;
	
	screenW = screen.availWidth;
	
	layoutSns();
	if( isShowArrow && ++arrCC > 1 ){
		isShowArrow = false;
		arrIconL.style.display = arrIconR.style.display = "none";
	}
};

function layoutSns() {
	//if( isShowSns ){
		//snsbtn.style.left = ( stageW0 - 200 >> 1 ) + "px";
		//snsbtn.style.top = Math.min( stageH0 - 70, ( stageH0 * 0.72 >> 0 )) + "px";
	//}
};

function Vertex( x, y, z ) {
	this.dx = x; this.dy = y; this.dz = z;
	this.inix = x; this.iniy = y; this.iniz = z;
	this.bx = 0; this.by = 0;
	this.bx1 = 0; this.by1 = 0;
	this.sx = 0; this.sy = 0; this.sz = 0;
	this.tBone = null;
	this.bone0 = null;
	this.bone1 = null;
};

Vertex.prototype.addBone = function( b ) {
	if(  this.bone0 == null ){
		this.bone0 = b;
		this.bx =  this.inibx = this.dx - b.dx;
		this.by =  this.iniby = this.dy - b.dy;
		this.bz =  this.inibz = this.dz - b.dz;
		this.tBone =  this.tBone1;
	}else if( this.bone1 == null ){
		this.bone1 = b;
		this.bx1 =  this.inibx1 = this.dx - b.dx;
		this.by1 =  this.iniby1 = this.dy - b.dy;
		this.tBone =  this.tBone2;
	}
};

Vertex.prototype.update = function() {
	var ssx = this.dx + modelx + cam.revx;
	var ssy = this.dy + modely + cam.revy;
	this.sz = this.dz + modelz + cam.revz;
	var zs = cam.wscale / this.sz;
	this.sx = stageCx + ( cam.m0 * ssx + cam.m1 * ssy ) * zs;
	this.sy = stageCy + ( cam.m4 * ssx + cam.m5 * ssy ) * zs;
};

Vertex.prototype.tBone1 = function() {
	var b = this.bone0;
	this.dx = b.cosZ * this.bx - b.sinZ * this.by + b.dx;
	this.dy = b.sinZ * this.bx + b.cosZ * this.by + b.dy;
	this.dz = b.dz;
};

Vertex.prototype.tBone2 = function() {
	var b0 = this.bone0;
	var b1 = this.bone1;
	this.dx = b0.cosZ * this.bx - b0.sinZ * this.by + b0.dx + b1.cosZ * this.bx1 - b1.sinZ * this.by1 + b1.dx >> 1;
	this.dy = b0.sinZ * this.bx + b0.cosZ * this.by + b0.dy + b1.sinZ * this.bx1 + b1.cosZ * this.by1 + b1.dy >> 1;
	this.dz = b0.dz + b1.dz >> 1;
};

Vertex.prototype.rotateType = function() {
	if( this.bone1 == null ){
		this.tBone =  this.tBone3;
	}
};

Vertex.prototype.tBone3 = function() {
	var b = this.bone0;
	var bx = this.bx;
	this.dx = b.m0 * bx + b.m1 * this.by + b.m2 * this.bz + b.m3;
	this.dy = b.m4 * bx + b.m5 * this.by + b.m6 * this.bz + b.m7;
	this.dz = b.m8 * bx + b.m9 * this.by + b.m10 * this.bz + b.m11;
};

Vertex.prototype.slim = function( scl ) {
	this.bx = this.inibx * scl;
	this.bz = this.inibz * scl;
	if( this.bone1 != null ){
		this.bx1 = this.inibx1 * scl;
	}
};


function Polygon( mat, vtxsrc, vtxids ) {
	this.material = mat;
	this.color = mat.color;
	
	var len = vtxids.length;
	if( len > 5 ){
		this.vertices = [];
		for( var i=0; i<len; ++i ){
			this.vertices[i] = vtxsrc[ vtxids[i]-1 ];
		}
		this.render = this.renderN;
		this.sz = this.vertices[0].dz;
	}else{
		this.v0 = vtxsrc[ vtxids[0]-1 ];
		this.v1 = vtxsrc[ vtxids[1]-1 ];
		this.v2 = vtxsrc[ vtxids[2]-1 ];
		if( len == 3 ){
			this.render = this.render3;
		}else if( len == 4 ){
			this.v3 = vtxsrc[ vtxids[3]-1 ];
			this.render = this.render4;
		}
		else{
			this.v3 = vtxsrc[ vtxids[3]-1 ];
			this.v4 = vtxsrc[ vtxids[4]-1 ];
			this.render = this.render5;
		}
		this.sz = this.v0.dz;
	}
	
	if( mat.render ){
		this.render = this[ mat.render ];
	}
}

Polygon.prototype.renderN = function( tg ) {
	
	var vtxs = this.vertices;
	var len = vtxs.length;
	var v0, v1, v2, v3;
	v0 = vtxs[ len-1 ];
	v1 = vtxs[ 0 ];
	v2 = vtxs[ 1 ];
	v3 = vtxs[ 2 ];
	tg.fillStyle = this.material.color;
	tg.beginPath();
	tg.moveTo( v1.sx,  v1.sy );
	
	var a = -0.0735;
	var b = 0.8155;
	var c = 0.2895;
	var d = -0.0315;
	
	for( var i=0; i<len; ++i ){
		tg.lineTo( v0.sx * a + v1.sx * b + v2.sx * c + v3.sx * d, v0.sy * a + v1.sy * b + v2.sy * c + v3.sy * d );
		tg.lineTo( v0.sx * d + v1.sx * c + v2.sx * b + v3.sx * a, v0.sy * d + v1.sy * c + v2.sy * b + v3.sy * a );
		tg.lineTo( v2.sx, v2.sy );
		v0 = v1;
		v1 = v2;
		v2 = v3;
		v3 = vtxs[ ( i+3 ) % len ];
	}
	if( !isDebugMode ){
		tg.fill();
	}
};

Polygon.prototype.renderSolid = function( tg ) {
	var len = this.vertices.length;
	tg.fillStyle = this.material.color;
	tg.beginPath();
	var v = this.vertices[0];
	tg.moveTo( v.sx,  v.sy );
	for( var i=1; i<len; ++i ){
		v = this.vertices[ i ];
		tg.lineTo(  v.sx,  v.sy );
	}
	tg.closePath();
	if( !isDebugMode ){
		tg.fill();
	}
};

Polygon.prototype.render3 = function( tg ) {
	tg.fillStyle = this.material.color;
	tg.beginPath();
	tg.moveTo( this.v0.sx, this.v0.sy );
	tg.lineTo( this.v1.sx, this.v1.sy );
	tg.lineTo( this.v2.sx, this.v2.sy );
	tg.closePath();
	if( !isDebugMode ){
		tg.fill();
	}
};

Polygon.prototype.render4 = function( tg ) {
	tg.fillStyle = this.material.color;
	tg.beginPath();
	tg.moveTo( this.v0.sx, this.v0.sy );
	tg.lineTo( this.v1.sx, this.v1.sy );
	tg.lineTo( this.v2.sx, this.v2.sy );
	tg.lineTo( this.v3.sx, this.v3.sy );
	tg.closePath();
	if( !isDebugMode ){
		tg.fill();
	}
};

Polygon.prototype.render5 = function( tg ) {
	tg.fillStyle = this.material.color;
	tg.beginPath();
	tg.moveTo( this.v0.sx, this.v0.sy );
	tg.lineTo( this.v1.sx, this.v1.sy );
	tg.lineTo( this.v2.sx, this.v2.sy );
	tg.lineTo( this.v3.sx, this.v3.sy );
	tg.lineTo( this.v4.sx, this.v4.sy );
	tg.closePath();
	if( !isDebugMode ){
		tg.fill();
	}
};


function Bone() {
	this.inix = this.inibx = this.bx = this.dx = 0;
	this.iniy = this.iniby = this.by = this.dy = 0;
	this.iniz = this.dz = 0;
	this.gx = this.gy = this.gz = 0;
	this.vx = this.vy = 0;
	this.ox = this.oy = 0;
	this.rz = 0;
	this.orz = this.orz2 = 0;
	this.rs = 0;
	this.s = 0;
	
	this.rsa = 0;
	this.parent = null;
	this.grz = 0;
	this.rzr = 0;
	this.scale = 1;
	this.xsa = 0; this.ysa = 0; this.zsa = 0;
	
	this.rzt = 0;
	this.cosZ = 0;
	this.sinZ = 0;
	this.myR = 0;
	this.myR2 = 0;
	this.cc = 0;
	this.cclimit = 0;
};

Bone.prototype.setData = function( dt ) {
	var scl = 1;
	this.name = dt[0];
	this.inix = this.inibx = this.bx = this.ox = this.dx = dt[2] * scl;
	this.iniy = this.iniby = this.by = this.oy = this.dy = dt[3] * scl;
	this.iniz = this.dz = dt[4] * scl;
};

Bone.prototype.setParent = function( b ) {
	if( b ){
		this.parent = b;
		this.inix = this.ox = this.dx = b.dx + this.bx;
		this.iniy = this.oy = this.dy = b.dy + this.by;
		this.bz = this.dz - b.dz;
		this.iniz = this.dz = this.dz + b.dz;
		this.myL = Math.sqrt( this.bx * this.bx + this.by * this.by );
	}
};

Bone.prototype.setParent2 = function( b ) {
	if( b ){
		this.parent = b;
		this.inibx = this.bx = this.dx - b.dx;
		this.iniby = this.by = this.dy - b.dy;
		this.bz = this.dz - b.dz;
		this.iniz = this.dz = this.dz + b.dz;
		this.myL = Math.sqrt( this.bx * this.bx + this.by * this.by );
	}
};

Bone.prototype.setVertices = function( arr, isRotate ) {
	var len = arr.length;
	for( var i=0; i<len; ++i ){ arr[i].addBone( this ); }
	if( isRotate ){
		this.rotateType( arr );
	}
	this.vertices = arr;
};

Bone.prototype.slim = function( scl ) {
	var arr = this.vertices;
	var len = arr.length;
	for( var i=0; i<len; ++i ){ arr[i].slim( scl ); }
	this.bx = this.inibx * scl;
};

Bone.prototype.updateMtx = function() {
	this.rzt = this.rz;
	this.scale2 = this.scale;
	this.cosZ = Math.cos( this.rzt ) * this.scale;
	this.sinZ = Math.sin( this.rzt ) * this.scale;
};

Bone.prototype.multMtx = function() {
	var p = this.parent;
	this.dx = p.cosZ * this.bx - p.sinZ * this.by + p.dx;
	this.dy = p.sinZ * this.bx + p.cosZ * this.by + p.dy;
	this.dz = p.dz;
	this.rzt = this.rz + p.rzt;
	this.scale2 = this.scale * p.scale2;
	this.cosZ = Math.cos( this.rzt ) * this.scale2;
	this.sinZ = Math.sin( this.rzt ) * this.scale2;
};

Bone.prototype.rotateType = function( arr ) {
	this.rx = 0;
	this.ry = 0;
	var len = arr.length;
	for( var i=0; i<len; ++i ){
		arr[i].rotateType();
	}
};

Bone.prototype.updateMtx2 = function() {
	this.scale2 = this.scale;
	this.rzt = this.rz;
	var cos_x = Math.cos( this.rx );
	var sin_x = Math.sin( this.rx );
	var cos_y = Math.cos( this.ry );
	var sin_y = Math.sin( this.ry );
	var cos_z = Math.cos( this.rz );
	var sin_z = Math.sin( this.rz );
	this.cosZ = cos_z;
	this.sinZ = sin_z;
	var cc = sin_y * sin_x;
	var gg = cos_y * sin_x;
	this.m0 = ( cos_y * cos_z + cc * sin_z ) * this.scale2;
	this.m1 = ( cos_y * -sin_z + cc * cos_z ) * this.scale2;
	this.m2 = ( sin_y * cos_x ) * this.scale2;
	this.m3 = this.dx;
	this.m4 = ( cos_x * sin_z ) * this.scale2;
	this.m5 = ( cos_x * cos_z ) * this.scale2;
	this.m6 = ( -sin_x ) * this.scale2;
	this.m7 = this.dy;
	this.m8 = ( -sin_y * cos_z + gg * sin_z ) * this.scale2;
	this.m9 = ( -sin_y * -sin_z + gg * cos_z ) * this.scale2;
	this.m10 = ( cos_y * cos_x ) * this.scale2;
	this.m11 = this.dz;
};

Bone.prototype.toPpos = function() {
	var p = this.parent;
	this.dx = p.cosZ * this.bx - p.sinZ * this.by + p.dx;
	this.dy = p.sinZ * this.bx + p.cosZ * this.by + p.dy;
	this.dz = p.dz;
};

Bone.prototype.toPpos2 = function() {
	var b = this.parent;
	this.dx = b.m0 * this.bx + b.m1 * this.by + b.m2 * this.bz + b.m3;
	this.dy = b.m4 * this.bx + b.m5 * this.by + b.m6 * this.bz + b.m7;
	this.dz = b.m8 * this.bx + b.m9 * this.by + b.m10 * this.bz + b.m11;
};

Bone.prototype.render = function( tg ) {
	var ssx = this.dx + cam.revx;
	var ssy = this.dy + cam.revy;
	var sz = this.dz + cam.revz;
	var zs = cam.wscale / sz;
	this.sx = stageCx + ( cam.m0 * ssx + cam.m1 * ssy ) * zs;
	this.sy = stageCy + ( cam.m4 * ssx + cam.m5 * ssy ) * zs;
	tg.fillRect( this.sx - 2, this.sy - 2, 4, 4 );
	if( this.parent ){
		tg.beginPath();
		tg.moveTo( this.parent.sx, this.parent.sy );
		tg.lineTo( this.sx, this.sy );
		tg.stroke();
	}
};



function Mesh(){};

Mesh.prototype.makeBody = function( verticesrc, polysrc, matsrc ) {
	this.dx = 0;
	this.dy = 0;
	this.dz = 0;
	this.vertices = [];
	this.polygons = [];
	this.makeVertices( this.vertices, verticesrc );
	this.makePolygons( this.polygons, this.vertices, polysrc, matsrc );
	this.polygons.sort( compZ );
	this.renderMinX = 1;
	this.renderMaxX = 0;
	this.renderMinY = 1;
	this.renderMaxY = 0;
};

Mesh.prototype.makeVertices = function( res, src ) {
	var scl = 1;
	for ( var i in src ) {
		res[i] = new Vertex( src[i][0] * scl, src[i][1] * scl, src[i][2] * scl );
	}
};

Mesh.prototype.makePolygons = function( res, vtxs, src, mat ) {
	for ( var i in src ) {
		res[i] = new Polygon( mat[i].material, vtxs, src[i] );
	}
};

Mesh.prototype.makeBone = function( weightsrc, bonesrc ) {
	this.hasBone = true;
	this.bones = [];
	this.addBone( this.bones, bonesrc, weightsrc, this.vertices );
};

Mesh.prototype.addBone = function( res, arr, weightsrc, _vertices ) {
	var len = arr.length;
	var dt, bn, iii, ii, vlen;
	for ( var i = 0; i < len; ++i ) { arr[i].id = i; }
	
	var sortarr = [];
	var parentID;
	var parentIDarr = [-1];
	var pcount = 0;
	while( pcount < len ){
		for( var m in parentIDarr ){
			parentID = parentIDarr.shift();
			for( var n in arr ){
				if ( arr[n][1] == parentID ) {
					sortarr.push( arr[n] );
					parentIDarr.push( arr[n].id );
					++pcount;
				}
			}
		}
	}
	
	arr = sortarr;
	
	for( i=0; i<len; ++i ){
		dt = arr[i];
		for( ii=0; ii<len; ++ii ){
			if( dt[1] == arr[ii].id ){
				dt[1] = ii >> 0;
				break;
			}
		}
	}
	
	for ( i = 0; i < len; ++i ) {
		res[i] = bn = new Bone();
		bn.setData( arr[i] );
	}
	
	for( i=0; i<len; ++i ){
		dt = arr[i];
		bn = res[i];
		var weightVtxs;
		for( var k in weightsrc ){
			if( weightsrc[k].name == dt[0] ){
				weightVtxs = weightsrc[k].vertices;
				break;
			}
		}
		var vtxs = [];
		if( weightVtxs ){
			vlen = weightVtxs.length;
			for ( iii = 0; iii < vlen; ++iii ) { vtxs[iii] = _vertices[ weightVtxs[iii]-1 ]; }
		}
		bn.setParent( res[dt[1]] );
		bn.setVertices( vtxs, dt[5] );
	}
};

Mesh.prototype.update = function() {
	if( this.animate != null ){
		this.animate();
	}
	if( this.hasBone ){
		this.updateBone();
		this.tBone();
	}
};

Mesh.prototype.updateBone = function() {
	var bones = this.bones;
	var len = bones.length;
	bones[0].updateMtx();
	for ( var i = 1; i < len; ++i ) {
		bones[i].multMtx();
	}
};

Mesh.prototype.tBone = function() {
	var vertices = this.vertices;
	var len = vertices.length;
	for ( var i = 0; i < len; ++i ) {
		vertices[i].tBone();
	}
};

Mesh.prototype.render = function() {
	
	modelx = this.dx;
	modely = this.dy;
	modelz = this.dz;
	
	var vtxs = this.vertices;
	var len =vtxs.length;
	var v;
	var minX = 9999;
	var maxX = 0;
	var minY = 9999;
	var maxY = 0;
	
	for ( i = 0; i < len; ++i ) {
		v = vtxs[i];
		v.update();
		if( v.sx < minX ){
			minX = v.sx;
		}else if( v.sx > maxX ){
			maxX = v.sx;
		}
		
		if( v.sy < minY ){
			minY = v.sy;
		}else if( v.sy > maxY ){
			maxY = v.sy;
		}
	}
	
	var offset = 8;
	this.renderMinX = minX - offset >> 0;
	this.renderMaxX = maxX + offset >> 0;
	this.renderMinY = minY - offset >> 0;
	this.renderMaxY = maxY + offset >> 0;
	
	var polygons = this.polygons;
	len = polygons.length;
	
	if( isDebugMode ){
		ctx.strokeStyle = "#E680AC";
		for ( i = 0; i < len; ++i ) { 
			polygons[i].render( ctx ); 
			ctx.stroke();
		}
		
		ctx.fillStyle = "#FFF";
		for ( i = 0; i < vtxs.length; ++i ) {ctx.fillRect( vtxs[i].sx - 1, vtxs[i].sy - 1, 2, 2 );}
		
		if( this.bones != null ){
			ctx.fillStyle = "#3D001B";
			ctx.strokeStyle = "#8E003E";
			ctx.lineWidth = 1;
			for ( i = 0; i < this.bones.length; ++i ) {
				this.bones[i].render( ctx );
			}
		}
	}else{
		for ( i = 0; i < len; ++i ) { 
			polygons[i].render( ctx ); 
		}
	}
};

Mesh.prototype.clearCanvas = function( tg ) {
	var m = this;
	tg.fillRect( m.renderMinX, m.renderMinY, m.renderMaxX - m.renderMinX,  m.renderMaxY - m.renderMinY );
};

var compZ = function( a, b ) {	return b.sz - a.sz; };
var compDX = function( a, b ) { return a.dx - b.dx; };



function Cat() {};
Cat.prototype = new Mesh();

Cat.prototype.init = function( n ) {
	this.id = n;
	var mat_w = { color : "#FFF" };
	var mat_b = { color : "#000" };
	var mat_body = { color : "#FFF", render : "renderSolid" };
	var mat_body2 = { color : "#CCC", render : "renderSolid" };

	var bone_src= [
	 ["leg1", -1, 194,-11,0], //0
	 ["leg0", 0, 0,0,0], //1
	 ["hip", 0, 412,10,0], //2
	 ["arm0", 4, 0,0,0], //3
	 ["arm1", -1, 6044,-173,0], //4
	 ["neck", 4, -382,48,0], //5
	 ["head", 5, -6,449,0], //6
	 ["face", 6, -36,241,0,1], //7
	 ["tail0", 2, -90,207,0], //8
	 ["tail1", 8, -42,65,0], //9
	 ["tail2", 9, -39,61,0], //10
	 ["earR0", 6, -259,465,0], //11
	 ["earR1", 11, -123,147,0], //12
	 ["earL0", 6, 112,503,0], //13
	 ["earL1", 13, 47,200,0], //14
	 ["spine0", 2, 185,368,0], //15
	 ["spine1", 15, 796,0,0], //16
	 ["spine2", 16, 792,0,0], //17
	 ["spine3", 17, 808,0,0], //18
	 ["spine4", 18, 793,0,0], //19
	 ["spine5", 19, 792,0,0], //20
	 ["spine6", 5, -85,501,0], //21
	 ["rib0", 2, 188,-268,0], //22
	 ["rib1", 22, 796,0,0], //23
	 ["rib2", 23, 792,0,0], //24
	 ["rib3", 24, 808,0,0], //25
	 ["rib4", 25, 793,0,0], //26
	 ["rib5", 26, 792,0,0], //27
	 ["rib6", 5, -85,-149,0] //28
	];

	var verticesrc = [[560,216,6],[523,302,6],[496,373,6],[432,450,6],[319,374,6],[372,286,6],[429,241,6],[509,168,6],[450,259,6],[404,307,6],[355,380,6],[408,426,6],[465,354,6],[504,286,6],[562,210,28],[349,135,28],[173,219,28],[1,132,28],[-8,-57,28],[46,114,28],[168,174,28],[352,102,28],[517,122,5],[343,55,5],[56,89,5],[-14,-159,5],[64,-275,5],[77,-233,5],[39,-166,5],[89,48,5],[342,21,5],[5993,-362,5],[6215,-282,5],[6222,-30,5],[6061,-30,5],[6035,-156,5],[5744,-41,5],[6077,-184,5],[6099,-54,5],[6180,-57,5],[6172,-255,5],[5994,-309,5],[6225,-5,21],[6213,139,21],[6048,137,21],[6006,-32,21],[5805,25,21],[6039,-62,21],[6075,99,21],[6175,105,21],[175,128,5],[183,77,5],[357,-81,5],[187,-58,5],[163,-205,5],[192,-229,5],[214,-98,5],[344,-117,5],[4764,-250,5],[3969,-250,5],[3174,-250,5],[2375,-250,5],[1584,-250,5],[1584,-294,5],[2375,-294,5],[3174,-294,5],[3969,-294,5],[4764,-294,5],[6143,26,5],[6134,-24,5],[6127,180,21],[6122,124,21],[784,-294,5],[786,-250,5],[5565,-294,5],[5563,-250,5],[5688,-33,8],[5812,48,8],[5841,195,8],[5786,68,8],[5149,768,0],[5087,572,0],[5104,394,0],[5151,306,0],[5349,158,0],[5530,120,0],[5786,135,0],[6010,240,0],[6122,375,0],[6148,491,0],[6134,672,0],[6053,845,0],[6167,677,0],[6206,498,0],[6170,358,0],[6035,215,0],[5791,109,0],[5525,92,0],[5335,129,0],[5108,274,0],[5064,375,0],[5049,575,0],[5154,774,0],[5075,1163,0],[5246,1079,0],[5407,1016,0],[5534,977,0],[5402,977,0],[5282,1003,0],[5163,1048,0],[5179,955,0],[5178,867,0],[5890,1325,0],[5932,1142,0],[5976,996,0],[5470,700,-395],[5433,629,-395],[5450,580,-395],[5482,541,-395],[5521,633,-395],[5503,668,-395],[5756,722,-395],[5716,656,-395],[5733,606,-395],[5765,573,-395],[5804,659,-395],[5786,695,-395],[5663,430,-471],[5609,474,-471],[5610,500,-471],[5658,495,-471],[5695,508,-471],[5706,490,-471],[5396,362,-395],[5433,357,-395],[5515,319,-395],[5677,318,-395],[5566,335,-395],[5493,365,-395],[5454,399,-395],[5436,438,-395],[5112,1006,0],[5140,879,0],[5783,1181,0],[5686,1078,0],[5583,976,0],[5738,986,0],[5860,967,0],[5959,921,0],[5585,311,-395],[5394,383,-395],[6042,850,0],[5225,228,0],[5199,192,0],[369,424,6],[333,442,6],[372,468,6],[5945,-169,5],[5941,-213,5],[5941,-45,21],[5938,-94,21],[591,228,34],[351,110,34],[171,189,34],[34,119,34],[-9,-96,34],[532,133,34],[344,39,34],[68,82,34],[173,111,34],[622,276,18],[567,202,18],[486,348,18],[409,441,18],[353,442,18],[338,380,18],[390,298,18],[441,250,18],[531,132,18],[344,35,18],[173,102,18],[22,-167,18],[71,-252,18],[5989,-358,18],[6215,-277,18],[6193,-54,18],[6091,-40,18],[6048,-178,18],[5731,3,18],[5795,53,18],[5844,207,18],[178,-218,18],[204,-80,18],[344,-97,18],[1584,-264,18],[2375,-264,18],[3174,-264,18],[3969,-264,18],[4764,-264,18],[78,72,18],[6144,-6,18],[5730,-284,18],[786,-274,18],[5584,-269,18],[531,145,18],[5575,382,18],[4764,363,18],[1584,363,18],[3174,363,18],[2376,363,18],[790,363,18],[5744,-44,18],[6222,-30,25],[6071,-36,25],[6043,-176,25],[5744,-41,25],[6187,117,25],[6068,109,25],[6026,-52,25],[5792,43,25],[6143,16,25],[6123,138,25],[6225,-5,25],[5732,3,25],[5149,768,5],[6068,820,5],[6147,672,5],[6166,503,5],[6130,373,5],[6020,225,5],[5789,125,5],[5525,114,5],[5345,151,5],[5138,300,5],[5092,389,5],[5079,571,5],[5407,982,5],[5292,1013,5],[5153,1063,5],[5169,950,5],[5163,862,5],[5583,976,5],[5738,996,5],[5860,977,5],[5959,936,5],[6042,860,5],[5217,222,5],[5941,-193,18],[5941,-185,25],[5934,-75,25],[3184,-20,13],[3969,355,13],[4764,393,13],[1584,393,13],[1584,355,13],[2376,355,13],[4764,355,13],[3969,393,13],[3174,393,13],[2376,393,13],[5575,382,13],[791,363,13],[523,122,13],[826,366,13],[697,342,13],[600,232,13],[587,253,13],[710,317,13],[3969,363,18],[3585,211,5],[3610,230,5],[3583,240,5],[3245,266,5],[3270,285,5],[3228,295,5],[3355,111,5],[3380,130,5],[3363,150,5],[2910,216,5],[2920,250,5],[2893,245,5],[2743,101,13],[3595,101,13],[4985,483,-134],[5107,498,-134],[6111,426,-59],[6105,715,-59],[6234,699,-59],[6232,457,-59],[6252,578,-129],[6121,574,-129],[5119,668,-56],[5142,355,-56],[5005,363,-54],[4993,629,-54],[6109,575,5],[5114,500,32],[6247,579,11],[4971,477,36]];
	var polysrc = [[14,13,12,155,11,10,9,8,7,6,5,156,157,4,3,2,1],[22,21,20,19,18,17,16,15],[48,161,47,160,46,45,71,44,43,50,72,49],[32,75,68,67,66,65,64,73,58,57,56,27,26,25,51,24,23,31,52,30,29,28,55,54,53,74,63,62,61,60,59,76,42,41,40,70,39,38,159,37,158,36,35,69,34,33],[79,78,77,80],[81,82,83,84,153,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,154,100,101,102],[103,143,142,104,105,106,107,108,109,110,111,112],[121,120,119,118,117,116],[127,126,125,124,123,122],[128,129,130,131,132,133],[151,141,140,139,138,137,150,136,135,134],[113,114,115,152,149,148,147,146,145,144],[166,165,164,163,162,167,168,170,169],[192,183,182,200,181,180,179,205,178,177,176,175,174,173,172,171,211,208,210,209,269,207,206,191,190,189,212,248,188,187,201,186,185,184,202,204,199,198,197,196,195,203,194,193],[216,224,220,250,219,218,222,217,223,213,221,214,215,249],[236,225,241,240,239,238,237,242,243,244,245,246,226,227,228,229,230,231,232,233,247,234,235],[255,256,282,251,283,252,257,261,253,258,259,260,254,262],[264,268,266,263,267,265],[272,271,270],[275,274,273],[278,277,276],[281,280,279],[287,288,290,289,286,291],[288,298,289,290],[291,286,296,287],[294,299,295,284],[285,292,297,293],[292,285,293,294,284,295]];
	var matsrc = [{material:mat_b,vIDs:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]},{material:mat_b,vIDs:[18,19,20,21,22,23,24,25]},{material:mat_b,vIDs:[26,27,28,29,30,31,32,33,34,35,36,37]},{material:mat_b,vIDs:[38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83]},{material:mat_b,vIDs:[84,85,86,87]},{material:mat_b,vIDs:[88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111]},{material:mat_b,vIDs:[112,113,114,115,116,117,118,119,120,121,122,123]},{material:mat_b,vIDs:[124,125,126,127,128,129]},{material:mat_b,vIDs:[130,131,132,133,134,135]},{material:mat_b,vIDs:[136,137,138,139,140,141]},{material:mat_b,vIDs:[142,143,144,145,146,147,148,149,150,151]},{material:mat_b,vIDs:[152,153,154,155,156,157,158,159,160,161]},{material:mat_body2,vIDs:[162,163,164,165,166,167,168,169,170]},{material:mat_body,vIDs:[171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214]},{material:mat_body2,vIDs:[215,216,217,218,219,220,221,222,223,224,225,226,227,228]},{material:mat_body,vIDs:[229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251]},{material:mat_b,vIDs:[252,253,254,255,256,257,258,259,260,261,262,263,264,265]},{material:mat_b,vIDs:[266,267,268,269,270,271]},{material:mat_w,vIDs:[272,273,274]},{material:mat_w,vIDs:[275,276,277]},{material:mat_w,vIDs:[278,279,280]},{material:mat_w,vIDs:[281,282,283]},{material:mat_b,vIDs:[284,285,286,287,288,289]},{material:mat_b,vIDs:[290,291,292,293]},{material:mat_b,vIDs:[294,295,296,297]},{material:mat_b,vIDs:[298,299,300,301]},{material:mat_b,vIDs:[302,303,304,305]},{material:mat_b,vIDs:[306,307,308,309,310,311]}];
	var weightsrc = [
	 {name:"arm0",vertices:[33,34,35,36,38,39,40,41,43,44,45,46,48,49,50,69,70,71,72,160,161,185,186,187,188,201,213,214,215,217,218,219,221,222,223,248,250]},
	 {name:"arm1",vertices:[32,36,37,38,42,47,158,159,160,161,184,202,212,215,216,248,249,250]},
	 {name:"cable0",vertices:[]},
	 {name:"earL0",vertices:[114,115,144,145]},
	 {name:"earL1",vertices:[113,114,144]},
	 {name:"earR0",vertices:[105,106,108,109,110,111,112,142,143,237,238,239,240,241]},
	 {name:"earR1",vertices:[104,105,109,110,111,142,238,239,240]},
	 {name:"face",vertices:[116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,150,151,284,285,286,287,288,289,290,291,292,293,294,295,296,297,298,299]},
	 {name:"head",vertices:[81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,106,107,108,112,115,143,145,146,147,148,149,152,153,154,225,226,227,228,229,230,231,232,233,234,235,236,237,241,242,243,244,245,246,247]},
	 {name:"hip",vertices:[15,23,162,167,171,179,205,211,262,263,264,265,266,267,268]},
	 {name:"leg0",vertices:[17,18,19,20,21,25,26,27,28,29,30,51,52,54,55,56,57,164,165,166,169,170,181,182,183,192,193,200]},
	 {name:"leg1",vertices:[16,22,24,31,53,54,57,58,163,168,180,193,194]},
	 {name:"neck",vertices:[37,47,77,78,79,80,189,190,191,212,216,220,224]},
	 {name:"rib0",vertices:[73,74,203]},
	 {name:"rib1",vertices:[63,64,195]},
	 {name:"rib2",vertices:[62,65,196]},
	 {name:"rib3",vertices:[61,66,197]},
	 {name:"rib4",vertices:[60,67,198]},
	 {name:"rib5",vertices:[59,68,199]},
	 {name:"rib6",vertices:[75,76,204]},
	 {name:"spine0",vertices:[211,262,264,265]},
	 {name:"spine1",vertices:[208,254,255]},
	 {name:"spine2",vertices:[210,256,260,282]},
	 {name:"spine3",vertices:[209,251,259,270,271,272,273,274,275,276,277,278,279,280,281,282,283]},
	 {name:"spine4",vertices:[252,258,269,283]},
	 {name:"spine5",vertices:[207,253,257]},
	 {name:"spine6",vertices:[206,261]},
	 {name:"tail0",vertices:[1,2,7,8,9,14,172,178]},
	 {name:"tail1",vertices:[2,7,9,14,178]},
	 {name:"tail2",vertices:[3,4,5,6,10,11,12,13,155,156,157,173,174,175,176,177]}
	];

	this.makeBody( verticesrc, polysrc, matsrc );
	this.makeBone( weightsrc, bone_src );
	
	var me = this;
	for ( var i = 0; i < me.bones.length; ++i ) { me[ me.bones[i].name ] = me.bones[i]; }
	this.spines = [ this.spine0, this.spine1, this.spine2, this.spine3, this.spine4, this.spine5, this.spine6 ];
	this.ribs = [ this.rib0, this.rib1, this.rib2, this.rib3, this.rib4, this.rib5, this.rib6 ];
	this.spcV0 = this.vertices[ 250 ];
	this.spcV1 = this.vertices[ 281 ];
	this.spcV2 = this.vertices[ 282 ];
	
	this.rrr = 0;
	this.rrr2 = 0;
	this.rrr3 = Math.random() * 10;
	this.rrr4 = Math.random() * 10;
	this.rrr5 = Math.random() * 10;
	this.rrr6 = Math.random() * 10;
	this.rrr7 = Math.random() * 10;
	this.rrr8 = Math.random() * 10;
	this.rrr9 = Math.random() * 10;
	this.rrr10 = Math.random() * 10;
	
	this.eyeVL0 = this.vertices[ 116 ];
	this.eyeVR0 = this.vertices[ 122 ];
	this.eyes = [
		this.vertices[ 115 ],
		this.vertices[ 120 ],
		this.vertices[ 117 ],
		this.vertices[ 118 ] ,
		this.vertices[ 121 ],
		this.vertices[ 126 ],
		this.vertices[ 123 ],
		this.vertices[ 124 ]
	];
	
	this.blinkcc = 28;
	this.blinklimit = 30;
};

Cat.prototype.blink = function() {
	this.blinkcc += timespeed;
	if( this.blinkcc > this.blinklimit + 4.5 ){
		this.blinkcc = 0;
		this.blinklimit = Math.random() * 60 + 2;
	}else if( this.blinkcc > this.blinklimit ){
		this.doBlink();
	}else{
		this.doBlink2();
	}
};

Cat.prototype.doBlink = function() {
	var gby = this.eyeVL0.by;
	var b, s = 0.65 * timespeed;
	var len = 4, eyes = this.eyes;
	for( var i=0; i<len; ++i ){ b = eyes[i]; b.by += ( gby - b.by ) * s; }
	gby = this.eyeVR0.by;
	len = 8;
	for( i=4; i<len; ++i ){ b = eyes[i]; b.by += ( gby - b.by ) * s; }
};

Cat.prototype.doBlink2 = function() {
	var b, s = 0.65 * timespeed;
	var len = 8, eyes = this.eyes;
	for( var i=0; i<len; ++i ){
		b = eyes[i]; b.by += ( b.iniby - b.by ) * s;
	}
};

Cat.prototype.opening = function() {
	this.arm1.dy = this.leg1.dy = 
	this.rib6.dy = this.spine6.dy = 
	this.rib0.dy = this.spine0.dy = this.gy = -worldH + 3000 >> 1;
	this.head.orz = this.head.orz2 = 0;
	this.arm1.rsa = 0;
	this.cc = 0;
	this.animate = this.standM;
};

Cat.prototype.standM = function() {
	var ts = timespeed;
	var b, b1, per;
	var s = 0.6;
	var per2;
	var per = ts;
	this.rrr += 0.13 * per;
	this.rrr2 += 0.112 * per;
	this.rrr6 += 0.063 * per;
	this.rrr7 += 0.0956 * per;
	this.rrr3 += 0.103 * per;
	this.rrr4 += 0.12 * per;
	this.rrr5 += 0.15 * per;
	this.rrr8 += 0.123 * per;
	this.rrr9 += 0.0753 * per;
	this.rrr10 += 0.83 * per;
	
	var wx = worldX >> 1;
	
	this.blink();
	
	this.cc += ts;
	if( this.cc > 15 ) this.gy -= 240 * ts;
	if( this.gy < 0 ){this.gy = 0;}
	this.arm1.dy += this.arm1.rsa = ( this.gy - this.arm1.dy ) * 0.024 + this.arm1.rsa * 0.85;
	this.leg1.dy = this.arm1.dy;
	
	this.arm1.dx = wx - 180;
	this.arm1.rz = Math.cos( this.rrr ) * 0.3;
	this.leg1.rz = Math.cos( this.rrr2 ) * -0.3;
	
	if( state == 1 && closeper > 0.85 ){
		per2 = Math.min( 0.4, Math.max( 0, closeper - 0.85 ) * 5 );
		per = 1 - per2;
		this.arm1.rz *= per;
		this.leg1.rz *= per;
		per2 *= ts;
		this.rrr += 1 * per2;
		this.rrr2 += 1.3 * per2;
	}
	this.arm0.rz = -this.arm1.rz;
	this.neck.rz = -this.arm1.rz * 0.7;
	
	this.leg1.dx = -wx + 180;
	this.leg0.rz = this.leg1.rz * -1;
	this.hip.rz = this.leg1.rz * -1.5;
	
	b = this.head;
	b.orz2 = b.orz;
	b.orz = b.rz;
	b.grz = Math.cos( this.rrr3 ) * 0.55;
	if( state == 1 && closeper > 0.3 ){
		this.rrr3 += Math.min( 1, closeper - 0.3 ) * 0.8 * ts;
		if( closeper > 0.85 ){
			this.rrr3 += Math.min( 1, closeper - 0.8 ) * 1 * ts;
		}
	}
	b.rz += ( b.grz - b.rz ) * s;
	
	b = this.face;
	b.grx = Math.cos( this.rrr7 ) * 0.4;
	b.gry = Math.cos( this.rrr9 ) * 0.4 + 0.2;
	if( state == 1 && closeper > 0.4 ){
		per = 1 - Math.min( 0.7, Math.max( 0, closeper - 0.4 ) * 2 );
		b.grx *= per;
		b.gry *= per;
		b.gry += 0.3 * ( 1 - per );
	}
	b.rx += ( b.grx - b.rx ) * s;
	b.ry += ( b.gry - b.ry ) * s;
	b.rz = this.head.rz;
	
	
	this.head.bx = Math.max( 0, closeperR ) * -200;
	this.head.scale = this.face.scale = Math.max( 1, closeperR + 0.5 );
	
	this.earR0.rz = ( this.head.orz2 - this.head.orz ) * 4;
	this.earR1.rz = this.earR0.rz * 2;
	if( state == 1 && closeper > 0.5 ){
		per2 = Math.min( 0.8, Math.max( 0, closeper - 0.5 ) * 3 );
		per = 1 - per2;
		this.earR0.rz *= per;
		this.earR1.rz *= per;
	}
	this.earL0.rz = this.earR0.rz;
	this.earL1.rz = this.earR1.rz;
	
	this.tail0.rz = Math.cos( this.rrr5 ) * 0.4;
	this.tail1.rz = this.tail0.rz * 0.5;
	this.tail2.rz = this.tail0.rz * 1.5;
	this.tail0.rz -= 0.2;
	
	if( state == 0 ){
		per = 0.06;
	}else{
		per = Math.max( 0.06, Math.min( 1, ( closeper - 0.45 ) * 2.3 ));
	}
	this.spcV0.by = this.spcV0.iniby * per;
	this.spcV1.by = this.spcV1.iniby * per;
	this.spcV2.by = this.spcV2.iniby * per;
	this.spcV1.by1 = this.spcV1.iniby1 * per;
	this.spcV2.by1 = this.spcV2.iniby1 * per;
	
	this.updateChain();
};


Cat.prototype.finish = function() {
	this.faceScl = 1;
	this.faceScl2 = 1;
	this.faceScl_sa = 0;
	this.faceScl2_sa = 0;
	this.r3p = 2;
	this.headRscl = 1.6;
	this.earSpd = 0;
	this.toBtm = false;
	this.arm1.vy = -100;
	
	this.animate = this.finishM;
};

Cat.prototype.finishM = function() {
	var ts = timespeed;
	var b, b1, per;
	var s = 0.6;
	var s2 = 0.3 * ts;
	var per2;
	var per = ts;
	this.rrr += 0.13 * per;
	this.rrr2 += 0.162 * per;
	this.rrr6 += 0.063 * per;
	this.rrr7 += 0.0656 * per;
	this.rrr3 += 0.0803 * per;
	this.rrr4 += 0.12 * per;
	this.rrr5 += 0.715 * per;
	this.rrr8 += 0.123 * per;
	this.rrr9 += 0.0453 * per;
	this.rrr10 += 0.83 * per;
	
	this.blink();
	
	var scl = this.faceScl;
	this.face.slim( scl );
	this.head.slim( scl );
	this.earL0.slim( scl );
	this.earL1.slim( scl );
	this.earR0.slim( scl );
	this.earR1.slim( scl );
	hphone.cableR0.bx =  hphone.cableR0.inibx * scl;
	hphone.cableL0.bx =  hphone.cableL0.inibx * scl;
	
	var wx = worldX >> 1;
	
	this.arm1.dx += this.arm1.xsa = ( 450 - this.arm1.dx ) * 0.2 + this.arm1.xsa * 0.65;
	
	var ss0 = 0.04 * ts;
	if( this.arm1.dx < 600 ){
		this.faceScl2 += ( 1.6 - this.faceScl2 ) * ss0;
		this.faceScl +=( 2.1 - this.faceScl ) * ss0;
	}else{
		
	}
	
	if( this.toBtm || this.arm1.dx < 700 ){
		this.toBtm = true;
		this.arm1.dy += ( -800 - this.arm1.dy ) * s2;
		
		this.arm1.grz = Math.cos( this.rrr ) * 0.15 - 1.2;
		this.leg1.grz = Math.cos( this.rrr ) * 0.13 + 1.2;
		this.arm0.grz = -this.arm1.grz - pi05;
		this.leg0.grz = -this.leg1.grz + pi05;
		this.rrr3 += this.r3p * ts;
		this.r3p += ( 0 - this.r3p ) * 0.05 * ts;
		this.headRscl += ( 0.25 - this.headRscl ) * 0.07 * ts;
		this.earSpd += ( 2.5 - this.earSpd ) * 0.01 * ts;
	}else{
		this.arm1.dy += ( 500 - this.arm1.dy ) * s2;
		this.arm1.grz = Math.cos( this.rrr ) * 0.15;
		this.leg1.grz = Math.cos( this.rrr ) * 0.13;
		this.arm0.grz = -this.arm1.grz;
		this.leg0.grz = -this.leg1.grz;
	}
	
	this.arm1.rz += ( this.arm1.grz - this.arm1.rz ) * s;
	this.leg1.rz += ( this.leg1.grz - this.leg1.rz ) * s;
	
	this.arm0.rz += ( this.arm0.grz - this.arm0.rz ) * s;
	this.leg0.rz += ( this.leg0.grz - this.leg0.rz ) * s;
	
	this.neck.rz = -this.arm1.rz * 1;
	
	this.leg1.dx += this.leg1.xsa = ( -700 - this.leg1.dx ) * 0.2 + this.leg1.xsa * 0.65;
	this.leg1.dy += ( this.arm1.dy - this.leg1.dy ) * 0.8;
	this.hip.rz = this.leg1.rz * -1;
	
	b = this.head;
	b.orz2 = b.orz;
	b.orz = b.rz;
	b.grz = Math.cos( this.rrr3 ) * this.headRscl;
	b.rz = b.grz;
	
	b = this.face;
	b.grx = Math.cos( this.rrr7 ) * 0.13;
	b.gry = Math.cos( this.rrr9 ) * 0.35;
	b.rx += ( b.grx - b.rx ) * s;
	b.ry += ( b.gry - b.ry ) * s;
	b.rz = this.head.rz;
	
	this.head.bx = 50;
	this.head.by = 500;
	this.head.scale = this.face.scale += ( this.faceScl2 - this.face.scale ) * s2;
	
	this.earR0.rz = ( this.head.orz2 - this.head.orz ) * this.earSpd;
	this.earR1.rz = this.earR0.rz * 4;
	this.earL0.rz = this.earR0.rz;
	this.earL1.rz = this.earR1.rz;
	
	this.tail0.rz = Math.cos( this.rrr5 ) * 0.4;
	this.tail1.rz = this.tail0.rz * 0.5;
	this.tail2.rz = this.tail0.rz * 1.5;
	this.tail0.rz += 0.4;
	
	per = 0.06;
	this.spcV0.by = this.spcV0.iniby * per;
	this.spcV1.by = this.spcV1.iniby * per;
	this.spcV2.by = this.spcV2.iniby * per;
	this.spcV1.by1 = this.spcV1.iniby1 * per;
	this.spcV2.by1 = this.spcV2.iniby1 * per;
	
	this.updateChain();
};


Cat.prototype.updateChain = function() {
	var ts = timespeed;
	var i, b, b1, r, cos, sin, l, lsa, ddx, ddy;
	var spines = this.spines;
	var len = spines.length - 1;
	
	var g = -20 * ts;
	var f = 0.8;
	var stf = 0.5;
	var s = 0.4 * ts;
	
	b = spines[0];
	b1 = spines[6];
	var xx = b.dx;
	var yy = b.dy;
	var xp = ( b1.dx - xx ) / len;
	var yp = ( b1.dy - yy ) / len;
	var rp = pi / len;
	var per = Math.min( 10, Math.max( -0.4, closeperR * 1.5 ));
	if( closeper < 0.3 ){
		per += ( 1 - closeper / 0.3 ) * 1.5;
		
	}
	if( per > 2 ) per = 2;
	
	var fat = per * 250;
	var r = 0;
	var r2 = 0, r2p = 0;
	
	var blurp;
	if( state == 1 ){
		blurp = Math.min( 1, Math.max( 0, ( closeper - 0.75 ) * 2 )) * 80;
		r2p = 1;
		r2 = this.rrr;
	}else if( state == 2 ){
		blurp = 0;
		fat = 0;
	}
	else{
		blurp = 0;
	}
	
	for( i=1; i<len; ++i ){
		xx += xp;
		yy += yp;
		r += rp;
		b1 = spines[i];
		b1.dx = xx;
		b1.dy = yy + Math.sin( r ) * fat;
		b1.dy += Math.cos( ( r2 += r2p ) ) * blurp;
	}
	
	var ribs = this.ribs;
	len = ribs.length - 1;
	b = ribs[0];
	b1 = ribs[6];
	xx = b.dx;
	yy = b.dy;
	xp = ( b1.dx - xx ) / len;
	yp = ( b1.dy - yy ) / len;
	
	r = 0;
	fat = per * 300;
	
	if( state == 1 ){
		r2 = this.rrr;
	}else if( state == 2 ){
		fat = 50;
	}
	
	for( i=1; i<len; ++i ){
		xx += xp;
		yy += yp;
		r += rp;
		b1 = ribs[i];
		b1.dx = xx;
		b1.dy = yy + Math.sin( r ) * -fat;
		b1.dy += Math.cos( ( r2 += r2p ) ) * blurp;
	}
};

Cat.prototype.updateBone = function() {
	
	this.leg1.updateMtx();
	this.leg0.multMtx();
	this.hip.multMtx();
	
	this.arm1.updateMtx();
	this.arm0.multMtx();
	this.neck.multMtx();
	
	this.head.multMtx();
	this.face.toPpos();
	this.face.updateMtx2();
	
	this.earR0.multMtx();
	this.earR1.multMtx();
	this.earL0.multMtx();
	this.earL1.multMtx();
	
	this.tail0.multMtx();
	this.tail1.multMtx();
	this.tail2.multMtx();
	
	this.spine0.multMtx();
	this.spine1.updateMtx();
	this.spine2.updateMtx();
	this.spine3.updateMtx();
	this.spine4.updateMtx();
	this.spine5.updateMtx();
	this.spine6.multMtx();
	
	this.rib0.multMtx();
	this.rib1.updateMtx();
	this.rib2.updateMtx();
	this.rib3.updateMtx();
	this.rib4.updateMtx();
	this.rib5.updateMtx();
	this.rib6.multMtx();
};



function Fish() {};
Fish.prototype = new Mesh();

Fish.prototype.init = function( n ) {
	this.id = n;
	var mat_fish = { color : "#FFF", render : "renderSolid" };

	var verticesrc = [[-116,-70,0],[-22,-5,0],[-56,-96,0],[113,2,0],[10,34,0],[-23,5,0],[-115,68,0],[-45,93,0],[-73,0,0],[9,-34,0],[51,67,0],[47,-68,0],[48,-20,0],[27,6,0],[51,31,0],[72,5,0]];
	var polysrc = [[4,12,3,10,2,1,9,7,6,5,14,13,16,15,14,5,8,11]];
	var matsrc = [{material:mat_fish,vIDs:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]}];

	var scl = 0.7;
	var len = verticesrc.length;
	for( var i=0; i<len; ++i ){
		verticesrc[i][0] *= scl;
		verticesrc[i][1] *= scl;
	}
	
	this.makeBody( verticesrc, polysrc, matsrc );
	
	var vtxs = [];
	for( i=0; i<len; ++i ){
		if( i != 0 && i != 6 && i != 7 && i != 2 && i != 8 ){
			vtxs.push( this.vertices[i] );
		}
	}
	
	this.hasBone = true;
	this.myBone = new Bone();
	this.myBone.setVertices( vtxs, true );
	this.tail = new Bone();
	this.tail.setParent( this.myBone );
	this.tail.setVertices( [ this.vertices[0], this.vertices[6], this.vertices[8], this.vertices[2], this.vertices[7] ], true );
	
	this.renderMinX = this.renderMinY = 0;
	this.renderMaxX = this.renderMaxY = 1;
	this.r = 0;
	this.r2 = 0;
	this.rrr = 0;
	this.rrr2 = 0;
	this.animate = this.myUpdate;
};

Fish.prototype.setTarget = function( b0 ) {
	this.tg = b0;
};

Fish.prototype.myUpdate = function() {
	var ts = timespeed;
	var s = 0.2 * ts;
	var tg = this.tg;
	var b = this.myBone;
	b.oy = b.dy;
	b.dx += ( tg.dx + Math.cos( this.r ) * 100 - 150 - b.dx ) * s;
	
	b.gy = tg.dy + Math.cos( this.r2 ) * 60 - 550 + Math.min( 0.25, Math.max( 0, ( closeper - 0.4 ) )) * 1400;
	b.dy += ( b.gy - b.dy ) * s;
	if( state == 0 ){
		b.scale = 0;
	}else{
		b.scale += ( Math.min( 1, closeper * 2 ) - b.scale ) * s;
	}
	this.r += 0.06 * ts;
	this.r2 += 0.045 * ts;
	b.rz = ( b.dy - b.oy ) * 0.02;
	b.ry = Math.cos( this.rrr2 ) * 0.5;
	this.rrr2 += 0.1 * ts;
	
	this.tail.ry = Math.cos( this.rrr ) * 1.2;
	this.tail.rz = b.rz * 0.5;
	this.tail.scale = b.scale;
	this.rrr += 0.45 * ts;
};

Fish.prototype.finish = function() {
	this.animate = function(){};
	this.render = function(){};
};

Fish.prototype.updateBone = function() {
	this.myBone.updateMtx2();
	this.tail.toPpos2();
	this.tail.updateMtx2();
};



function Sun() {};
Sun.prototype = new Mesh();

Sun.prototype.init = function( n ) {
	this.id = n;
	var mat_tree = { color : "#FB5B26", render : "renderSolid" };

	var verticesrc = [[-443,44,-50],[-414,380,-50],[233,511,-50],[558,-64,-50],[333,-296,-50],[112,-551,-50],[-179,-408,-50],[-173,116,-50],[208,8,-50],[72,-196,-50],[-164,-129,-50],[-489,-277,-50],[57,200,-50],[-203,256,-50],[181,272,-50],[315,-88,-50],[13,-327,-50],[-306,-114,-50],[-95,435,-50],[384,225,-50]];
	var polysrc = [[7,6,11,17,5,4,10,16,20,3,9,15,19,2,13,14,1,12,8,18]];
	var matsrc = [{material:mat_tree,vIDs:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]}];

	var scl = 0.21;
	for( var i in verticesrc ){
		verticesrc[i][0] *= scl;
		verticesrc[i][1] *= scl;
	}

	this.makeBody( verticesrc, polysrc, matsrc );
	
	this.myBone = new Bone();
	this.myBone.setVertices( this.vertices, false );
	this.hasBone = true;
	
	this.renderMinX = this.renderMinY = 0;
	this.renderMaxX = this.renderMaxY = 1;
	this.r = 0;
	this.r2 = 0;
	this.animate = this.myUpdate;
};

Sun.prototype.setTarget = function( b0 ) {
	this.tg = b0;
};

Sun.prototype.myUpdate = function() {
	var ts = timespeed;
	var s = 0.2 * ts;
	var tg = this.tg;
	var b = this.myBone;
	var gscl;
	b.dx += ( tg.dx + Math.cos( this.r ) * 100 - b.dx ) * s;
	this.r += 0.05 * ts;
	
	if( state == 0 ){
		b.scale = 0;
		b.gy = tg.dy - 400;
	}else{
		gscl = Math.min( 1, closeper );
		if(  state == 2 ){
			b.gy = 2000;
			gscl = 1.3;
		}else 
		if( closeper < 0.6 ){
			b.gy = tg.dy - 400;
		}else{
			b.gy = tg.dy + Math.cos( this.r2 ) * 100 + Math.min( 0.1, closeper - 0.6 ) * 6000;
			this.r2 += 0.035 * ts;
		}
		b.scale += ( gscl - b.scale ) * s;
	}
	b.dy += ( b.gy - b.dy ) * s;
	b.rz -= 0.1 * ts;
};

Sun.prototype.updateBone = function() {
	this.myBone.updateMtx();
};


function HeadPhone() {};
HeadPhone.prototype = new Mesh();

HeadPhone.prototype.init = function( n ) {
	this.id = n;
	var mat_w = { color : "#FFF" };
	var mat_b = { color : "#000" };

	var bone_src= [
	 ["cableR0", -1, 5011,500,0], //0
	 ["cable0", -1, 5613,-218,0], //1
	 ["cable1", 1, 5,-451,0], //2
	 ["cable2", 2, 0,-361,0], //3
	 ["cable3", 3, 0,-271,0], //4
	 ["cable4", 4, 0,-402,0], //5
	 ["cableR1", 0, 219,-469,0], //6
	 ["cableL0", -1, 6203,577,0], //7
	 ["cableL1", 7, -185,-540,0]
	];

	var verticesrc = [[5518,-1339,-85],[5794,-1439,-85],[5651,-1835,-85],[5375,-1734,-85],[4999,494,-85],[5197,20,-85],[5580,-268,-85],[5602,-680,-85],[5602,-1045,-85],[5597,-1313,-85],[5627,-1313,-85],[5632,-1045,-85],[5632,-680,-85],[5654,-264,-85],[6051,20,-85],[6219,569,-85],[6196,569,-85],[6017,20,-85],[5235,20,-85],[5019,494,-85],[5593,-214,-85],[5645,-213,-85],[5600,-307,-85],[5636,-305,-85],[5649,-1471,-91],[5630,-1523,-91],[5650,-1521,-91],[5631,-1572,-91],[5617,-1561,-91],[5592,-1626,-91],[5611,-1627,-91],[5591,-1681,-91],[5576,-1670,-91],[5558,-1721,-91],[5617,-1743,-91],[5708,-1492,-91],[5657,-1554,-91],[5618,-1660,-91],[5009,494,-85],[5560,-1356,-85],[5631,-1381,-85],[5648,-1306,-85],[5574,-1285,-85],[5730,-1644,-85],[5428,-1540,-85]];
	var polysrc = [[1,40,43,42,41,2,44,3,4,45],[20,19,21,22,18,17,16,15,14,24,13,12,11,10,9,8,23,7,6,5,39],[36,35,34,33,32,38,31,30,29,28,37,27,26,25]];
	var matsrc = [{material:mat_b,vIDs:[1,2,3,4,5,6,7,8,9,10]},{material:mat_b,vIDs:[11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]},{material:mat_w,vIDs:[32,33,34,35,36,37,38,39,40,41,42,43,44,45]}];
	var weightsrc = [
	 {name:"cable0",vertices:[7,14,21,22,23,24]},
	 {name:"cable1",vertices:[8,13]},
	 {name:"cable2",vertices:[9,12]},
	 {name:"cable3",vertices:[1,2,3,4,10,11,25,26,27,28,29,30,31,32,33,34,35,36,37,38,40,41,42,43,44,45]},
	 {name:"cable4",vertices:[]},
	 {name:"cableL0",vertices:[16,17]},
	 {name:"cableL1",vertices:[15,18]},
	 {name:"cableR0",vertices:[5,20,39]},
	 {name:"cableR1",vertices:[6,19]}
	];

	this.makeBody( verticesrc, polysrc, matsrc );
	this.makeBone( weightsrc, bone_src );
	
	var me = this;
	for ( var i = 0; i < me.bones.length; ++i ) { me[ me.bones[i].name ] = me.bones[i]; }
	this.cables = [ cat.face, this.cable0, this.cable1, this.cable2, this.cable3, this.cable4 ];
	
	this.cable0.setParent2( cat.face );
	this.cableR0.setParent2( cat.face );
	this.cableL0.setParent2( cat.face );
	
	this.animate = this.updateCable;
	
	for ( i = 0; i < me.bones.length; ++i ) { me.bones[i].oy = me.bones[i].dy += 5000; me.bones[i].ox = me.bones[i].dx += 5000; }
};

HeadPhone.prototype.updateCable = function() {
	var ts = timespeed;
	var i, b, b1, r, cos, sin, l, lsa, ddx, ddy;
	var cables = this.cables;
	var len = cables.length;
	
	var f = 0.98;
	var stf = 0.75;
	var windx = windX * 1;
	var windy = windY * 1.5;
	var g = -24 * ts + windy;
	var ymax = worldH + 280 >> 1;
	
	for( i=1; i<len; ++i ){
		b = cables[i-1];
		b1 = cables[ i ];
		if( b1.dy < ymax ){
			b1.dy = ymax;
			b1.vx *= 0.5;
			b1.vy = -b1.vy * 0.3;
		}
		b1.dx += b1.vx + windx;
		b1.dy += b1.vy + g;
		ddx = b1.dx - b.dx;
		ddy = b1.dy - b.dy;
		l = Math.sqrt( ddx * ddx + ddy * ddy );
		
		lsa = stf * ( b1.myL - l );
		r = Math.atan2( ddy, ddx );
		cos = Math.cos( r ) * lsa;
		sin = Math.sin( r ) * lsa;
		if( i > 1 ){
			b.dx -= cos;
			b.dy -= sin;
			b.rz = r + pi05;
		}
		b1.dx += cos;
		b1.dy += sin;
		
		b1.vx = ( b1.dx - b1.ox ) * f;
		b1.vy = ( b1.dy - b1.oy ) * f;
		b1.ox = b1.dx; b1.oy = b1.dy;
	}
	
	this.cableR0.toPpos2();
	this.cableL0.toPpos2();
	
	b = this.cableR0;
	b1 = this.cableR1;
	var b2 = this.cable0;
	ddx = b2.dx - b.dx;
	ddy = b2.dy - b.dy;
	b1.dx = b.dx + ddx * 0.4;
	b1.dy = b.dy + ddy * 0.6;
	b1.rz = Math.atan2( ddy, ddx ) + pi05;
	b = this.cableL0;
	b1 = this.cableL1;
	ddx = b2.dx - b.dx;
	ddy = b2.dy - b.dy;
	b1.dx = b.dx + ddx * 0.4;
	b1.dy = b.dy + ddy * 0.6;
	b1.rz = Math.atan2( ddy, ddx ) + pi05;
};

HeadPhone.prototype.updateBone = function() {
	var arr = this.bones;
	for( var i in arr ){ arr[i].updateMtx(); }
};


function TxtData( id, per ) {
	this.isShow = true;
	this.vy = id * 15;
	this.per = per;
	this.rsa = 0;
	this.r = id * 0.3;
	this.rrr = id * -0.15;
	this.scaleG = 1;
	this.scale = 0;
	this.dx = this.dz = 0;
	this.dy = -1000;
	this.dycc = 0;
};

function TextField() {};
TextField.prototype = new Mesh();

TextField.prototype.init = function( n ) {
	this.id = n;
	this.floorY = -1000;
	var mat_b = { color : "#000", render : "renderSolid" };
	
	var verticesrc = [[106,98,0],[114,142,0],[-71,-30,0],[106,-96,0],[114,-141,0],[-61,125,0],[-32,85,0],[-33,-84,0],[-117,-48,0],[-63,-126,0],[-117,47,0],[-71,31,0],[73,78,0],[73,51,0],[14,51,0],[14,-94,0],[-15,-94,0],[-15,51,0],[-73,51,0],[-73,78,0],[-90,-94,0],[0,95,0],[90,-94,0],[41,-54,0],[-38,-53,0],[-58,-94,0],[60,-94,0],[0,34,0],[29,-30,0],[-29,-30,0],[57,22,0],[57,-5,0],[69,86,0],[69,59,0],[-26,59,0],[-26,-94,0],[-56,-94,0],[-56,86,0],[-26,-5,0],[-26,22,0]];
	var polysrc = [[5,10,9,11,6,2,1,7,12,3,8,4],[13,14,15,16,17,18,19,20],[22,23,27,24,29,28,30,29,24,25,26,21],[38,33,34,35,40,31,32,39,36,37]];
	var matsrc = [{material:mat_b,vIDs:[1,2,3,4,5,6,7,8,9,10,11,12]},{material:mat_b,vIDs:[13,14,15,16,17,18,19,20]},{material:mat_b,vIDs:[21,22,23,24,25,26,27,28,29,30,31,32]},{material:mat_b,vIDs:[33,34,35,36,37,38,39,40,41,42]}];

	var scl = 0.6;
	for( var i in verticesrc ){
		verticesrc[i][0] *= scl;
		verticesrc[i][1] *= scl;
	}

	this.makeBody( verticesrc, polysrc, matsrc );
	
	this.pC = this.polygons[0];
	this.pA = this.polygons[2];
	this.pT = this.polygons[1];
	this.pF = this.polygons[3];
	
	this.hasBone = true;
	this.bC = new Bone();
	this.bA = new Bone();
	this.bT = new Bone();
	this.bF = new Bone();
	this.bC.setVertices( this.pC.vertices, false );
	this.bA.setVertices( this.pA.vertices, false );
	this.bT.setVertices( this.pT.vertices, false );
	this.bF.setVertices( this.pF.vertices, false );
	
	this.bC.dy = this.bA.dy = this.bT.dy = this.floorY;
	this.bF.dy = this.floorY + 800;
	
	this.bC.dz = this.bA.dz = this.bT.dz = this.bF.dz = -7000;
	
	this.bF.rz = -3;
	
	this.renderMinX = this.renderMinY = 0;
	this.renderMaxX = this.renderMaxY = 1;
	this.isFat = false;
	
	this.anum = -1;
	this.txts = [];
	var len = 10;
	var per = 0;
	var spc = ( 1 - per ) / ( len-1 );
	for( var i=0; i<len; ++i ){
		var v = new TxtData( i, per );
		per += spc;
		this.txts[i] = v;
	}
	this.render = this.render0;
};

TextField.prototype.update = function() {};

TextField.prototype.clearCanvas = function( tg ) {
	var m =this;
	tg.fillRect( m.renderMinX, m.renderMinY, m.renderMaxX - m.renderMinX,  m.renderMaxY - m.renderMinY );
};

TextField.prototype.setTitle = function() {
	if( state != 2 ){
		var len = Math.max( 1, Math.min( this.txts.length, ( worldX - 3200 ) * 0.0027 >> 0 ));
		if( !this.isFat && len == 1 ){ this.isFat = true; }
		if( len != this.anum ){
			this.anum = len;
			var str = this.isFat ? "F" : "C";
			while( len-- ){str += "a";}
			document.title = str + "t";
		}
	}
};

TextField.prototype.render0 = function() {
	var ts = timespeed;
	var txts = this.txts;
	var len = txts.length;
	var b, t, v, gr, p;
	var b0, b1;
	var bC = this.bC;
	var bA = this.bA;
	var bT = this.bT;
	var pC = this.pC;
	var pA = this.pA;
	var pT = this.pT;
	var vtxs, len2;
	
	var rs = 0.1 * ts;
	var s1 = 0.07;
	var s2 = 0.88;
	var showLimit = Math.min( len, this.anum );
	var ss = 0.2 * ts;
	var ss2 = 0.2 * ts;
	var xp = 125;
	var xx = -( showLimit + 1 ) * xp >> 1;
	var minX, maxX, minY, maxY;
	var offset = 4;
	var g = -20 * ts;
	var floorY = this.floorY;
	minX = minY = 9999;
	maxX = maxY = 0;
	
	//C
	if( this.isFat ){
		b = this.bF;
		p = this.pF;
		b.dx += ( xx + 4 - b.dx ) * ss;
		b.scale = 1;
		b.dy += b.vy;
		if( b.dy < floorY ){
			b.dy = floorY;
			if( ++b.cc < 4 ){
				b.vy = -b.vy * 0.7;
			}
		}
		b.rz += b.rsa = ( 0 - b.rz ) * s1 + b.rsa * s2;
		b.vy += g;
	}else{
		b = this.bC;
		p = this.pC;
		b.dx += ( xx - 6 - b.dx ) * ss;
		b.scale = 0.68;
	}
	
	b.updateMtx();
	vtxs = b.vertices;
	len2 = vtxs.length;
	for ( n = 0; n < len2; ++n ) {
		v = vtxs[n];
		v.tBone();
		v.update();
		if( v.sx < minX ){minX = v.sx;}
		if( v.sy < minY ){minY = v.sy;}
		else if( v.sy > maxY ){maxY = v.sy;}
	}
	p.render( ctx );
	if( isDebugMode ){
		ctx.strokeStyle = "#E680AC";
		ctx.stroke();
	}
	
	vtxs = pA.vertices;
	len2 = vtxs.length;
	
	for ( i = 0; i < len; ++i ) {
		t = txts[i];
		if( i < showLimit ){
			t.rrr += rs;
			gr = 0;
			t.scale += ( t.scaleG - t.scale ) * ss;
			xx += xp;
			if( !t.isShow ){
				t.vy = 40;
				t.dy = floorY + 150;
				t.r = pi;
				t.scale = 0.7;
				t.dycc = 0;
				t.isShow = true;
			}
		}else{
			gr = -pi;
			t.scale += ( 0 - t.scale ) * ss2;
			if( t.isShow ){
				t.vy = 90;
				t.isShow = false;
			}
		}
		
		t.dy += t.vy;
		if( t.dy < floorY ){
			t.dy = floorY;
			if( ++t.dycc < 3 ){
				t.vy = -t.vy * 0.4;
			}
		}
		t.r += t.rsa = ( gr - t.r ) * s1 + t.rsa * s2;
		t.vy += g;
		
		t.dx += ( xx - t.dx ) * ss;
		
		bA.dx = t.dx;
		bA.dy = t.dy;
		bA.rz = t.r;
		bA.scale = t.scale;
		bA.updateMtx();
		
		if( t.scale > 0.1 ){
			for ( n = 0; n < len2; ++n ) {
				v = vtxs[n];
				v.tBone();
				v.update();
				if( v.sx < minX ){minX = v.sx;}
				else if( v.sx > maxX ){	maxX = v.sx;}
				if( v.sy < minY ){minY = v.sy;}
				else if( v.sy > maxY ){maxY = v.sy;}
			}
			pA.render( ctx );
			
			if( isDebugMode ){
				ctx.strokeStyle = "#E680AC";
				ctx.stroke();
			}
		}
	}
	
	//T
	xx += xp;
	bT.dx += ( xx - 15 - bT.dx ) * ss;
	bT.scale = 1;
	bT.updateMtx();
	vtxs = bT.vertices;
	len2 = vtxs.length;
	for ( n = 0; n < len2; ++n ) {
		v = vtxs[n];
		v.tBone();
		v.update();
		if( v.sx > maxX ){	maxX = v.sx;}
		if( v.sy < minY ){minY = v.sy;}
		else if( v.sy > maxY ){maxY = v.sy;}
	}
	pT.render( ctx );
	if( isDebugMode ){
		ctx.strokeStyle = "#E680AC";
		ctx.stroke();
	}
	
	this.renderMinX = minX - offset >> 0;
	this.renderMaxX = maxX + offset >> 0;
	this.renderMinY = minY - offset >> 0;
	this.renderMaxY = maxY + offset >> 0;
};


function TreeData( id, a, b, c, isL ) {
	this.b0 = a;
	this.b1 = b;
	this.per = c;
	this.isShow = false;
	this.rsa = 0;
	this.rg = isL ? -pi : pi;
	this.r = this.rg;
	this.rrr = id * -0.15;
	this.scaleG = ( id % 3 ) * 0.125 + 0.7;
	this.scale = 0;
	this.gx = c * 3000 - 1500 + Math.random() * 1000 - 500;
	this.gz = ( id % 4 ) * -2500 + Math.random() * -1500 - 200;
	this.dx = this.dy = this.dz = 0;
	this.dycc = 0;
	this.renderMinX = 1;
	this.renderMaxX = 0;
	this.renderMinY = 1;
	this.renderMaxY = 0;
};

function Tree() {};
Tree.prototype = new Mesh();

Tree.prototype.init = function( n ) {
	this.id = n;
	var mat_tree = { color : "#000", render : "renderSolid" };

	var verticesrc = [[-20,-21,0],[-11,178,0],[-102,295,0],[106,300,0],[11,178,0],[18,-21,0],[-0,299,0],[-36,276,0],[43,273,0]];
	var polysrc = [[7,9,4,5,6,1,2,3,8]];
	var matsrc = [{material:mat_tree,vIDs:[1,2,3,4,5,6,7,8,9]}];

	this.makeBody( verticesrc, polysrc, matsrc );
	
	var vtxs = this.vertices;
	this.myBone = new Bone();
	this.neck = new Bone();
	this.neck.by = 180;
	this.neck.setParent( this.myBone );
	this.myBone.setVertices( [vtxs[0], vtxs[1], vtxs[4], vtxs[5]], false );
	this.neck.setVertices( [vtxs[1], vtxs[2], vtxs[3], vtxs[4], vtxs[6], vtxs[7], vtxs[8]], false );
	this.hasBone = true;
	
	this.renderMinX = this.renderMinY = 0;
	this.renderMaxX = this.renderMaxY = 1;
};

Tree.prototype.createTrees = function( b0, b1, b2 ) {
	this.trees = [];
	var len = 10;
	var per = 0.03;
	var spc = ( 0.9 - per ) / ( len-1 );
	var v;
	
	for( var i=0; i<len; ++i ){
		if( i % 2 == 0 ){
			v = new TreeData( i, b1, b0, per + Math.random() * 0.1, true );
		}else{
			v = new TreeData( i, b1, b2, per + Math.random() * 0.1, false );
		}
		per += spc;
		this.trees[i] = v;
	}
	this.render = this.render0;
};

Tree.prototype.update = function() {
};

Tree.prototype.finish = function() {
	var trees = this.trees;
	var len = trees.length;
	for ( var i = 0; i < len; ++i ) {
		t = trees[i];
		t.vy = Math.random() * 300 + 100;
		t.r += Math.random() * 12 - 6;
	}
	this.render = this.render1;
};

Tree.prototype.clearCanvas = function( tg ) {
	var trees = this.trees;
	var len = trees.length;
	for ( var i = 0; i < len; ++i ) {
		var m = trees[i];
		tg.fillRect( m.renderMinX, m.renderMinY, m.renderMaxX - m.renderMinX,  m.renderMaxY - m.renderMinY );
	}
};

Tree.prototype.render0 = function() {
	var ts = timespeed;
	var trees = this.trees;
	var vtxs = this.vertices;
	var len = trees.length;
	var len2 = vtxs.length;
	var t, v, gr;
	var b0, b1;
	var myb = this.myBone;
	var neck = this.neck;
	var p = this.polygons[0];
	var rs = 0.1 * ts;
	var s1 = 0.06;
	var s2 = 0.85;
	var showLimit;
	var ss = 0.2 * ts;
	var ss2 = 0.2 * ts;
	var minX, maxX, minY, maxY;
	var offset = 4;
	
	if( state == 0 || state == 2 ){
		showLimit = 0;
	}else{
		showLimit = Math.max( 0, closeper - 0.18 ) * 2 * len >> 0;
	}
	
	for ( i = 0; i < len; ++i ) {
		t = trees[i];
		if( i < showLimit ){
			t.rrr += rs;
			gr = Math.cos( t.rrr ) * 0.24;
			t.scale += ( t.scaleG - t.scale ) * ss;
		}else{
			gr = t.rg;
			t.scale += ( 0 - t.scale ) * ss2;
		}
		t.r += t.rsa = ( gr - t.r ) * s1 + t.rsa * s2;
		
		t.dx = ( t.b1.dx - t.b0.dx ) * t.per + t.b0.dx;
		t.dy = ( t.b1.dy - t.b0.dy ) * t.per + t.b0.dy;
		
		myb.dx = t.dx;
		myb.dy = t.dy;
		myb.rz = t.r;
		myb.scale = t.scale;
		myb.updateMtx();
		neck.rz = myb.rz * 1.25;
		neck.multMtx();
		minX = minY = 9999;
		maxX = maxY = 0;
		
		for ( n = 0; n < len2; ++n ) {
			v = vtxs[n];
			v.tBone();
			v.update();
			if( v.sx < minX ){
				minX = v.sx;
			}else if( v.sx > maxX ){
				maxX = v.sx;
			}
			if( v.sy < minY ){
				minY = v.sy;
			}else if( v.sy > maxY ){
				maxY = v.sy;
			}
		}
		p.render( ctx );
		t.renderMinX = minX - offset >> 0;
		t.renderMaxX = maxX + offset >> 0;
		t.renderMinY = minY - offset >> 0;
		t.renderMaxY = maxY + offset >> 0;
		
		if( isDebugMode ){
			ctx.strokeStyle = "#E680AC";
			ctx.stroke();
		}
	}
};

Tree.prototype.render1 = function() {
	var ts = timespeed;
	var s = 0.1 * ts;
	var trees = this.trees;
	var vtxs = this.vertices;
	var len = trees.length;
	var len2 = vtxs.length;
	var t, v, gr;
	var b0, b1;
	var myb = this.myBone;
	var neck = this.neck;
	var p = this.polygons[0];
	var rs = 0.08 * ts;
	var s1 = 0.1;
	var s2 = 0.9;
	var ss = 0.2 * ts;
	var ss2 = 0.2 * ts;
	var g = -15 * ts;
	var minX, maxX, minY, maxY;
	var offset = 8;
	
	for ( i = 0; i < len; ++i ) {
		t = trees[i];
		t.rrr += rs;
		gr = Math.cos( t.rrr ) * 0.3;
		t.scale += ( 0.8 - t.scale ) * ss;
		
		t.dx += ( t.gx - t.dx ) * s;
		t.dy += t.vy;
		if( t.dy < -1000 ){
			t.dy = -1000;
			if( ++t.dycc < 3 ){
				t.vy = -t.vy * 0.4;
			}
		}
		t.r += t.rsa = ( gr - t.r ) * s1 + t.rsa * s2;
		t.vy += g;
		t.dz += ( t.gz - t.dz ) * s;
		
		myb.dx = t.dx;
		myb.dy = t.dy;
		myb.dz = t.dz;
		
		myb.rz = t.r;
		myb.scale = t.scale;
		myb.updateMtx();
		neck.rz = myb.rz * 1.25;
		neck.multMtx();
		minX = minY = 9999;
		maxX = maxY = 0;
		
		for ( n = 0; n < len2; ++n ) {
			v = vtxs[n];
			v.tBone();
			v.update();
			if( v.sx < minX ){
				minX = v.sx;
			}else if( v.sx > maxX ){
				maxX = v.sx;
			}
			if( v.sy < minY ){
				minY = v.sy;
			}else if( v.sy > maxY ){
				maxY = v.sy;
			}
		}
		p.render( ctx );
		t.renderMinX = minX - offset >> 0;
		t.renderMaxX = maxX + offset >> 0;
		t.renderMinY = minY - offset >> 0;
		t.renderMaxY = maxY + offset >> 0;
		
		if( isDebugMode ){
			ctx.strokeStyle = "#E680AC";
			ctx.stroke();
		}
	}
};


function Camera() {
	this.x = 0; this.y = 0; this.z = 0;
	this.l = 100;
	this.fov = 30;
	this.fovR = this.fov * Math.PI / 360;
	this.wscale = 1;
	
	this.rz = 0;
	this.grz = 0;
	
	this.tgx = 0; this.tgy = 0; this.tgz = 0;
	this.gx = 0; this.gy = 0; this.gz = 0;
	
	this.zScale = this.myL = 14000;
	this.myLg = this.myL;
	this.myLgR = 0;
	this.xr = this.yr = this.zr = 0;
	this.rzr = 0;
	this.windowAngle = 0;
	this.orientation = 0;
	this.update = this.update1;
	this.update();
};

Camera.prototype.update1 = function() {
	var ts = timespeed;
	
	this.myLg = this.zScale;
	this.gy = isPC ? -300 : -300;
	this.grz = 0;
	
	var s = 0.6 * ts;
	this.myL += ( this.myLg - this.myL ) * s;
	this.tgy += ( this.gy - this.tgy ) * s;
	this.rz += ( this.grz - this.rz ) * s;
	
	var sinZ = Math.sin( -this.rz );
	var cosZ = Math.cos( -this.rz );
	this.y = this.tgy;
	this.x = this.tgx;
	this.z = this.tgz - this.myL;
	this.revx = -this.x; this.revy = -this.y; this.revz = -this.z;
	this.m0 = cosZ;
	this.m1 = sinZ;
	this.m4 = sinZ;
	this.m5 = -cosZ;
};

Camera.prototype.finish = function() {
	this.rrr = Math.random() * pi2;
	this.rrr2 = Math.random() * pi2;
	this.rrr3 = Math.random() * pi2;
	this.rrr4 = pi;
	this.ls = 0;
	this.update = this.update2;
};

Camera.prototype.update2 = function() {
	var ts = timespeed;
	this.rrr += 0.02 * ts;
	this.rrr2 += 0.016 * ts;
	this.rrr3 += 0.012 * ts;
	this.rrr4 += 0.01 * ts;
	
	this.myLg = Math.cos( this.rrr4 ) * 1000 + this.zScale - 2500;
	this.gx = Math.cos( this.rrr ) * 200;
	this.gy = Math.cos( this.rrr2 ) * 230 + ( isPC ? -300 : -300 );
	if( this.ls < 0.3 ) this.ls += 0.001 * ts;
	this.myL += ( this.myLg - this.myL ) * this.ls * ts;
	var s = this.ls;
	this.tgx += ( this.gx - this.tgx ) * s;
	this.tgy += ( this.gy - this.tgy ) * s;
	this.rz += ( this.grz - this.rz ) * s;
	
	var sinZ = Math.sin( -this.rz );
	var cosZ = Math.cos( -this.rz );
	this.y = this.tgy;
	this.x = this.tgx;
	this.z = this.tgz - this.myL;
	this.revx = -this.x; this.revy = -this.y; this.revz = -this.z;
	this.m0 = cosZ;
	this.m1 = sinZ;
	this.m4 = sinZ;
	this.m5 = -cosZ;
};

Camera.prototype.stageResize = function( pc ) {
	this.wscale = pc ? 1700 : ( isIPAD ? 1500 : 720 );
	this.wscale *= deviceScale;
	this.zz = this.zScale / this.wscale;
	this.zz2 = 13000 / this.wscale;
	this.zz_r = this.wscale / this.zScale;
};

function Logo() {}

Logo.prototype.init = function( w, h ) {
	var zindex = 10;
	var el, els, body = document.body;
	var me = this;
	
	el = this.aboutbtn = document.createElement("a");
	els = el.style;
	body.appendChild( el );
	el.href = "http://roxik.com/";
	el.innerHTML = "about me";
	els.position = "absolute";
	els.fontSize = isPC ? "11px" : "11px";
	els.zIndex = ++zindex;
	els.textDecoration = "none";
	els.whiteSpace = "nowrap";
	els.padding = "4px";
	el.normalColor = "#F9A";
	el.overColor = "#FFF";
	setBtnEvent( el );
	el.addEventListener( ( isMouse ? "mousedown" : "touchstart" ), function(){ this.style.color = "#FFF";}, false );
	el.addEventListener( ( isMouse ? "mouseup" : "touchend" ), function() { this.style.color = "#F9A"; } , false );
	
	el = this.subtxt = document.createElement("div");
	els = el.style;
	el.innerHTML = "change view";
	body.appendChild( el );
	els.position = "absolute";
	els.color = "#F9A";
	els.fontSize = isPC ? "11px" : "11px";
	els.zIndex = ++zindex;
	els.padding = "4px";
	els.whiteSpace = "nowrap";
	el.style.cursor = "pointer";
	el.addEventListener( "mouseover", function() { this.style.color = "#FFF"; } , false );
	el.addEventListener( "mouseout", function() { this.style.color = "#F9A"; } , false );
	el.addEventListener( ( isMouse ? "mousedown" : "touchstart" ), function(){ 
		this.style.color = "#F9A";
		isDebugMode = !isDebugMode;
	}, false );
	el.addEventListener( ( isMouse ? "mouseup" : "touchend" ), function() { this.style.color = "#F9A"; } , false );
	
	this.aboutbtn.style.top = 16 + "px";
	this.subtxt.style.top = 42 + "px";
	this.aboutbtn.style.left = this.subtxt.style.left = "12px";
	
	this.anum = -1;
	this.show( false );
}

Logo.prototype.show = function( isShow ) {
	this.aboutbtn.style.display = 
	this.subtxt.style.display = isShow ? "block" : "none";
};



// Zzz...
})();
