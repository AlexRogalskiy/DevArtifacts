$('.circle').on('click',function(){
  var animClass = $(this).data('animation');
  var removeTime = $(this).data('remove');
  if($(this).hasClass(animClass)){
     $(this).removeClass(animClass);
  }else{
    $(this).addClass(animClass);
    if(typeof removeTime != 'undefined'){
      var el = $(this);
       setTimeout(function(){
         el.removeClass(animClass);
       },removeTime);
    }
  }
});