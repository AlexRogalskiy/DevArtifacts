//validate quantity input
function validate(evt) {
  var theEvent = evt || window.event;
  var key = theEvent.keyCode || theEvent.which;
  key = String.fromCharCode( key );
  var regex = /[0-9]|\./;
  if( !regex.test(key) ) {
    theEvent.returnValue = false;
    if(theEvent.preventDefault) theEvent.preventDefault();
  }
}


// show/hide block 1vt
$('div.slider1').on('click', function() {
     
     $('#chapter_1').toggle();

    if ($('#chapter_1').is(':visible')) {
        $(this).css('background-image', 'url("img/slayder1.png")');
    } else {
        $(this).css('background-image', 'url("img/slayder2.png")');
      }
});


// show/hide block 3vt
$('div.slider2').on('click', function() {
    
    $('#chapter_2').toggle();
    
    if ($('#chapter_2').is(':visible')) {
        $(this).css('background-image', 'url("img/slayder1.png")');
    } else {
        $(this).css('background-image', 'url("img/slayder2.png")');
      }
});


// send id to showDesc.inc.php
$('.desc_link').on('click', function(){
            // get product id
            var description_id = $(this).attr('data-desc-id');
            // send product id
            $.post('showDesc.inc.php', {  desc_id: description_id }, function(data) {
               $('#ajax_div').html(data);           
            });
});


// Change big product image
function changeImage(src, id) {
  $('.product_big_image img[id=' + id + ']').attr('src', src);  
 }


// Window for certificate image
function openWinForCert(src) {
  var certWin = window.open(src, 'certificate', 'width=600, height=600, top=100, left=400');
  certWin.focus();
  return false;
}



// basket onchange quantity      
$(document).ready(function() {

  var quantity = 1;
  var price = 0;
  var total_price = 0;
  var quantity_to_send = new Array(); 

  $('input.calc_quantity').on('change', function(){
    
    $('input.calc_quantity').each(function(){
      
      if ($(this).val() >= 1) {
        
        // get quantinty
        quantity = parseInt($(this).val());        
        
        //get price
        price = $(this).parent().siblings('td.price_for_count').html();
        price = parseInt(price);        
        
        // calculate
        total_price += quantity * price;
        // create array of quantity
        quantity_to_send.push(quantity);
        
      }

    });
    
    $('span#total_sum').text(total_price);
    // set total price to order_form in hidden input
    $('input#to_send_total_sum').val(total_price);
    // set quantity to order_form in hidden input
    $('input#to_send_quantity').val(quantity_to_send);

    total_price = 0;
    quantity_to_send = []; 
  });  
  //console.log('total price:' + total_price);
});
// basket onchange quantity

// alert for success mail
$(function(){

  window.alert = function(message) {
      $('#overrideAlert').text(message).dialog({
          modal:true,
          title:'Письмо отправлено',

          buttons: {
              'OK':function(){
                  window.location = 'index.php';
                  $(this).dialog('close');
              }
          }
      });
  };
     alert('Наш менеджер свяжется с вами по указанному телефону.');
});