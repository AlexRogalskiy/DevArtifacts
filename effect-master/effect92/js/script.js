//there qre still some transition bugs are left...
let curPage = 1;
let scrolling = true;
let viewscroll = false;
let hoverr = true;
let animationTime = 1;
let lbutton = false;
let tl = new TimelineMax({repeat: 0});
const left = $('.child-left-2>.left');
const right = $('.child-right-2>.right');
const scrollIn = $('.scroll-indicator');
const scrollIn2 = $('.scroll');
const close = $('.close');
const lb = $('.button-left');
const rb = $('.button-right');
for (let i = 2; i <= 4; i++) {
  for (let j = 1; j <= 5; j++) {
    tl.set($('.child-left-' + i + '>.left' + j), {x: '+=100%'});
    tl.set($('.child-right-' + i + '>.right' + j), {x: '-=100%'});
  }
}
tl.set(close, {
  scaleX: 0,
  transformOrigin: 'center'
});
function navigateDown() {
  if (scrolling && !viewscroll) {
    console.log('ww');
    scrolling = false;
    let tl = new TimelineMax({repeat: 0});
    for (let i = 1; i <= 5; i++) {
      if (i === 1 || i === 5) {
        tl.to([
          $('.child-left-' + curPage + '>.left' + i),
          $('.child-left-' + (curPage + 1) + '>.left' + i)
        ], animationTime, {
          x: '-=100%',
          ease: Power3.easeInOut
        }, .3).to([
          $('.child-right-' + curPage + '>.right' + i),
          $('.child-right-' + (curPage + 1) + '>.right' + i)
        ], animationTime, {
          x: '+=100%',
          ease: Power3.easeInOut
        }, .3);
      } else if (i === 3) {
        tl.to([
          $('.child-left-' + curPage + '>.left' + i),
          $('.child-left-' + (curPage + 1) + '>.left' + i)
        ], animationTime, {
          x: '-=100%',
          ease: Power3.easeInOut
        }, .15).to([
          $('.child-right-' + curPage + '>.right' + i),
          $('.child-right-' + (curPage + 1) + '>.right' + i)
        ], animationTime, {
          x: '+=100%',
          ease: Power3.easeInOut
        }, .15);
      } else {
        tl.to([
          $('.child-left-' + curPage + '>.left' + i),
          $('.child-left-' + (curPage + 1) + '>.left' + i)
        ], animationTime, {
          x: '-=100%',
          ease: Power3.easeInOut
        }, .25).to([
          $('.child-right-' + curPage + '>.right' + i),
          $('.child-right-' + (curPage + 1) + '>.right' + i)
        ], animationTime, {
          x: '+=100%',
          ease: Power3.easeInOut
        }, .25);
      }
    }
    curPage++;
    if (curPage == 4) {
      scrollIn.addClass('opa');
      scrollIn2.addClass('opa');
    } else if (curPage != 4) {
      scrollIn.removeClass('opa');
      scrollIn2.removeClass('opa');
    }

    setTimeout(() => {
      scrolling = true
    }, 1300);
  }
}

