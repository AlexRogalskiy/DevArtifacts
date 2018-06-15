(function() {
  'use strict';
  
  var menuIcon = document.querySelectorAll('.js-menu');
  
  for (var i = 0, j = menuIcon.length; i<j; i++) {
    menuIcon[i].addEventListener('click', function() {
      var sidebar = document.querySelector('.js-sidebar');
      
      sidebar.classList.toggle('sidebar-hidden');
    });
  }
  
  setTimeout(function() {
    document.querySelector('.content').style.opacity = 1;
  }, 250)
  
  setTimeout(function() {
    document.querySelector('.js-menu-open').classList.toggle('hover');
  }, 1350)
  
  setTimeout(function() {
    document.querySelector('.js-menu-open').click();
  }, 1990)
  
  setTimeout(function() {
    document.querySelector('.js-menu-close').click();
  }, 3750)
  
  setTimeout(function() {
    document.querySelector('.js-menu-open').classList.toggle('hover');
  }, 4450)
})();