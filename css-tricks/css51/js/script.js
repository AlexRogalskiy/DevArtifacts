if (Modernizr.testAllProps('gridRowGap') === false) {
  $('body').append("<div class='no-grid-warning'>Your browser does not support CSS-Grid - this demo requires CSS-grid to function properly</div>");
}

$('.expandable [data-toggle]').on('click', function(e) {
  e.preventDefault();
  $('.expandable').toggleClass('expanded')
  if($('.expandable').hasClass('expanded')) {
    $(this).text('Shrink Me');
  } else {
    $(this).text('Expand Me');
  }
  setTimeout(function() {
    window.containerQueries.reevaluate(false);
  }, 1);
});