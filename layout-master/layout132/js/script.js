window.console = window.console || function(t) {};
    window.open = function(){ console.log('window.open is disabled.'); };
    window.print = function(){ console.log('window.print is disabled.'); };
    // Support hover state for mobile.
    if (false) {
      window.ontouchstart = function(){};
    } 


if (document.location.search.match(/type=embed/gi)) {
      window.parent.postMessage('resize', "*");
    }

    //#header

//.navbar--white
//.navbar-header
//.header-nav__button

//.navbar-main
//.icon-bar header-nav__button-line

//.header-nav__logo
//.header-nav__logo-link   header__logo

//.navbar-main   navbar-right
//.header-nav__navigation
//.header-nav__navigation-item
//.header-nav__navigation-link
//.header-nav__navigation-link--outline
    //@ sourceURL=pen.js