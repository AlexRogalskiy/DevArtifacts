"use strict";
console.clear();
var debug = 0;

var button = $("#button"),
    bg = $("#bg"),
    clip = $("#clip circle"),
    modal = $("#modal"),
    imageWrap = $("#image-wrap"),
    repeat = $("#repeat"),
    thumb = $("#thumb"),
    numConfetti = 17,
    confettiOuter,
    confettiInner,
    isGridView = !!window.location.pathname.match(/fullcpgrid/),
    tl = new TimelineLite({paused:true});

function createConfetti(opts) {
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  svg.setAttribute("viewBox", "0 0 50 50");
  use.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", "#" + opts.shape);
  use = $(use);
  svg = $(svg);
  use.css("transform", "translateX(" + opts.offset + ")")
  svg.append(use)
     .addClass("confetti")
     .css({
        fill: opts.color,
        width: opts.size + "px",
        transform: "translate(-50%, -50%) rotate(" + opts.rotation + "deg)"
      });
  return svg;
}

function buildConfettiElements() {
  var shapes = ["star", "circle", "cross", "triangle"];
  var colors = ["#BEE86D", "#B3A6E2", "#EAB1B0"];
  var confettiAngle = 360 / numConfetti
  for (var i=0; i<numConfetti; i++) {
    var confetti = createConfetti({
      shape: shapes[randBetween(0, 3)],
      color: colors[randBetween(0, 2)],
      size: 20,
      rotation: i * (confettiAngle),
      offset: i%2==0 ? 0 : "-65px"
    });
    imageWrap.append(confetti);
  }
}

function randBetween(min, max) {
  return Math.floor(Math.random()*(max-min+1)+min);  
}

buildConfettiElements();
confettiOuter = $(".confetti");
confettiInner = confettiOuter.find("use");

tl.to(button, .12, {
  scale: 0,
  onComplete: function(){
    button.addClass("loading");
  }
});

tl.to(button, 1.25, {
  scale: 1,
  force3D: true,
  ease: Elastic.easeOut
});

tl.to(button, 1.95, {
  rotation: 1930,
  ease: Linear.easeNone
}, "-=1.25");

tl.to(button, .2, {
  scale: 0,
  onComplete: function(){
    modal.addClass("active");
    button.addClass("hidden");
    var unit = window.innerWidth > window.innerHeight ? "vw" : "vh";
    var size = 150 + unit;
    bg.width(size);
    bg.height(size);
  }
}, "-=.1");

tl.set(bg, {
  x: "-50%",
  y: "-50%",
  scale: 0,
  display: "block",
  force3D: false
});

tl.addLabel("debug");
tl.to(bg, .4, {
  x: "-50%",
  y: "-50%",
  scale: (isGridView ? 1.2 : 1),
  onComplete: function(){
    bg.removeAttr("style");
    bg.addClass("active");
  }
});

tl.to(modal, 1, {
  opacity: 1
}, "-=.25");

tl.to(modal, .75, {
  y: 0,
  ease: Elastic.easeOut,
}, "-=1");

tl.to(thumb, 1, {
  scale: 1,
  y: 0,
  ease: Elastic.easeOut
}, "-=1");

tl.to(confettiInner, .85, {
  x: "+=550",
  ease: Power4.easeOut
}, "-=1.05");

tl.to(confettiOuter, .45, {
  y: 10,
}, "-=.65");

tl.to(confettiInner, .45, {
  scale:0
}, "-=.6");

tl.to(repeat, 1, {
  scale: 1,
  clearProps: "all",
  ease: Elastic.easeOut,
  onComplete: function(){
    repeat.addClass("active");
  }
}, "-=.3");


if (debug) {
  (function (){
    tl.seek("debug", false);
    tl.play();
  })();
}
 
button.click(function(){
  tl.resume();
});

repeat.click(function(){
  tl.restart(false, false).pause();
  $(".active").removeClass("active");
  button.removeClass("loading hidden");
  bg.removeAttr("style");
});

if (isGridView) {
  setTimeout(function(){
    button.click();
  }, 500);
  $("html").addClass("gridView");
}