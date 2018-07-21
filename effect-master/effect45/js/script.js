//Just to flash the showcase, this is pure CSS
var inputs = document.getElementsByTagName("input"),
    labels = document.getElementsByTagName("label");

//Label Menus to make them easier to search for
for (var x = 0; x < labels.length; x++){
  labels[x].innerHTML += "<b>Menu "+ (x + 1) + "</b>";
}

//Checks all checkboxs triggering all CSS transitions 
function check (status) {
  for (var x = 0; x < inputs.length; x++){
    inputs[x].checked = status;
  }
  if(status){
    var uncheck = setTimeout(function() { 
      check(false);
    }, 2000);
  }
  
}


// Triggers demonstration on button click
document.getElementById("bam").onclick = function () {
  check(true);
};

// Flashes menus on load
document.addEventListener("DOMContentLoaded", function(event) { 
  check(true);
});