function navigateUp() {
  if (scrolling && !viewscroll) {
    scrolling = false;
    let tl = new TimelineMax({repeat: 0});
    for (let i = 1; i <= 5; i++) {
      if (i === 1 || i === 5) {
        tl.to([
          $('.child-left-' + curPage + '>.left' + i),
          $('.child-left-' + (curPage - 1) + '>.left' + i)
        ], animationTime, {
          x: '+=100%',
          ease: Power3.easeInOut
        }, .4).to([
          $('.child-right-' + curPage + '>.right' + i),
          $('.child-right-' + (curPage - 1) + '>.right' + i)
        ], animationTime, {
          x: '-=100%',
          ease: Power3.easeInOut
        }, .4);
      } else if (i === 3) {
        tl.to([
          $('.child-left-' + curPage + '>.left' + i),
          $('.child-left-' + (curPage - 1) + '>.left' + i)
        ], animationTime, {
          x: '+=100%',
          ease: Power3.easeInOut
        }, .11).to([
          $('.child-right-' + curPage + '>.right' + i),
          $('.child-right-' + (curPage - 1) + '>.right' + i)
        ], animationTime, {
          x: '-=100%',
          ease: Power3.easeInOut
        }, .11);
      } else {
        tl.to([
          $('.child-left-' + curPage + '>.left' + i),
          $('.child-left-' + (curPage - 1) + '>.left' + i)
        ], animationTime, {
          x: '+=100%',
          ease: Power3.easeInOut
        }, .25).to([
          $('.child-right-' + curPage + '>.right' + i),
          $('.child-right-' + (curPage - 1) + '>.right' + i)
        ], animationTime, {
          x: '-=100%',
          ease: Power3.easeInOut
        }, .25);
      }
    }
    curPage--;
    if (curPage == 4) {
      scrollIn.addClass('opa');
      scrollIn2.addClass('opa');
    } else if (curPage != 4) {
      scrollIn.removeClass('opa');
      scrollIn2.removeClass('opa');
    }

    setTimeout(() => {
      scrolling = true
    }, 1300);
  }
}

$(document).on("keydown", function(e) {
  if (e.which === 38) {
    if (curPage === 1)
      return;
    navigateUp();
  } else if (e.which === 40) {
    if (curPage === 4)
      return;
    navigateDown();
  }
});

$(document).on("mousewheel DOMMouseScroll", function(e) {
  if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
    if (curPage === 1)
      return;
    navigateUp();
  } else {
    if (curPage === 4)
      return;
    navigateDown();
  }
});

lb.mouseenter(function() {
  if (scrolling) {
    scrolling = false;
    let tl = new TimelineMax({repeat: 0});
    tl.to($('.child-left-' + curPage), 1, {
      className: '+=l1',
      ease: Power4.easeOut
    }, 0).to($('.child-right-' + curPage), 1, {
      className: '+=r1',
      ease: Power4.easeOut
    }, 0);
    for (j = 0; j <= 5; j++) {
      tl.to($('.child-left-' + curPage + '>.left' + j), 1, {
        className: '+=l1',
        ease: Power4.easeOut
      }, 0);
    }
  }

});
lb.mouseleave(function() {
  scrolling = true;
  let tl = new TimelineMax({repeat: 0});
  tl.to($('.child-left-' + curPage), 1, {
    className: '-=l1',
    ease: Power4.easeOut
  }, 0).to($('.child-right-' + curPage), 1, {
    className: '-=r1',
    ease: Power4.easeOut
  }, 0);
  for (let j = 0; j <= 5; j++) {
    tl.to($('.child-left-' + curPage + '>.left' + j), 1, {
      className: '-=l1',
      ease: Power4.easeOut
    }, 0);
  }
});

rb.mouseenter(function() {
  if (scrolling) {
    scrolling = false;
    let tl = new TimelineMax({repeat: 0});
    tl.to($('.child-left-' + curPage), 1, {
      className: '+=l2',
      ease: Power4.easeOut
    }, 0).to($('.child-right-' + curPage), 1, {
      className: '+=r2',
      ease: Power4.easeOut
    }, 0);
    for (let j = 0; j <= 5; j++) {
      tl.to($('.child-right-' + curPage + '>.right' + j), 1, {
        className: '+=rr',
        ease: Power4.easeOut
      }, 0);
    }
  }

});
rb.mouseleave(function() {
  scrolling = true;
  let tl = new TimelineMax({repeat: 0});
  tl.to($('.child-left-' + curPage), 1, {
    className: '-=l2',
    ease: Power4.easeOut
  }, 0).to($('.child-right-' + curPage), 1, {
    className: '-=r2',
    ease: Power4.easeOut
  }, 0);
  for (let j = 0; j <= 5; j++) {
    tl.to($('.child-right-' + curPage + '>.right' + j), 1, {
      className: '-=rr',
      ease: Power4.easeOut
    }, 0);
  }
});

