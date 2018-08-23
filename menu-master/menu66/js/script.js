$().ready(function(){
  $(".items").slideUp();
  
  $('.items li').click(function(){
    //alert("Hello, World!");
  });
  
  $("header").click(function(){
   $(this).siblings('.items').slideToggle();
  });
});