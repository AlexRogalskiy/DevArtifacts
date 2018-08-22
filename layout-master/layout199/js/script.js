(function(window, document) {
  'use strict';

  init();

  function init() {
    simulateMobile();
    setEventButtons();
    showPage();
  }

  function setEventButtons() {
    var buttons = document.querySelectorAll('[show-page]');
    for(var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', showPage);
    }
  }

  function setPreviousPage(section) {
    section.classList.remove('previus');

    if(section.classList.contains('active')) {
      section.classList.add('previus');
      section.classList.remove('active');
    }

    return section;
  }

  function setActivePage(section, pageToShow) {
    section.attributes.page.value === pageToShow
    ? section.classList.add('active')
    : null;
  }

  function getPageToShow(e, section) {
    var clicked = e ? e.target.attributes['show-page'] : undefined;
    var start = section.parentNode.attributes['start-page'];
    var first = section.attributes['page'].value;
    
    return clicked ? clicked.value : start ? start.value : first;
  }

  function showPage(e) {
    var sections = document.querySelectorAll('[page]');
    var pageToShow = getPageToShow(e, sections[0]);

    for(var i = 0; i < sections.length; i++) {
      setActivePage(
        setPreviousPage(sections[i]),
        pageToShow
      );
    }
  }

  function simulateMobile() {
    window.innerWidth > 500
    ? document.body.classList.add('simulate-mobile')
    : null;
  }

})(window, document);
