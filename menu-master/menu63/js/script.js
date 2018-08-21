var MENU = {};

(function() {
  var sliderItem,
      siteNavBar,
      aItem;

  function onTransitionEnd() {
    aItem.classList.add('is-active');
    sliderItem.classList.add('is-animated');
    sliderItem.removeEventListener('transitionend', onTransitionEnd);
  }

  function getSlideToStyle(toElm) {
    var bounds = toElm.getBoundingClientRect();
    var translateX = bounds.left;
    var translateY = bounds.top;
    var scaleX = bounds.width / 200; //SliderItem is 200px wide
    return 'translateX(' + translateX + 'px) translateY(' + translateY + 'px) scale3d(' + scaleX + ', 1, 1)';
  }

  function onClick(e) {
    var target = e.target;

    if (target === e.currentTarget) {
      return;
    } else {
      aItem.classList.remove('is-active');
    }

    if (target.classList.contains('site-header__nav-item')) {
      target = target.parentNode;
    }
    aItem = target;

    sliderItem.style.transform = getSlideToStyle(aItem);
    sliderItem.classList.remove('is-animated');
    sliderItem.addEventListener('transitionend', onTransitionEnd);
  }

  MENU.init = function init() {
    sliderItem = document.createElement('div');
    sliderItem.classList.add('slider-item', 'is-animated');

    aItem = document.querySelector('.is-active');
    sliderItem.style.transform = getSlideToStyle(aItem);

    siteNavBar = document.querySelector('.site-header__nav');
    siteNavBar.addEventListener('click', onClick);
    siteNavBar.appendChild(sliderItem);
  }
}());

window.addEventListener('DOMContentLoaded', function() {
  MENU.init();
});
