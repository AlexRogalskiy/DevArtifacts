if (Modernizr.testAllProps('gridRowGap') === false){
  $('body').append("<div class='no-grid-warning'>Your browser does not support CSS-Grid - this demo requires CSS-grid to function properly</div>");
}