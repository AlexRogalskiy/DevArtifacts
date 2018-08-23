var start_number, counter;
counter = start_number = 0;
//define a max number (optional)
var max_number = 5;
//change this number if you are using another font or size 
var number_height = 53;
//price 
var price = 12;



$(document).ready(function() {
  
  $('.digit span').text(start_number);
  $('.wrapper p span').text(counter*12);
  
  //PLUS BTN +1
  $('#plus').click(function(){
    counter++; 
    
    if(counter > max_number){
      counter = max_number;   
      animateBounceUp(counter);
    }else{
      var newnum = $('<span>' + counter + '</span>');
      $('.digit').append(newnum);
      animateCounter(counter);
      updatePrice(counter);
    }    
    
    if(counter === max_number){
       $('.plus').addClass('disabled');
      
    }else{
      $('.button').removeClass('disabled');
    }
  });
  
  //MINUS BTN -1  
  $('#minus').click(function(){
    counter--;     
    
    if(counter < start_number){
       counter = start_number; 
       animateBounceDown(counter);
     }else{
       animateCounter(counter);
       updatePrice(counter);
       setTimeout(function(){
          $('.digit span:last-child').remove();
       }, 200);       
     }  
    
    if(counter === start_number){
      $('.minus').addClass('disabled');
    }else{
      $('.button').removeClass('disabled');
    }
  });  
});


//ANIMATE SPRITE
function animateCounter(counter){
     $('.digit').css({
      '-webkit-transform' : 'translateY(-' + counter*number_height + 'px)',
      '-moz-transform'    : 'translateY(-' + counter*number_height + 'px)',
      '-ms-transform'     : 'translateY(-' + counter*number_height + 'px)',
      '-o-transform'      : 'translateY(-' + counter*number_height + 'px)',
      'transform'         : 'translateY(-' + counter*number_height + 'px)'
    });
}


function updatePrice(counter){
   $('.wrapper p span').text(counter*price);
}

//BOUNCE UP
function animateBounceUp(counter){
  var bounceup = parseInt(counter*number_height)+3;
  $('.digit').css({
      '-webkit-transform' : 'translateY(-' + bounceup + 'px)',
      '-moz-transform'    : 'translateY(-' + bounceup + 'px)',
      '-ms-transform'     : 'translateY(-' + bounceup + 'px)',
      '-o-transform'      : 'translateY(-' + bounceup + 'px)',
      'transform'         : 'translateY(-' + bounceup + 'px)'
    });
  
  setTimeout(function(){
    animateCounter(counter);
  }, 100); 
}

//BOUNCE DOWN
function animateBounceDown(counter){
  $('.digit').css({
      '-webkit-transform' : 'translateY(3px)',
      '-moz-transform'    : 'translateY(3px)',
      '-ms-transform'     : 'translateY(3px)',
      '-o-transform'      : 'translateY(3px)',
      'transform'         : 'translateY(3px)'
    });
  
  setTimeout(function(){
    animateCounter(counter);
  }, 100); 
}

