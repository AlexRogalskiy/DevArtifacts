var buttons = document.querySelectorAll(".toggle-button");
var modal = document.querySelector("#modal");

[].forEach.call(buttons, function(button) {
  button.addEventListener("click", function() {
    modal.classList.toggle("off");
  })
});