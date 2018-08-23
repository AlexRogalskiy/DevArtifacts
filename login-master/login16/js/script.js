$('#signup').click(function(){
  if($(this).hasClass("is-on"))
  {
    // $(".signup-fields").slideUp();
    $(this).removeClass('is-on').html("sign up");
    $('.signup-fields').removeClass('is-on');
    $('#submit').attr('value','log in');
    $('#verb').html('continue');
  }
  else
  { 
    // $(".signup-fields").slideDown();
    $(this).addClass('is-on').html("nevermind, log in");
    $('.signup-fields').addClass('is-on');
    $('#submit').attr('value','sign up');
    $('#verb').html('begin');
  }
});
