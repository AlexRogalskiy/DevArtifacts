/* 
* Hi and Welcome to Codepen!
*
* My name is Ignacio and I am looking for a Dribble invitation.
* Please contact me via twitter if you have 1, 
* I would like to have 1 hehe :)
* 
*
* Finally I can reproduce in CSS what I managed to design in Photoshop. 
* Still not all browsers allow for the creatives to reproduce everything.
* We still have browser compatibility problems.
*
* I will keep publishing examples to help push the web foward.
* PLEASE Like, Heart or Share if you like, and don't forget to follow. 
* Thanks.
*
* Now let's animate it :)
*/

$(document).ready(function(){
	var tl = new TimelineLite()
	,inter = 30
  ,speed = 1
  ,$text = $('.text');
  function animInfinite(){
    $('.text').each(function(index,val) {
      index = index + 1;
      TweenMax.fromTo(
        $(this), speed, {autoAlpha:0},{autoAlpha:0+(0.01*index),delay:0.1*index});
     });
    TweenMax.to(
      $('.text:nth-child(30)'), speed,{autoAlpha:1.5,delay:3.5}
    );
  }
  $('.typer input').keyup(function() {
    //Stop Everything First
    TweenMax.killAll(false, true, false);
    TweenMax.set($text, {autoAlpha:0});
    $text.text(this.value);
     animInfinite();
  });
  animInfinite();
});
