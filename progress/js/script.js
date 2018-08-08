$(document).on('click', 'a.step', function () {
  var $this = $(this)
  var $parent = $this.closest('.progress-steps')
  
  // If the bar is moving from right to left, the css transitions
  // must be in reverse order, done via parent class
  var activeIndex = $parent.find('.active').index()
  var thisIndex = $this.index()

  if (thisIndex < activeIndex) {
    $parent.addClass('reverse')
  } else {
    $parent.removeClass('reverse')
  }

  // Remove status classes of all steps
  $parent.find('a').removeClass('active done')

  // Add done to all steps before, add active to this step
  $this.prevAll().addClass('done')
  $this.addClass('active')
})
