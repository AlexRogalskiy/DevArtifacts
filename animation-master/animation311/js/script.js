// manipulates z-index to place cards to the bottom of the stack and bring forward top card
$(document).ready(function () {
var count = 0;

$(".trading-card").click(function() {
  var card = $(this);
  if(count < 4) {
 //   $(this).next().addClass("top-stack"); 
    
   $(this).removeClass("top-stack").addClass("bottom-stack");
    
    count++;
  }
  if(count == 4) {
   $("div").removeClass("bottom-stack");
    
    count = 0;
    
  //  $("div").eq(count).addClass("top-stack"); 
  }
  shuffle(card);
});
});
// shuffle function in GSAP animation
function shuffle(card) {
    TweenLite.fromTo(
        card, // target element
        0.5, // time
        {
          // sets first position
        x:410, 
        y:-15, 
        ease: Expo.easeOut}, // animation configuraton
        {
          // final position
        x:0,
        y:0,
        ease: Expo.easeIn});
};