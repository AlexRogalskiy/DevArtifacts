//Javascript Snippet by Tim Inman
// collect svg paths into an array
var paths = document.getElementsByTagName('path');

// let's start with a blank (looking) canvas
// and shapes disappear when rolled over
for (var i = 0; i < paths.length; i++) {
  paths[i].style.fillOpacity = "0.1";
  paths[i].style.stroke = "1";
  paths[i].onmouseover = function() {
  this.style.fillOpacity = "0.3";
  this.style.stroke = "red"; 
  }
}

// creating a function which will fill the paths
var fill = function(p) {
    var i = 0
    window.setInterval(function() {
      if( p.length == i) {return}
      p[i].style.fillOpacity = "1.0";
      p[i].style.stroke = "none";
      i ++
    }, 14);
};

fill(paths);




