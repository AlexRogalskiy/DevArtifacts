var heart = document.getElementsByClassName('heart')[1],
    pfx = ["webkit", "moz", "MS", "o", ""],
    hovered = false;

function AnimationListener() {
    if(hovered)
    { 
      heart.classList.remove('animated'); 
      heart.style.webkitTransform = 'scale(2)';
      heart.style.MozTransform = 'scale(2)';
      heart.style.msTransform = 'scale(2)';
      heart.style.OTransform = 'scale(2)';
      heart.style.transform = 'scale(2)';
    }
}

function TransitionListener() {
  if(!hovered)
  {
    heart.classList.add('animated');
  }
}

function PrefixedEvent(element, type, callback) {
	for (var p = 0; p < pfx.length; p++) {
		if (!pfx[p]) type = type.toLowerCase();
		element.addEventListener(pfx[p]+type, callback, false);
	}
}

PrefixedEvent(heart, "AnimationIteration", AnimationListener);

heart.onmouseover = function() {
  hovered = true;
}
heart.onmouseout = function() {
  setTimeout(function() { hovered = false; }, 500);
  PrefixedEvent(heart, "TransitionEnd", TransitionListener);
  heart.style.webkitTransform = 'scale(1)';
  heart.style.MozTransform = 'scale(1)';
  heart.style.msTransform = 'scale(1)';
  heart.style.OTransform = 'scale(1)';
  heart.style.transform = 'scale(1)';  
}