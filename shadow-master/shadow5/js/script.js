(function() {
  var isShown = false,
      shadow = document.querySelector('.shadow'),
      content = [
        'Blarg',
        'Honk',
        'Alien'
      ],
      contentIndex = 0;
  
  function loop() {
    
    // Word is visible, fade out, wait for fade out, then loop
    if ( isShown ) {
      shadow.classList.add('faded');
      setTimeout(function() {
        shadow.classList.remove('shown');
        setTimeout(function() {
          shadow.classList.remove('faded');
          setText();
          setTimeout( loop, 600 );
        }, 200);
      }, 200);
      
    // Word isn't visible, remove fade
    } else {
      shadow.classList.add('shown');
      setTimeout( loop, 1000 );
    }
   
    isShown = !isShown;
  }
  
  function setText() {
    contentIndex += 1;
    if ( contentIndex >= content.length ) {
      contentIndex = 0;
    }
    shadow.textContent = content[ contentIndex ];
  }
  
  setTimeout( loop, 1000 );
}());