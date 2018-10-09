var src_str = $("blockquote").text();
var term;

$("input").keyup(function() {
  $("blockquote").text(src_str);
  term = $("input").val();
  var highlight = $("blockquote").text()
  $("blockquote").html(function(_, html) {
   return html.split(term).join("<span class='smallcaps'>" + term + "</span>");
  });
})