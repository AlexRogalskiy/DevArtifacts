$("li").click(function () {
  $("li.active").removeClass("active");
  $(this).toggleClass("active");
});