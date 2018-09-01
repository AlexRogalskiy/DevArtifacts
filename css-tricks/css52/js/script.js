$(document).foundation();
$('#menu1').on('on.zf.toggler', function() {
  $('#menu2').removeClass('active');
});

$('#menu2').on('on.zf.toggler', function() {
  $('#menu1').removeClass('active');
});
  
if (Modernizr.testAllProps('gridRowGap') === false){
  $('body').append("<div class='no-grid-warning'>Your browser does not support CSS-Grid - this demo requires CSS-grid to function properly</div>");
}
