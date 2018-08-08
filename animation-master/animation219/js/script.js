$(".spinner").click(function(){
  $(this).removeClass('clicked');
  setTimeout(function(){    
    $(".spinner").addClass('clicked');
  },10);
});