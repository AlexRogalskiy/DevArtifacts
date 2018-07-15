/*
V1 of this UI Kit can be found here:
https://codepen.io/hugo/pen/qwsFj

As usual works best with WebKit

Take it, use it, do what you want with it
Sharing is Caring :)

*/ 




// Progress Steps JS Thanks to Francesco :)  https://codepen.io/Francext

$("ol.ui li").click(function(e) {
  var currentElem = $('.ui.progress > li').index($(this));
  if($(this).is('.ui.progress > li:last-child') && !$(this).hasClass('active')) {
    var elem = document.querySelectorAll('.ui.progress > li');
    
    [].forEach.call(elem, function(index, value) { 
      index.classList.add('active');  
    }); 
  }
  else {  
    $(this).toggleClass('active'); 
  }
});


//Color Picker 

function hexFromRGB(r, g, b) {
  var hex = [
    r.toString( 16 ),
    g.toString( 16 ),
    b.toString( 16 )
  ];
  $.each( hex, function( nr, val ) {
    if ( val.length === 1 ) {
      hex[ nr ] = "0" + val;
    }
  });
  return hex.join( "" ).toUpperCase();
}
function refreshSwatch() {
  var red = $( "#red" ).slider( "value" ),
      green = $( "#green" ).slider( "value" ),
      blue = $( "#blue" ).slider( "value" ),
      hex = hexFromRGB( red, green, blue );
  $( "body" ).css( "background-color", "#" + hex );
}
$(function() {
  $( "#red, #green, #blue" ).slider({
    orientation: "horizontal",
    range: "min",
    min: 50,
    max: 190,
    value: 127,
    slide: refreshSwatch,
    change: refreshSwatch
  });
  $( "#red" ).slider( "value", 115 );
  $( "#green" ).slider( "value", 59 );
  $( "#blue" ).slider( "value", 172 );
});



// Menu Notifications 

$(".menu-notification ul li").click(function() {
  $(this).toggleClass('notification-sml');
});

// Dropdown Menu

$(".menu").click(function () {
  $(".menu ul").slideToggle("600"); 
});

// Notifications 

$(".notifications ul li").click(function() {
  $(this).toggleClass('notification');
});

// Twitter old API no longer works

$.getJSON("https://api.twitter.com/1/statuses/user_timeline/darbybrown.json?count=1&include_rts=1&callback=?", function(data) {
     $(".twitter div").html(data[0].text);
});
