window.validateTimeInput = function(evt) {
  var e = evt || window.event,
      key = e.keyCode || e.which,
      keyChar = String.fromCharCode(key),
      regexChars = /[0-9]|\:/,
      regexActions = /^(37|38|39|40|46|27|13|8)$/; // Left, Up, Right, Down, Delete, Escape, Enter, Backspace
  
  // Only works if you poitn break point on this if statment.
  if( regexChars.test(keyChar) ? false : !regexActions.test(key.toString()) && e.target.value.length >= 5 ){
    e.returnValue = false;
    if(e.preventDefault) e.preventDefault();
  }
};