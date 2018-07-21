$(document).ready(function() {
  $('.compose').click(function() {
    $('.overlay').addClass('is-open');
  })
  $('.modal-close, .send').click(function() {
    $('.overlay').removeClass('is-open');
  })
})