(function() {
  $( document )
    .on( "mousemove", ".element", function( event ) {

    var halfW = ( this.clientWidth / 2 );
    var halfH = ( this.clientHeight / 2 );

    var coorX = ( halfW - ( event.pageX - this.offsetLeft ) );
    var coorY = ( halfH - ( event.pageY - this.offsetTop ) );

    var degX  = ( ( coorY / halfH ) * 2 ) + 'deg';
    var degY  = ( ( coorX / halfW ) * -2 ) + 'deg';

    $( this ).css( 'transform', function() {

      return 'perspective( 600px ) rotateX('+ degX +') rotateY('+ degY +')';
    } );
  } )
    .on( "mouseout", ".element", function() {
    $( this ).removeAttr( 'style' )
  } );
})();