$(document).ready(function () {
  $('.nav ul').onePageNav();

  $('#tab-nav a').click(function (e) {
    e.preventDefault();

    $('#tab-nav a').removeClass('active');

    $(this).addClass('active');

    $('#tab-nav a[data-filter="all"]').click(function () {
      $('.project').show();
    });

    $('.project').hide();

    $('.project[data-id="' + $.attr(this, 'data-filter') + '"]').show();

    console.log('.project[data-id="' + $.attr(this, 'data-filter') + '"]');
  });
});