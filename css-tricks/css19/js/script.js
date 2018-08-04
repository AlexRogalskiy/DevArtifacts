$(document).ready(function() {
  $("#overflow").change(function() {
    $(".bricks").toggleClass("hidden", this.checked)
  }).change();
});