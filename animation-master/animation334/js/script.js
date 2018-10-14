/* events fired on the drop targets */
document.addEventListener("dragover", function(event) {
  // prevent default to allow drop
  event.preventDefault();
}, false);

document.addEventListener("dragenter", function(event) {
  // highlight potential drop target when the draggable element enters it
  if (event.target.className == "dropzone") {
    event.target.style.background = "purple";
  }
}, false);

document.addEventListener("dragleave", function(event) {
  // reset background of potential drop target when the draggable element leaves it
  if (event.target.className == "dropzone") {
    event.target.style.background = "";
  }
}, false);

document.addEventListener("drop", function(event) {

  event.preventDefault();
  
  event.target.style.background = "";
  
  var files = event.target.files || event.dataTransfer.files;
  
	if (files) {
        
    if (files[0].type === "image/svg+xml") {
      var reader = new FileReader();
      reader.onload = function(e) {
      
        var doc = new DOMParser().parseFromString(e.target.result, "text/html");
        var svg = doc.body.firstChild;
        var path = svg.querySelector("path");
        var pathData = path.getAttribute("d");
        var allElapsedPaths = document.querySelectorAll(".elapsed-grid path");
        var shape;
        if (event.target.id == "dropzone-1") {
          shape = document.getElementById("shape-1-path");
          var morphPath = document.getElementById("morph-path");
          morphPath.setAttribute("d", pathData);
          [].forEach.call(allElapsedPaths, function(path) {
            path.setAttribute("d", pathData);
          });
        } else {
          shape = document.getElementById("shape-2-path");
        }
        shape.setAttribute("d", pathData);
        
        playMorph();
        
      }
      reader.readAsText(files[0]);
    }
  }
  
}, false);

function playMorph() {
  var morph = new TimelineMax({ paused: true });
  morph
    .to('#morph-path', 0, {
      morphSVG: { shape: '#shape-1-path' }
    })
    .to('#morph-path', 1, {
      morphSVG: { shape: '#shape-2-path' },
      ease: Elastic.easeInOut
    });
  morph.play(0);
  
  var allElapsedPaths = document.querySelectorAll(".elapsed-grid path");
  var i = 1;
  [].forEach.call(allElapsedPaths, function(path) {
    var pathFreeze = new TimelineMax({ paused: true });
    var delay = i / 25;
    console.log(delay);
    pathFreeze
      .to(path, 0, {
        morphSVG: { shape: '#shape-1-path' }
      })
      .to(path, 1, {
        morphSVG: { shape: '#shape-2-path' },
        ease: Linear.easeNone
      })
      .seek(delay);
    i++;
  });
}

var runAgainButton = document.querySelector("#run-again");
runAgainButton.addEventListener("click", function() {
  playMorph();
});