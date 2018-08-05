;(function($, undefined){
  var $cards = $('.CardList-item');
  
  $cards.on('click.CardList', function(e){
    $cards.removeClass('is-active');
    $(e.target).parents('.CardList-item').addClass('is-active');
  });
}(jQuery));

//using modernizr, you can do something like this to support IE and browsers with no 3D transforms:

/*
if($('html').hasClass('no-csstransforms3d') || $('body').hasClass('is-IE')) {
        $(this).find('.TopicList-description').slideDown();
      }
      
Note: 'no-csstransforms3d' class is added by Modernizr.  'is-IE' is added by this check: https://gist.github.com/BuddyLReno/72b986b619ad40dd6ccc008a0f11eb42
*/