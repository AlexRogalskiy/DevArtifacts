// Selected elements
var background			= document.querySelector('#background');
var device				= document.querySelector('#device');
var background_editor	= document.querySelector('#background_editor');
var background_canvas	= document.querySelector('#background_canvas');
var toolbar_main		= document.querySelector('#toolbar_main');
var toolbar_canvas		= document.querySelector('#toolbar_canvas');
var button_add			= document.querySelector('#button_add');
var easing				= Back.easeOut;
var delay				= "0.5";
var transitionduration	= "0.5";

// Animation
var editoranimation = new TimelineMax({ repeat: -1});
editoranimation.timeScale(1)

// Frame 1
.to(device, transitionduration, {
	delay: delay,
	attr: {
		x:70,
		y:20,
		width:460,
		height:360,
		rx:20,
	},
	ease: easing
}, "frame1")

.to(background_editor, transitionduration, {
	delay: delay,
	attr: {
		x:110,
		y:50,
		width:380,
		height:300
	},
	ease: easing
}, "frame1")

.to(background_canvas, transitionduration, {
	delay: delay,
	attr: {
		x:204,
		y:90,
		width:260,
		height:260
	},
	ease: easing
}, "frame1")

.to(toolbar_main, transitionduration, {
	delay: delay,
	attr: {
		x:110,
		y:50,
		width:380,
		height:40
	},
	ease: easing
}, "frame1")

.to(toolbar_canvas, transitionduration, {
	delay: delay,
	attr: {
		x:204,
		y:60,
		width:260,
		height:30
	},
	ease: easing
}, "frame1")

.to(button_add, transitionduration, {
	delay: delay,
	attr: {
		cx:464,
		cy:325,
		r:20
	},
	ease: easing
}, "frame1")


// Frame 2
.to(device, transitionduration, {
	delay: delay,
	attr: {
		x:170,
		y:20,
		width:260,
		height:360,
		rx:20,
	},
	ease: easing
}, "frame2")

.to(background_editor, transitionduration, {
	delay: delay,
	attr: {
		x:200,
		y:50,
		width:200,
		height:300
	},
	ease: easing
}, "frame2")

.to(background_canvas, transitionduration, {
	delay: delay,
	attr: {
		x:200,
		y:95,
		width:200,
		height:255
	},
	ease: easing
}, "frame2")

.to(toolbar_main, transitionduration, {
	delay: delay,
	attr: {
		x:200,
		y:50,
		width:200,
		height:30
	},
	ease: easing
}, "frame2")

.to(toolbar_canvas, transitionduration, {
	delay: delay,
	attr: {
		x:200,
		y:75,
		width:200,
		height:20
	},
	ease: easing
}, "frame2")

.to(button_add, transitionduration, {
	delay: delay,
	attr: {
		cx:374,
		cy:325,
		r:20
	},
	ease: easing
}, "frame2")


// Frame 3
.to(device, transitionduration, {
	delay: delay,
	attr: {
		x:225,
		y:60,
		width:150,
		height:280,
		rx:20,
	},
	ease: easing
}, "frame3")

.to(background_editor, transitionduration, {
	delay: delay,
	attr: {
		x:235,
		y:90,
		width:130,
		height:220
	},
	ease: easing
}, "frame3")

.to(background_canvas, transitionduration, {
	delay: delay,
	attr: {
		x:235,
		y:125,
		width:130,
		height:185
	},
	ease: easing
}, "frame3")

.to(toolbar_main, transitionduration, {
	delay: delay,
	attr: {
		x:235,
		y:90,
		width:130,
		height:25
	},
	ease: easing
}, "frame3")

.to(toolbar_canvas, transitionduration, {
	delay: delay,
	attr: {
		x:235,
		y:110,
		width:130,
		height:15
	},
	ease: easing
}, "frame3")

.to(button_add, transitionduration, {
	delay: delay,
	attr: {
		cx:344,
		cy:290,
		r:15
	},
	ease: easing
}, "frame3")


// Frame 4 (restart)
.to(device, transitionduration, {
	delay: delay,
	attr: {
		x:0,
		y:0,
		width:600,
		height:400,
		rx:20,
	},
	ease: easing
}, "frame4")

.to(background_editor, transitionduration, {
	delay: delay,
	attr: {
		x:30,
		y:30,
		width:540,
		height:340
	},
	ease: easing
}, "frame4")

.to(background_canvas, transitionduration, {
	delay: delay,
	attr: {
		x:145,
		y:70,
		width:400,
		height:300
	},
	ease: easing
}, "frame4")

.to(toolbar_main, transitionduration, {
	delay: delay,
	attr: {
		x:30,
		y:30,
		width:540,
		height:40
	},
	ease: easing
}, "frame4")

.to(toolbar_canvas, transitionduration, {
	delay: delay,
	attr: {
		x:145,
		y:40,
		width:400,
		height:30
	},
	ease: easing
}, "frame4")

.to(button_add, transitionduration, {
	delay: delay,
	attr: {
		cx:545,
		cy:345,
		r:20
	},
	ease: easing
}, "frame4");
