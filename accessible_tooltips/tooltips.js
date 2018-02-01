(function($){
  var $definitions = $('.definition');
  $definitions.find('.tooltip').attr('aria-hidden','true');

  function showTip(){
    $(this).find('.tooltip').attr('aria-hidden', 'false');
  }

  function hideTip(){
    $(this).find('.tooltip').attr('aria-hidden', 'true');
  }

  $definitions.on('mouseover focusin', showTip);
  $definitions.on('mouseout focusout', hideTip);
})(jQuery);
