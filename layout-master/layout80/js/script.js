$(document).on('ready', function() {
  var $browser = $('.browser-frame');

  $('#demo-large').on('click', function() {
    $browser.removeClass('demo-medium demo-small')
      .addClass('demo-large')
    ;
  });
  
  $('#demo-medium').on('click', function() {
    $browser.removeClass('demo-large demo-small')
      .addClass('demo-medium')
    ;
  });
  
  $('#demo-small').on('click', function() {
    $browser.removeClass('demo-large demo-medium')
      .addClass('demo-small')
    ;
  });
});