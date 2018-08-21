(function () {
  "use strict";

  var buttons = document.querySelectorAll(".vertical-menu-btn"),
      i, x, y, btn, btnBounds, ripple;

  function triggerRipple(evt) { 
    btn = evt.currentTarget;
    btnBounds = btn.getBoundingClientRect();
    x = evt.clientX - btnBounds.left;
    y = evt.clientY - btnBounds.top;
    
    ripple = btn.querySelector(".ripple");

    ripple.classList.remove("ripple-animate");
    ripple.style.opacity = "1";
    ripple.style.transform = "translate(-50%, -50%) translate(" + x + "px," + y + "px) scale(0, 0)";
    ripple.style.webkitTransform = "translate(-50%, -50%) translate(" + x + "px," + y + "px) scale(0, 0)";

    //Sætter startAnimation i kø for at browseren kan opdage ændringen.
    window.requestAnimationFrame(startAnimation);
  }

  function startAnimation() {
    ripple.style.transform = "translate(-50%, -50%) translate(" + x + "px," + y + "px) scale(2, 2)";
    ripple.style.webkitTransform = "translate(-50%, -50%) translate(" + x + "px," + y + "px) scale(2, 2)";
    ripple.style.opacity = "0";
    ripple.classList.add("ripple-animate");
  }

  for (i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", triggerRipple);
  }
}());