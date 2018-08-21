/**
  Remove active class on submit
**/
$('form').submit(function(e) {
  e.preventDefault();
  if ($(this).hasClass('active')) 
    $(this).removeClass('active');
});

/**
  Show/Hide form inputs
**/
$('.search span').click(function(e) {
  
  var $parent = $(this).parent();

  if (!$parent.hasClass('active')) {
    
    $parent
      .addClass('active')
      .find('input:first')
      .on('blur', function() {
        if (!$(this).val().length) $parent.removeClass('active');
      }
    );
    
  }
});