//click
$("button").click(function() {
  $(this)
    .parents(".grid_item")
    .toggleClass("active");
  $(this)
    .parents(".grid_item")
    .siblings(".grid_item")
    .removeClass("active");
});
