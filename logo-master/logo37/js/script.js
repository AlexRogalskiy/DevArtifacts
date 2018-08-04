

TweenMax.set($('#tattoos path'),{drawSVG:"0%"})

  var tl = new TimelineMax({paused:true,reversed:true})
  tl.staggerTo($('#tattoos path'), 3, {drawSVG:"100%",ease:Linear.easeInOut}, .03)
  tl.to("#lips path:nth-child(1)", .5, {morphSVG:"#smile path:nth-child(1)", ease:Linear.easeOut});
  tl.to("#lips path:nth-child(2)", .5, {morphSVG:"#smile path:nth-child(2)", ease:Linear.easeOut},'-=.5');

$('#skin').click(function(){ tl.reversed() ? tl.play() : tl.reverse(); });

var i = -1
var swimSuitColors = ['#77ad7e','#478099','#e8db80','#e04857']

$('#top').click(function(){
 i = (i+1)%swimSuitColors.length;
 TweenMax.to($('#bikiniTop'), .5, {fill:swimSuitColors[i],ease:Linear.easeInOut})
})

$('#bottoms').click(function(){
 i = (i+1)%swimSuitColors.length;
 TweenMax.to($('#bikiniBottoms'), .5, {fill:swimSuitColors[i],ease:Linear.easeInOut})
})