var fakeProgress = function() {
  var $btn = $('.submit'),
    percent = ($btn.attr('data-percent')) ? Number($btn.attr('data-percent')) + 1 : 0;
  if (percent >= 0 && percent <= 100) {
    $btn.attr('data-percent', percent);
  } else {
    $btn
      .removeAttr('data-percent')
      .removeClass('loader loading')
      .addClass('success');
    clearInterval(progress);
  }
}

$('.submit:not(disabled)').click(function() {
  $(this)
    .prop('disabled', true)
    .addClass('loader')
    .on('transitionend', function() {
      progress = setInterval(fakeProgress, 10);
      $(this)
        .addClass('loading')
        .off('transitionend');
    });
});