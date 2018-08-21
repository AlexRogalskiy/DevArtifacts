$('.close-me.right').on('click',function(){
  $(this).closest('.mynotification').addClass('close-right');
});
$('.close-me.bottom').on('click',function(){
  $(this).closest('.mynotification').addClass('close-bottom');
});
$('.close-me.left').on('click',function(){
  $(this).closest('.mynotification').addClass('close-left');
});
var classes = ['close-right','close-bottom','close-left'];
$('.close-me').on('click',function(){
  if(
    $('.mynotification').hasClass(classes[0]) &&
    $('.mynotification').hasClass(classes[1]) &&
    $('.mynotification').hasClass(classes[2])){
      $('.mytitle').fadeOut(500,function(){
        $('.mytitle').text('Refresh to see it again!').fadeIn(500);
      });
    }
});