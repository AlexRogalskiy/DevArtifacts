$("[data-scroll-to]").click(function() {
  var $this = $(this),
      $toElement      = $this.attr('data-scroll-to'),
      $focusElement   = $this.attr('data-scroll-focus'),
      $offset         = $this.attr('data-scroll-offset') * 1 || 0,
      $speed          = $this.attr('data-scroll-speed') * 1 || 500;

  $('html, body').animate({
    scrollTop: $($toElement).offset().top + $offset
  }, $speed);
  
  if ($focusElement) $($focusElement).focus();
});