$(document).ready(function(){
  var steps=10;
  var angle=6;
  
  var angleDiff=angle/steps;
  var startAngle=-angle/2;
  var opacityDiff=(1/steps)+0.05;
  
  var $container=$(".container");
  var $original=$(".layer");
  
  $(".col").each(function(){
    $(this).clone().appendTo($(this).parent());
  })
  for(var i=0;i<steps;i++){
    var a=startAngle+(angleDiff*i);
    var $newLayer=$original
      .clone()
      .appendTo($container)
      .css({
        transform:"rotateX("+a+"deg)",
        opacity:opacityDiff
      })
    ;
  }
  $original.remove();
  
  var last=Date.now();
  var y=0;
  var speed=0.05;
  (function updateScroll(){
    var now=Date.now();
    var deltaT=now-last;
    y+=speed*deltaT;
    y=y % ($(".layer").height()/2);
    TweenMax.set($(".layer"),{
      y:-y,
      force3D:true,
      transformOrigin:"50% "+(($(window).height()/3)+y)+"px"
    });
    last=now;
    
    requestAnimationFrame(updateScroll);
  }());
})