// Dino Challenge for Cascading Coders
// I'm the Baby! :p https://www.youtube.com/watch?v=5T8mGIflUaU

TweenMax.fromTo( // this uses .fromTo method
       ".head", // target element
       1.2, // speed/duration
       {
         y:8 // beginning of animation - setting y position
       }, 
       { 
         ease: Elastic.easeIn.config(1, 0.1), // GSAP easing configuration
         y: 0, // end of animation
         repeat: -1, // -1 repeats inifitely
         repeatDelay: 1.2, // repeat delay time
         yoyo: true // reverse/repeats back and forth
       }) 
// tail animation timeline - chains multiple animations
var tl = new TimelineMax({repeat: -1, yoyo: true}); // parameters to repeat entire timeline
      tl.fromTo(
        ".tail", 
        0.7, 
        {x:-10}, 
        {
          ease: SlowMo.ease.config(1, 0.5, false),
          x:25, 
          rotation: 10,
          transformOrigin: "left 50%", 
          repeat: 2, 
          yoyo: true
        })
      tl.fromTo(".tail", 0.3, {x:25}, {ease: Sine.easeOut, x:20, repeat: 5, yoyo: true});