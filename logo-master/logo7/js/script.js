var names = ["lucy", "chen", "mrjohnson", "donna", "jenna", "akeno", "joshua", "jackson"],
    i = 0;

function change() {
  if ( i != names.length ) {
    $("#isthisweird").removeClass();
    $("#isthisweird").addClass(names[i]);
  	$("h1").html(names[i]);
    i++;
  }else {
    $("#isthisweird").removeClass();
    $("#isthisweird").addClass(names[0]);
  	$("h1").html(names[0]);
    i = 0;
  }
};

var timer = setInterval(function() {
  change()
}, 300);

$("#isthisweird").hover(function(){
  clearInterval(timer);
}, function(){
  timer = setInterval(function() {
    change()
  }, 300);
});