var animationend = 'webkitAnimationEnd oanimationend msAnimationEnd animationend';

$('.set-1').on('change', 'input', function(e) {
  $('.set-1').addClass('slideUpFadeOut').on(animationend, function() {
    //make hidden, remove vestigial classes
    $(this).addClass('hidden').removeClass('slideUpFadeOut');
    
    if(e.target.id == 's')
      $('#id').focus();
    
    $('.set-'+ e.target.id).removeClass('hidden').addClass('slideUpFadeIn').on(animationend, function(){
      //remove vestigial classes
      $(this).removeClass('invisible slideUpFadeIn');
    });
  });
});