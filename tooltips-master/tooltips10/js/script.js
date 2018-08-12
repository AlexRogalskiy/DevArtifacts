$(function(){
  var jfk = $(".jfk-bubble"); 
  $("#name").focus(function(){
    jfk.addClass("active");
  }).blur(function(){
    jfk.removeClass("active");
  });
});