// Work in progress - check back here tomorrow for more
// I'll tweet it out periodically as well - @zakkain


/* Tweaks TODO
====================

1. replace .botSeparator with a ragged border

3. replace signature font with either an image, or a better signature font (unlikely)

4. REPLACE cirq background image with original noise & color

5. MAKE IT RESPONSIVE (letter-spacing breaks this whole thing) - fitText + @media for letter-spacing?

*/

//////////////////////////////////////////////////////

// letteringJS
 $(document).ready(function() {
    $(".giga").lettering();
  });






/*global jQuery */
/*!  
* FitText.js 1.0
*
* Copyright 2011, Dave Rupert http://daverupert.com
* Released under the WTFPL license 
* http://sam.zoy.org/wtfpl/
*
* Date: Thu May 05 14:23:00 2011 -0600
*/

(function( $ ){
  
  $.fn.fitText = function( kompressor, options ) {
     
    // Setup options
    var compressor = kompressor || 1,
        settings = $.extend({
          'minFontSize' : Number.NEGATIVE_INFINITY,
          'maxFontSize' : Number.POSITIVE_INFINITY
        }, options);
	
    return this.each(function(){

      // Store the object
      var $this = $(this); 
        
      // Resizer() resizes items based on the object width divided by the compressor * 10
      var resizer = function () {
        $this.css('font-size', Math.max(Math.min($this.width() / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
      };

      // Call once to set.
      resizer();
				
      // Call on resize. Opera debounces their resize by default. 
      $(window).on('resize', resizer);
      	
    });

  };

})( jQuery );



 $(".giga").fitText(0.7);
$(".subtitle").lettering();
$(".subtitle").fitText(3);