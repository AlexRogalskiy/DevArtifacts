// pen by beatrize

/* translated css animation to gsap using the stagger method. one major advantage I've found using gsap is the elimination of manually defining styles for keyframes or % values along a sequence. it's especially helpful for animations that combine multiple elements/steps as timing and looping becomes tricky. */

var tl = new TimelineMax({repeat:-1, repeatDelay:2}); // -1 loops entire animation

tl.staggerTo( // stagger elements
  [".background-top-circle", ".background-middle-circle", ".background-inner-circle"],
  0.7, // duration of animation
  { 
    scale:0.7, // creates scale effect
    ease:Elastic.easeOut, // elastic animation
    transformOrigin:"center",
    repeat: 1 // repeats animation for "tunes"
  },
  0.2 // start time
);
 // insert looney text animation to play along/overlap with bg animation
tl.add("looney", // create label (name)
       0.1); // start play time in sequence

tl.add( // stagger elements...
  TweenMax.staggerFromTo(
    [".l-block", ".o1-block", ".o2-block", ".n1-block", ".e1-block", ".y-block"],
    0.5, 
    {scale:0,transformOrigin:"center"}, // from
    {scale:1,ease:Elastic.easeOut.config(2.5)}, // to
    0.1), // start time relative to bg timimg.. same as above with label?
    "looney" // add label
);

tl.play("looney"); // play looney

tl.add("tunes", 0.8); // insert tunes

tl.add ( TweenMax.fromTo(".tunes", 0.7, {scale:0, transformOrigin:"center", time:1}, {scale:1,ease:Elastic.easeOut.config(2.5)}), "tunes");
tl.play("tunes");

/* first attempt. worked but wasn't set up in a way where I can loop -___- */
/*
TweenMax.to(
  ".background-top-circle", // target class 
  /*
  0.7, 
  {  // set css properties
    scale:0.7,
    ease:Elastic.easeOut, // define animation 
    transformOrigin:"center",
    time:1, 
    repeat:1, 
    repeatDelay:0.2
  });

TweenMax.to(".background-middle-circle", 0.7, {scale:0.7, delay:0.2, ease:Elastic.easeOut, transformOrigin:"center", time:1, repeat:1});

TweenMax.to(".background-inner-circle", 0.7, {scale:0.7, delay:0.1, ease:Elastic.easeOut, transformOrigin:"center", time:1, repeat:1});
 
TweenMax.fromTo(".l-block", 0.7, {scale:0, transformOrigin:"center", time:1}, {scale:1,ease:Elastic.easeOut.config(2.5)});

TweenMax.fromTo(".o1-block", 0.7, {scale:0, transformOrigin:"center", time:1}, {scale:1,delay:0.1,ease:Elastic.easeOut.config(2.5)});

TweenMax.fromTo(".o2-block", 0.7, {scale:0, transformOrigin:"center", time:1}, {scale:1,delay:0.2,ease:Elastic.easeOut.config(2.5)});

TweenMax.fromTo(".n1-block", 0.7, {scale:0, transformOrigin:"center", time:1}, {scale:1,delay:0.3,ease:Elastic.easeOut.config(2.5)});

TweenMax.fromTo(".e1-block", 0.7, {scale:0, transformOrigin:"center", time:1}, {scale:1,delay:0.4,ease:Elastic.easeOut.config(2.5)});

TweenMax.fromTo(".y-block", 0.7, {scale:0, transformOrigin:"center", time:1}, {scale:1,delay:0.4,ease:Elastic.easeOut.config(2.5)});

TweenMax.fromTo(".tunes", 0.7, {scale:0, transformOrigin:"center", time:1}, {scale:1,delay:1,ease:Elastic.easeOut.config(2.5)}); */
