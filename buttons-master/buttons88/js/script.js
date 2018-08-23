var button = document.querySelector('.button'),
    lineTop = document.getElementById('line-top'),
    lineBottom = document.getElementById('line-bottom');

// Timeline
var tl = new TimelineMax({paused: true});
tl.to(lineTop, 0.4, {strokeDasharray: "415.5, 275", ease: Quad.easeInOut}, "#draw");
tl.to(lineBottom, 0.4, {strokeDasharray: "275.5, 0", ease: Quad.easeInOut}, "#draw");

// HOVER
button.addEventListener("mouseenter", function(){
  tl.play();
});

button.addEventListener("mouseleave", function(){
  tl.reverse();
});