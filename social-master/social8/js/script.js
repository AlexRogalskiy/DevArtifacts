var clickHandler = function(el) {
  // var el = el.parentNode;
  if (el.classList) {
    el.classList.toggle("active");
  } else {
    var classes = el.className.split(" ");
    var existingIndex = classes.indexOf("active");

    if (existingIndex >= 0) classes.splice(existingIndex, 1);
    else classes.push("active");

    el.className = classes.join(" ");
  }
};

var pandoras = document.querySelectorAll(
  ".social-share-box--btn"
);
for (var i = 0; i < pandoras.length; i++) {
  pandoras[i].addEventListener("click", function(e) {
    e.preventDefault();
    var el = this.parentNode;
    clickHandler(el);
  });
}

var cubes = document.querySelectorAll(
  ".social-share-cube--btn"
);
for (var i = 0; i < cubes.length; i++) {
  cubes[i].addEventListener("click", function(e) {
    e.preventDefault();
    var el = this.parentNode.parentNode;
    clickHandler(el);
  });
}


var panels = document.querySelectorAll(
  ".social-share-panel--btn"
);
for (var i = 0; i < panels.length; i++) {
  panels[i].addEventListener("click", function(e) {
    e.preventDefault();
    var el = this.parentNode;
    clickHandler(el);
  });
}
