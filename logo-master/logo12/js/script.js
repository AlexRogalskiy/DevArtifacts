// Strong.easeIn
// Quint.easeIn
// Sine.easeOut

// ////////////////////////////////
// Timelines
// ////////////////////////////////
var tl = new TimelineMax({
    paused: true,
    repeat: -1
});
var boltsTL = new TimelineMax({ paused: true });

var playBolts = function() {
    boltsTL.restart();
};

// ////////////////////////////////
// Bolts Timeline
// ////////////////////////////////
boltsTL.to($('.bolts > *:nth-child(1)'), 0.15, {
    delay: 0.5,
	opacity: 1,
    x: '-=10px',
    y: '-=10px',
    ease: 'Strong.easeIn'
});

boltsTL.to($('.bolts > *:nth-child(2)'), 0.15, {
	opacity: 1,
    x: '+=10px',
    y: '-=10px',
    ease: 'Strong.easeIn'
}, '-=0.15');

boltsTL.to($('.bolts > *:nth-child(3)'), 0.15, {
	opacity: 1,
    x: '+=10px',
    y: '+=10px',
    ease: 'Strong.easeIn'
}, '-=0.15');

boltsTL.to($('.bolts > *:nth-child(4)'), 0.15, {
	opacity: 1,
    x: '-=10px',
    y: '+=10px',
    ease: 'Strong.easeIn'
}, '-=0.15');

boltsTL.to($('.bolts'), 0.25, {
	opacity: 0,
    ease: 'Strong.easeIn'
});

// ////////////////////////////////
// Box 01
// ////////////////////////////////
tl.to($('.shape-01'), 1, {
    rotationY: '+=370deg',
    ease: 'Quint.easeOut'
});

tl.to($('.shape-01'), 1, {
    top: '25px',
    ease: 'Quint.easeOut'
}, '-=1');

tl.fromTo($('.swirl path'), 0.5, {
    drawSVG: '0%',
    opacity: 0
}, {
    drawSVG: '100%',
    opacity: 1,
    ease: 'Quint.easeOut',
    onComplete: playBolts
}, '-=1');

tl.to($('.swirl path'), 0.25, {
    drawSVG: '50% 50%',
    ease: 'Quint.easeIn'
});

tl.to($('.shape-01'), 0.5, {
    top: '300px',
    ease: 'Quint.easeIn'
});

// ////////////////////////////////
// Box 02
// ////////////////////////////////
tl.to($('.shape-01'), 1, {
    rotationY: '-=370deg',
    ease: 'Quint.easeOut'
});

tl.to($('.shape-01'), 1, {
    top: '25px',
    ease: 'Quint.easeOut'
}, '-=1');

tl.fromTo($('.swirl02 path'), 0.5, {
    drawSVG: '0%',
    opacity: 0
}, {
    drawSVG: '100%',
    opacity: 1,
    ease: 'Quint.easeOut',
    onComplete: playBolts
}, '-=1');

tl.to($('.swirl02 path'), 0.25, {
    drawSVG: '50% 50%',
    ease: 'Quint.easeIn',
});

tl.to($('.shape-01'), 0.5, {
    top: '300px',
    ease: 'Quint.easeIn'
});

// ////////////////////////////////
// Box 03
// ////////////////////////////////
tl.to($('.shape-01'), 1, {
    rotationX: '-=370deg',
    ease: 'Quint.easeOut'
});

tl.to($('.shape-01'), 1, {
    top: '25px',
    ease: 'Quint.easeOut'
}, '-=1');

tl.fromTo($('.swirl03 path'), 0.5, {
    drawSVG: '0%',
    opacity: 0
}, {
    drawSVG: '100%',
    opacity: 1,
    ease: 'Quint.easeOut',
    onComplete: playBolts
}, '-=1');

tl.to($('.swirl03 path'), 0.25, {
    drawSVG: '50% 50%',
    ease: 'Quint.easeIn'
});

tl.to($('.shape-01'), 0.5, {
    top: '300px',
    ease: 'Quint.easeIn'
});

// ////////////////////////////////
// App
// ////////////////////////////////
// tl.add(boltsTL, 1);
tl.timeScale(1.2);
tl.play();
console.log(tl.endTime());



















