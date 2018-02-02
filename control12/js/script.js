console.clear();

var $button = document.querySelector('.button');

$button.addEventListener('click', function(event) {
  var rect = $button.getBoundingClientRect(),
    x = event.clientX - rect.left,
    y = event.clientY - rect.top;

  var $feedback = $button.querySelector('.feedback');

  TweenMax.set($feedback, {x: x, y: y, scaleX: 0, scaleY: 0, opacity: 1});
  TweenMax.to($feedback, 1.5, {scaleX: 1, scaleY: 1, opacity: 0, ease: Expo.easeOut});
});