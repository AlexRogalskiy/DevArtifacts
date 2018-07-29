# Ripple Effect
$('[ripple]').on 'mousedown', (e) ->
  e.preventDefault

  # Defines ripple
  $ripple = $('<div />', {
    class: 'ripple-effect'
  })

  # Gets ripple color
  $rippleColor = $(this).attr 'ripple-color'

  # Gets ripple size
  $rippleSize = $(this).attr 'ripple-size'

  # Checks if attribute exists
  if $rippleSize
    $rippleSize = $rippleSize
  else
    $rippleSize = 200

  # Gets ripple duration
  $rippleDuration = $(this).attr 'ripple-duration'

  # Gets X & Y Pos and subtract by 1/2 of $rippleSize
  $posX = $(this).offset().left + ($rippleSize / 2)
  $posY = $(this).offset().top + ($rippleSize / 2)

  # Appends ripple to element
  $ripple.appendTo(this)

  # Applies color, position, size to ripple
  $ripple.css({
    'background': $rippleColor
    'top': e.pageY - $posY
    'left': e.pageX - $posX
    'width': $rippleSize
    'height': $rippleSize
    'animation-duration': $rippleDuration + 's'
  })

  # Removes after set interval
  setTimeout ( ->
    $ripple.remove()
  ), $rippleDuration * 1000