var toggler = $('.checkbox__toggle');
var circle = $('.checkbox__checker');

var time1 = 150;
var time2 = 800;

toggler.click(function(){
  circle.removeClass('anim--speed');
  if($(this).is(":checked")){
    setTimeout(function(){
      circle.addClass('anim--speed');
    },10);
    setTimeout(function(){
      circle.addClass('anim--go-right');
    },time1);
  }
  else{
    setTimeout(function(){
      circle.addClass('anim--speed');
    },10);
    setTimeout(function(){
      circle.removeClass('anim--go-right');
    },time1);
  }
})
