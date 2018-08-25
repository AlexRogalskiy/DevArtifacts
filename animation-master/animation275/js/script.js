     window.onload = function () {
       var picture = document.getElementById('picture'),
           picCenter = 260/2,
           picQuarter = 260/4,
           picOffsetLeft = picture.offsetLeft,
           picOffsetTop = picture.offsetTop;

      var captureMouse = function ( event ) {
        var mouse = {x: 0, y: 0},
            x,
            y;
        if(event.pageX || event.pageY) {
          x = event.pageX;
          y = event.pageY;
        } else {
          x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
          x = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        x -= picOffsetLeft;
        y -= picOffsetTop;
        mouse.x = x;
        mouse.y = y; 
        return mouse;
      }

      var handleClass = function ( add, remove ) {
        if ( picture.className.indexOf( add ) >= 0 ) { return false; }
        picture.className = picture.className.replace( ' ' + remove, '' );
        picture.className += ' ' + add;
      }

      var removeAllClasses = function () {
        picture.className = '';
      }

      var removeClasses = function ( isX ) {
        if ( !isX ) {
          picture.className = picture.className.replace( ' top', '' );
          picture.className = picture.className.replace( ' bottom', '' );
        } else {
          picture.className = picture.className.replace( ' right', '' );
          picture.className = picture.className.replace( ' left', '' );
        }
      }

      var positionBackground = function ( mousePos ) {
         var dx = mousePos.x - picCenter,
             dy = mousePos.y - picCenter;
         if ( Math.abs( dy ) > picQuarter ) {
           if ( dy < 0 ) {
            handleClass( 'top', 'bottom' );
           } else {
            handleClass( 'bottom', 'top' );
           }
         } else {
          removeClasses( false );
         }
         if ( Math.abs( dx ) > picQuarter ) { 
           if ( dx < 0 ) {
            handleClass( 'left', 'right' );
           } else {
            handleClass( 'right', 'left' );
           }
         } else {
          removeClasses( true );
         }
      }

      var handleMouseMove = function (event) {
        positionBackground( captureMouse( event ) );
      }

      picture.addEventListener( 'mousemove', handleMouseMove, false );
      picture.addEventListener( 'mouseout', removeAllClasses, false );

     }