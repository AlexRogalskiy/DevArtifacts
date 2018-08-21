$('body').off('click', '.lightSwitch--toggle + label');
$('body').on('click', '.lightSwitch--toggle + label', function() {
  $('.room').toggleClass("light--off");
  
});