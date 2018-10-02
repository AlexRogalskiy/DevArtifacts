var $keyboardWrapper = $('.virtual-keyboard'),
    $key = $keyboardWrapper.find("input"),
    $key_delete = $('.delete'),
    $key_shift = $('.shift'),
    $outputField = $('.output input'),
    $currentValue = $outputField.val(),
    actionKeys = $(".delete,.shift")
    activeShiftClass = "shift-activated";

// handle keystrokes
function _keystroke(keyCase){
  
  $key.not(actionKeys).on('click',function(e){
    e.preventDefault();
    
    // check for shift key for upper
    if($key_shift.hasClass(activeShiftClass)){
      keyCase = 'upper';
      $key_shift.removeClass(activeShiftClass);
    }else{
      keyCase = 'lower';
    }
    
    // handle case
    if(keyCase == 'upper'){
      var keyValue = $(this).val().toUpperCase();
    }else{
      var keyValue = $(this).val().toLowerCase();
    }
    
    // grab current value
    var output = $('.output input').val();
        $outputField.val(output + keyValue);
        getCurrentVal();
        focusOutputField();
  });
  
} // keystroke
  
// delete
$key_delete.on('click',function(e){
  e.preventDefault();
  $outputField.val($currentValue.substr(0,$currentValue.length - 1));
  getCurrentVal();
  focusOutputField();
});

// shift
$key_shift.on('click',function(e){
  e.preventDefault();
  $(this).toggleClass(activeShiftClass);
});

// grab current value of typed text
function getCurrentVal(){
  $currentValue = $outputField.val();
}

// focus for cursor hack
function focusOutputField(){
  $outputField.focus();
}

_keystroke("lower"); // init keystrokes

