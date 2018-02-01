var lastTouchedElement;
$('html').on('click', function(event) {
  lastTouchedElement = event.target;
});

function doNotTrackClicks() {
  return navigator.userAgent.match(/iPhone|iPad/i);
};

$('nav.dropdown > ul').on('click', '> li', function(event) {
  if (!(doNotTrackClicks() || lastTouchedElement == event.target)) {
    event.preventDefault();
  }
  lastTouchedElement = event.target;
});

$('nav.dropdown').on('click', 'li', function(event) {
  event.stopPropagation();
});
