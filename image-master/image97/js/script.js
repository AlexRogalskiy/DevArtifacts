 $('h1').lettering();

 $('.republicas li').hover(function(){
   var republica = $(this).attr('title');  
   $('.name').text(republica);
 });
  
