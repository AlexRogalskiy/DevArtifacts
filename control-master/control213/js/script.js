$('button').on('click', function() {
  var $inp = $('input');  
  $inp.attr('type') === 'password' ? 
    $inp.attr('type', 'text') 
  : $inp.attr('type', 'password')
});