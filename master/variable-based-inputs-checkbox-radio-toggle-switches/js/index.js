$(document).ready(function() {
    if ($(window).width()< 600) {
      console.log("hey, it worked on load")
     $('.container').addClass('mobile');
    }
    else {$('.container').removeClass('mobile');}
 });

$(window).resize(function() {
    if ($(window).width() < 600) {
      console.log("hey, it worked on resize")
     $('.container').addClass('mobile');
    }
    else {$('.container').removeClass('mobile');}
 });