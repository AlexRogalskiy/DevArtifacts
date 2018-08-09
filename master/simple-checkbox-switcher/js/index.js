$('input[type=checkbox]').change(function(){
  counter = 0;
  clicked = $(this).data('index');
  $('input[type=checkbox]').each(function(){
    if($(this)[0].checked){
      counter++;
    }
  });
  if(counter==3){    
    toDisable = clicked;
    while(toDisable==clicked){
      toDisable=Math.round(Math.random()*2);
    }
    $("input:eq("+toDisable+")")[0].checked = false;
  }
});