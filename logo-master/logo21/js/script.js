// JS only used to demonstrate that simply changing the base font value will increase the size of the logo


//author Hugo Darby Brown - Twitter @darbybrown 

$('#logo-size').change(function () {                    
  var fontsize = $(this).val()/10 + "px";
  $('html').css("font-size", fontsize );
});

$('#image-size').change(function () {                    
  var Width = $(this).val() + "px";
  $('img').css("width", Width );
});