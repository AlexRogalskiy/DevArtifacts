var itemlength, 
    index,
    offset;

itemlength = $('ul li').length;

$('.length').text(itemlength);

if (itemlength > 10) {
   $('ul li:lt(10)').each(function (i) {    
     $(this).stop().fadeIn();
     index = i + 11;
     $('.items').html(i+1);
   });

   $('#load-more').on('click', function () {
     $('.loader').removeClass('hidde').addClass('shhow');
     setTimeout(function(){
       if (index >= itemlength) {
         $('.lmtxt').text('No more items to load');
         $('#load-more').off('click').css('cursor','default');
       }
       
       $("ul li:lt(" + index + ")").each(function (i) {
         $('.items').text(i+1);
         $(this).stop().fadeIn(500);
         offset = $('#load-more').offset().top;
         $('html, body').stop().animate({
           scrollTop: offset
         }, 500);

         $('.loader').removeClass('shhow').addClass('hidde');
         index = i + 11;                                 
       });
     }, 1000);
     
   });
} else {
  $('.items').html(itemlength);
  $('ul li:lt(10)').stop().fadeIn();
  $('.lmtxt').text('No more items to load');
  $('#load-more').off('click').css('cursor','default');
}