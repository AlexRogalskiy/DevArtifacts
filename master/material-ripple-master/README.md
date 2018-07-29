# material-ripple
Material Ripple Effect that can be added to any element.

[Live Demo](http://codepen.io/andytran/pen/YwrVpO)

-

#### Attributes
- **ripple** - If attribute exists, then ripple effect will be applied.
- **ripple-color** - Sets the ripple color, default `#000`
- **ripple-size** - Sets the ripple size, default `200`
- **ripple-duration** - Sets the ripple duration, default `1`

```html
<div class='className' ripple='' ripple-color='blue' ripple-size='100' ripple-duration='0.3'>
  content here
</div>
```

#### CSS
```css
.ripple,
[ripple] {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.ripple-effect {
  position: absolute;
  background: #000;
  width: 200px;
  height: 200px;
  -webkit-border-radius: 100%;
          border-radius: 100%;
  -webkit-transform: scale(2, 2);
      -ms-transform: scale(2, 2);
          transform: scale(2, 2);
  transition: 0.3s linear;
  -webkit-animation: ripple-effect 1s linear;
          animation: ripple-effect 1s linear;
  opacity: 0;

  -webkit-animation: ripple-effect 1s linear;
  -webkit-animation: ripple-effect 1s linear;
  -webkit-border-radius: 100%;
  -webkit-border-radius: 100%;
  -webkit-transform: scale(2, 2);
  -webkit-transform: scale(2, 2);
  -ms-transform: scale(2, 2);
  -ms-transform: scale(2, 2);
  -webkit-transition: 0.3s linear;
}

@-webkit-keyframes ripple-effect {
  0% {
    -webkit-transform: scale(0, 0);
            transform: scale(0, 0);
    opacity: 0.3;

    -webkit-transform: scale(0, 0);
    -webkit-transform: scale(0, 0);
  }
}

@keyframes ripple-effect {
  0% {
    -webkit-transform: scale(0, 0);
            transform: scale(0, 0);
    opacity: 0.3;

    -webkit-transform: scale(0, 0);
    -webkit-transform: scale(0, 0);
  }
}
```

#### JavaScript
```js
(function() {
  $('[ripple]').on('mousedown', function(e) {
    var $posX, $posY, $ripple, $rippleColor, $rippleDuration, $rippleSize;
    e.preventDefault;
    $ripple = $('<div />', {
      "class": 'ripple-effect'
    });
    $rippleColor = $(this).attr('ripple-color');
    $rippleSize = $(this).attr('ripple-size');
    if ($rippleSize) {
      $rippleSize = $rippleSize;
    } else {
      $rippleSize = 200;
    }
    $rippleDuration = $(this).attr('ripple-duration');
    $posX = $(this).offset().left + ($rippleSize / 2);
    $posY = $(this).offset().top + ($rippleSize / 2);
    $ripple.appendTo(this);
    $ripple.css({
      'background': $rippleColor,
      'top': e.pageY - $posY,
      'left': e.pageX - $posX,
      'width': $rippleSize,
      'height': $rippleSize,
      'animation-duration': $rippleDuration + 's'
    });
    return setTimeout((function() {
      return $ripple.remove();
    }), $rippleDuration * 1000);
  });

}).call(this);
```

#### Copyright & License
Code is released under the GPL 3.0 license.