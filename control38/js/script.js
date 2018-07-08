$(".custom-switch").each(function(i) {
  var classes = $(this).attr("class"),
      id      = $(this).attr("id"),
      name    = $(this).attr("name");
  
  $(this).wrap('<div class="custom-switch" id="' + name + '"></div>');
	$(this).after('<label for="custom-switch-' + i + '"></label>');
  $(this).attr("id", "custom-switch-" + i);
  $(this).attr("name", name);
});
$(".custom-switch input").change(function() {
  $("body").toggleClass("green");
});