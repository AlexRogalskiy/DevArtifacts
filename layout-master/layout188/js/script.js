window.onload = function() {
  /* Duplicate text to dark layer */
  var text = document.querySelector(".light-layer .text-container").innerHTML;
  document.querySelector(".dark-layer .text-container").innerHTML = text;
  
  /* Position dark layer */
  initParallax();
  
  window.addEventListener("scroll", parallax);
}

function parallax() {
  var scrolled = window.pageYOffset,
      darklayer = document.querySelector('.dark-layer'),
      lightlayer = document.querySelector('.light-layer'),
      darkcontent = darklayer.querySelector('.text-container'),
      lightcontent = lightlayer.querySelector('.text-container'),
      lightheight = lightlayer.offsetHeight;
  
  darklayer.style.top = lightcontent.offsetHeight - scrolled + "px";
  
  darkcontent.style.marginTop = -(darkcontent.offsetHeight - scrolled) + "px";
}

function initParallax() {
  var scrolled = window.pageYOffset,
      darklayer = document.querySelector('.dark-layer'),
      lightlayer = document.querySelector('.light-layer'),
      darkcontent = darklayer.querySelector('.text-container'),
      lightheight = lightlayer.offsetHeight;
  
  darklayer.style.top = lightlayer.offsetHeight + "px";
  darklayer.style.height = darkcontent.offsetHeight + "px";
  lightlayer.style.height = lightlayer.offsetHeight + darklayer.offsetHeight + "px";
  
  darkcontent.style.marginTop = -(darkcontent.offsetHeight - scrolled) + "px";
}