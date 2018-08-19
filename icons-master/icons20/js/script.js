function socialHover(e) {
  var social = document.getElementById('social-container');
  var spanArray = social.getElementsByTagName('span');
  var spanWidths = [];

  for (var i = 0; i < spanArray.length; i++) {
    spanWidths.push(spanArray[i].clientWidth);
  }

  var socialId = e.target.dataset.socialId;
  if (e.type == 'mouseenter') {
    e.target.style.width = (spanWidths[socialId] + 50) + 'px';
  } else {
    e.target.style.width = '38px';
  }
}

window.onload = function() {

  var socialButtons = document.getElementsByClassName('social-button');
  for (var i = 0; i < socialButtons.length; i++) {
    socialButtons[i].setAttribute('data-social-id', i);
    socialButtons[i].addEventListener('mouseenter', function() { socialHover(event); });
    socialButtons[i].addEventListener('mouseleave', function() { socialHover(event); });
  }
}
