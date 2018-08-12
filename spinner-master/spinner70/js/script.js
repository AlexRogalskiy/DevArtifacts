var duration = 600,
    element,
    step,
    frames = '▙▛▜▟'.split('');
    //frames = '▤▧▥▨'.split('');
    //frames = '◴◵◶◷'.split('');
    //frames = '◩◪'.split('');
    //frames = '◰◱◲◳'.split('');
    //frames = '◐◓◑◒'.split('');

step = function (timestamp) {
  var frame = Math.floor(timestamp*frames.length/duration) % frames.length;
  if (!element) {
    element = window.document.getElementById('spinner');
  };
  element.innerHTML = frames[frame];
  return window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);