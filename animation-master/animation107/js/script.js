var s,
smallCarousel = {
  setting: {
    $wrapper: $('.container'),
    $container: $('.circle-container'),
    $nodes: $('.circle-container > .item'),
    $_nodes: $('.circle-container > .item').length,
    $number: $('.number'),
    $numberItems: $('.number > li'),
    $current: 0,
    $isAuto: true,
    $acAuto: 1500
  },

  init: function() {
    s = this.setting;
    //this.addItems();
    this.initEvents();
  },
  
/*  addItems: function() {
    var newContainer = '<div class="col"><ul class="number"></ul></div>';
    var newCounter = '';
    s.$wrapper.append(newContainer);
    for (var i = 0; i < s.$_nodes; i++) {
      newCounter += ('<li><a href="#">' + (i+1) + '</a></li>');
    }
    s.$number.append(newCounter);
    s.$number.find('li').eq(0).addClass('active');
  },*/

  initEvents: function() {
    // requestAnimationFrame() shim by Paul Irish
    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    window.requestAnimFrame = (function() {
    	return  window.requestAnimationFrame       || 
    			window.webkitRequestAnimationFrame || 
    			window.mozRequestAnimationFrame    || 
    			window.oRequestAnimationFrame      || 
    			window.msRequestAnimationFrame     || 
    			function(callback, element){
    				window.setTimeout(callback, 1000 / 60);
    			};
    })();
        
    /*Drop in replace functions for setTimeout() & setInterval() that 
    make use of requestAnimationFrame() for performance where available
    https://www.joelambert.co.uk
     
    Copyright 2011, Joe Lambert.
    Free to use under the MIT license.
    https://www.opensource.org/licenses/mit-license.php*/
        
    window.requestInterval = function(fn, delay) {
        if( !window.requestAnimationFrame       && 
            !window.webkitRequestAnimationFrame && 
            !window.mozRequestAnimationFrame    && 
            !window.oRequestAnimationFrame      && 
            !window.msRequestAnimationFrame)
                return window.setInterval(fn, delay);
        var start = new Date().getTime(),
        handle = new Object();

        function loop() {
            var current = new Date().getTime(),
            delta = current - start;
            if(delta >= delay) {
                fn.call();
                start = new Date().getTime();
            }
            handle.value = requestAnimFrame(loop);
        };
        handle.value = requestAnimFrame(loop);
        return handle;
    }

    window.clearRequestInterval = function(handle) {
        window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
        window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value)   :
        window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
        window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(handle.value) :
        window.msCancelRequestAnimationFrame ? msCancelRequestAnimationFrame(handle.value) :
        clearInterval(handle);
    };
    
    //====================== http://stackoverflow.com/a/11381730/989439
    
    function mobilecheck() {
      var check = false;
      (function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    }
    
    clickEvent = mobilecheck() ? 'touchstart' : 'click';
    
    $.each( s.$nodes, function(i) {
      var $this = $( this );
      $this.find('a').on( clickEvent, function(e) {
        e.preventDefault();
        clearCarousel(i);
        smallCarousel.getRotate( $this, i );
      });
    });
    
    $.each( s.$numberItems, function(i) {
      var $this = $( this );
      $this.find('a').on( clickEvent, function(e) {
        e.preventDefault();
        clearCarousel(i);
        smallCarousel.getRotate( s.$nodes.eq(i), i );
      });
    });
    
    var animloop = function(currentSlide) {
      if (s.$isAuto) {
        if ( s.$current === (s.$_nodes - 1) ) {
          s.$current = 0;
        } else {
          s.$current++;
        }
      } else {
        s.$current = currentSlide;
      }
      smallCarousel.getRotate( s.$nodes.eq(s.$current), s.$current );
    }
    
    var clearCarousel = function(x) {
      clearRequestInterval(autoCarousel);
      s.$isAuto = false;
      animloop(x);
    }
    
    var autoCarousel = requestInterval(animloop, s.$acAuto);
    
    //-------------------------------------------------- Avoid :hover
  
    if (!("ontouchstart" in document.documentElement)) {
      document.documentElement.className += " no-touch";
    }
  },
  
  getRotate: function( obj, pos ) {
    var angle = 360 / s.$_nodes,
        rot = 630, // Starting angle of the first item
        wC = s.$container.width();
    
    for (var i = 0; i < s.$_nodes; i++) {
      var dist = Math.round((rot+(angle*i))+(-angle*pos)); // nothing clever, but it works!
      s.$nodes.eq(i).css({
        'transform': 'rotate('+ dist +'deg) translate('+ wC/2 +'px) rotate(-'+ dist +'deg)'
      });
    }
    s.$nodes.find('a').not(obj).removeClass('active');
    obj.find('a').addClass('active');
    s.$numberItems.find('a').not(s.$numberItems.eq(pos)).removeClass('active');
    s.$numberItems.eq(pos).find('a').not().addClass('active');
  }
};

$(document).ready(function() {
  smallCarousel.init();
});