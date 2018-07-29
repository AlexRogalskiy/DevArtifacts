$(document).ready(function () {
  // Remove Overlay
  function removeOverlay() {
    $('.overlay').on('click', function () {
      $(this).fadeOut(300, function () {
        $(this).remove();
      });
    });
  }

  $('.promo-video-play').on('click', function () {
    // Add Overlay
    $('body').append('<div class="overlay"></div>');

    // FadeIn Overlay
    $('.overlay').fadeIn(300);

    // Remove Overlay
    removeOverlay();
  });
});