lb.click(function() {
  if (!scrolling) {
    console.log(scrolling);
    viewscroll = true;
    let tl = new TimelineMax({repeat: 0});
    lbutton = true;
    tl.to(close, .5, {
      scaleX: 1,
      transformOrigin: 'center',
      autoAlpha: 1
    }, 0);
    tl.to($('.child-left-' + curPage), 1, {
      className: '+=cl1',
      ease: Power4.easeOut
    }, 0).to($('.child-right-' + curPage), 1, {
      className: '+=cr1',
      ease: Power4.easeOut
    }, 0);
    for (j = 0; j <= 5; j++) {
      tl.to($('.child-left-' + curPage + '>.left' + j), 1, {
        className: '+=cl1',
        ease: Power4.easeOut
      }, 0);
    }
    tl.to(lb, .4, {
      width: '0px'
    }, 0);
    tl.to(rb, .4, {
      width: '0px'
    }, 0);
    scrolling = false;
    if (curPage <= 3) {
      scrollIn.addClass('opa');
      scrollIn2.addClass('opa');
    }
  }
  setTimeout(() => {
    scrolling = false
    console.log(scrolling);
  }, 100);
});

rb.click(function() {
  if (!scrolling) {
    viewscroll = true;
    let tl = new TimelineMax({repeat: 0});
    tl.to(close, .5, {
      scaleX: 1,
      transformOrigin: 'center',
      ease: Power4.easeOut
    }, 0);
    tl.to($('.child-left-' + curPage), 1, {
      className: '+=cl2',
      ease: Power4.easeOut
    }, 0).to($('.child-right-' + curPage), 1, {
      className: '+=cr2',
      ease: Power4.easeOut
    }, 0);
    for (j = 0; j <= 5; j++) {
      tl.to($('.child-right-' + curPage + '>.right' + j), 1, {
        className: '+=crr',
        ease: Power4.easeOut
      }, 0);
    }
    tl.to(lb, .4, {
      width: '0px'
    }, 0);
    tl.to(rb, .4, {
      width: '0px'
    }, 0);
    scrolling = false;
    if (curPage <= 3) {
      scrollIn.addClass('opa');
      scrollIn2.addClass('opa');
    }
  }
  setTimeout(() => {
    scrolling = false
  }, 100);
});

close.click(function() {

  scrolling = true;
  viewscroll = false;
  if (curPage <= 3) {
    scrollIn.removeClass('opa');
    scrollIn2.removeClass('opa');
  }
  let tl = new TimelineMax({repeat: 0});
  if (lbutton) {
    tl.to(close, .5, {
      scaleX: 0,
      transformOrigin: 'center',
      ease: Power4.easeOut
    }, 0).to($('.child-left-' + curPage), 1, {
      className: '-=cl1',
      ease: Power4.easeOut
    }, 0).to($('.child-right-' + curPage), 1, {
      className: '-=cr1',
      ease: Power4.easeOut
    }, 0)
    for (j = 0; j <= 5; j++) {
      tl.to($('.child-left-' + curPage + '>.left' + j), 1, {
        className: '-=cl1',
        ease: Power4.easeOut
      }, 0);
    };
    lbutton = false;
    tl.to(lb, .4, {
      width: '100px'
    }, 0).to(rb, .4, {
      width: '100px'
    }, 0);
  } else {
    tl.to(close, .5, {
      scaleX: 0,
      transformOrigin: 'center',
      ease: Power4.easeOut
    }, 0);
    tl.to($('.child-left-' + curPage), 1, {
      className: '-=cl2',
      ease: Power4.easeOut
    }, 0).to($('.child-right-' + curPage), 1, {
      className: '-=cr2',
      ease: Power4.easeOut
    }, 0);
    for (j = 0; j <= 5; j++) {
      tl.to($('.child-right-' + curPage + '>.right' + j), 1, {
        className: '-=crr',
        ease: Power4.easeOut
      }, 0);
    }
    tl.to(lb, .4, {
      width: '100px'
    }, 0).to(rb, .4, {
      width: '100px'
    }, 0);
  }

});


// setTimeout(()=>{
// 	navigateDown();
// },500)