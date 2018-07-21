// Chrome only for now 



// Get a list of all svg elements
icons = document.querySelectorAll('.icon-hook');

// Cycle through list
for (var i = 0; i < icons.length; i++) {
  icons[i].addEventListener('click', function(event) {
    event.preventDefault();
 
    var icon = this;
    var currentClass = icon.getAttribute('class'); // The starting class

    console.log(icon);

    if (currentClass.indexOf('active') > -1) { 
      // Remove .active
      icon.setAttribute('class', currentClass.replace(' active', ''));
    } else { 
      // Add .active
      icon.setAttribute('class', currentClass + ' active');
    }
  }, false);
}