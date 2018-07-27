$(document).ready(function(){
  $('.text-field-input').on('focus', function(){
    $('.field-wrapper-item').removeClass('focused');
    $(this).closest('.field-wrapper-item').addClass('focused');
  });
  $('.text-field-input').on('blur', function(){
    $('.field-wrapper-item').removeClass('focused');
  });
})