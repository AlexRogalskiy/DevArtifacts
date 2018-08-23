var button = document.querySelector('.button'),
    background = document.querySelector('.backgroundHover'),
    firstWord = document.querySelectorAll('.button span'),
    secondWord = document.querySelectorAll('.button i');

// Timeline
var tl = new TimelineMax({paused: true});
tl.staggerTo(firstWord, 1, {color: "rgb(55,178,230)", rotationX: 360, ease: Expo.easeOut}, 0.03, "#start");
tl.staggerTo(secondWord, 1, {color: "rgb(55,178,230)", rotationX: 360, ease: Expo.easeOut}, 0.03, "#start");
tl.to(button, 0.3, {"border-color": "rgb(255,255,255,0)", ease: Quad.easeOut}, "#start");
tl.from(background, 0.25, {scaleX: "0%", transformOrigin: "left center", ease: Quad.easeInOut}, "#start");

// HOVER
button.addEventListener("mouseenter", function(){
  tl.play();
});

button.addEventListener("mouseleave", function(){
  tl.reverse();
});