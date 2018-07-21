
;(function($, win) {
  $.fn.inViewport = function(cb) {
     return this.each(function(i,el){
       function visPx(){
         var H = $(this).height(),
             r = el.getBoundingClientRect(), t=r.top, b=r.bottom;
         return cb.call(el, Math.max(0, t>0? H-t : (b<H?b:H)));  
       } visPx();
       $(win).on("resize scroll", visPx);
     });
  };
}(jQuery, window));
;(function(){

  if($('[data-page="static-about"]').length > 0) {
    
    $(".about__map").inViewport(function(px){
        if(px && px > 250) $(this).addClass("visible") ;
    });

    $('.mi-lamp').click(function(event){
      $('.about__main-img').toggleClass('active');
    })
    window.onload = function () {
      $('.mi-elements').addClass('active');
    }
    setInterval(function(){
      $('.mi-wink').toggleClass('active');
    }, 3000)
  }
})();