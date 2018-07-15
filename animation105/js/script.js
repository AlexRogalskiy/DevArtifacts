(function() {
  // VAR
  let cw = document.querySelectorAll('.cube');
  let c = document.querySelectorAll('.cube-contain');
  let overall = document.querySelector('input[id="pickWin"]');
  let refreshButton = document.querySelector('.refresh');
  let modalContainer = document.querySelector('.container-modal');
  let modalClose = document.querySelector('.modal-close');
  let containerMs = document.querySelector('.modal-tilte');
  let messageWin = 'You got it. Merry Christmas';
  let messageLose = 'Come on, you can find the gift';
  let clicks = 0;
  const N = 180;
  // SOUND
  let soundError = new Howl({
    src: ['https://s3-us-west-2.amazonaws.com/s.cdpn.io/953/151309__tcpp__beep1-resonant-error-beep.wav']
  });
  let soundWin = new Howl({
    src: ['https://s3-us-west-2.amazonaws.com/s.cdpn.io/953/391539__mativve__electro-win-sound.wav']
  });
  let soundJingle = new Howl({
    src: ['https://s3-us-west-2.amazonaws.com/s.cdpn.io/953/411420__ihaksi__deck-the-halls-christmas-jingle-played-with-bells.wav']
  });

  function init () {
    addGift();
    startAnimation();
    eventInit();
  }
  
  function eventInit () {
    [].forEach.call(c, (item) => {
      item.addEventListener('click', (e) => {
        clicks++;
        if ( clicks < 4 ) {
          openGift(item);
          document.getElementById('number').innerHTML = 3 - clicks;
        }
        if ( clicks == 3 && !item.classList.contains('win') ) {
          offSelect();
          setTimeout(() => {
            openModal(messageLose, false);
          }, 800);
        }
        if ( item.classList.contains('win') ) {
          offSelect();
          setTimeout(() => {
            soundWin.play();
          }, 500);
          setTimeout(() => {
            openModal(messageWin, true);
          }, 1000);
        } else {
          setTimeout(() => {
            soundError.play();
          }, 500);
        }
      }, false);
    });
    overall.addEventListener('change', () => {
      if ( overall.checked ) {
        document.querySelector('.win').classList.add('pseudo-block');
      } else {
        document.querySelector('.win').classList.remove('pseudo-block');
      }
    }, false);
    refreshButton.addEventListener('click', (e) => {
      e.preventDefault();
      resetTodo();
    }, false);
    modalClose.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
    }, false);
  }
  
  function startAnimation () {
    TweenMax.staggerTo(c, 1, {
      rotationX: "-=" + N,
      rotationY: "+=" + N,
      rotationZ: "+=" + N,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
      force3D: true,
      ease: Back.easeOut.config(1.7),
      onComplete: () => {
        for (var i = 0; i < cw.length; i++) {
          cw[i].classList.add('hover-cube');
        }
      }
    }, 0.1);
  }
  
  function addGift () {
    let rd = Math.round(Math.random() * (c.length - 1));
    let selectionGift = c[(rd - 1)].querySelector('.gift');
    const WINGIFT = '<div>😎</div>';
    const TGIFT = '<div>😢</div>';
    for (var i = 0; i < c.length; i++) {
      let allGift = c[i].querySelector('.gift');
      while(allGift.firstChild) allGift.removeChild(allGift.firstChild);
      allGift.innerHTML = TGIFT;
    }
    setTimeout(() => {
      c[(rd - 1)].classList.add('win');
      while(selectionGift.firstChild) selectionGift.removeChild(selectionGift.firstChild);
      selectionGift.innerHTML = WINGIFT;
      console.log('You are a curious boy, this is the result ' + rd);
    }, 500);
  }
  
  function openGift (elem) {
    var tl = new TimelineMax();
    elem.parentElement.classList.add('static-cube');
    elem.parentElement.classList.remove('hover-cube');
    elem.classList.add('no-ribbon');
    tl.to(elem.querySelector('.cube-top'), 1, {
      transformOrigin: 'right',
      rotationZ: 90,
      autoAlpha: 0,
      ease: Power2.easeOut
    });
    tl.to(elem.querySelector('.cube-right'), 0.5, {
      transformOrigin: '50% 100%',
      rotationX: -90,
      rotationY: 90,
      z: 0,
      ease: Power2.easeOut
    }, "-=0.3");
    tl.to(elem.querySelector('.cube-front'), 0.5, {
      transformOrigin: '100% 100%',
      rotationX: -90,
      ease: Power2.easeOut
    }, "-=0.3");
    tl.to(elem.querySelector('.cube-back'), 0.5, {
      transformOrigin: '100% 100%',
      rotationX: 90,
      ease: Power2.easeOut
    }, "-=0.3");
    tl.to(elem.querySelector('.cube-left'), 0.5, {
      transformOrigin: '50% 100%',
      rotationX: 90,
      rotationY: 90,
      z: 0,
      ease: Power2.easeOut
    }, "-=0.3");
    tl.timeScale(2);
  }
  
  function offSelect () {
    for (var i = 0; i < c.length; i++) {
      c[i].classList.add('off');
      c[i].parentElement.style.cursor = 'not-allowed';
    }
    [].forEach.call(c, (item) => {
      item.removeEventListener('click', (e) => {
        e.preventDefault();
      }, false);
    });
  }
  
  function resetTodo () {
    closeModal();
    clicks = 0;
    document.getElementById('number').innerHTML = 3;
    for (var i = 0; i < c.length; i++) {
      c[i].classList.remove('off');
      c[i].classList.remove('win');
      c[i].parentElement.style.cursor = 'pointer';
      c[i].parentElement.classList.remove('static-cube');
      c[i].classList.remove('no-ribbon');
      c[i].parentElement.classList.add('hover-cube');
      TweenMax.set(c[i].querySelector('.cube-top'), { clearProps: 'all' });
      TweenMax.set(c[i].querySelector('.cube-right'), { clearProps: 'all' });
      TweenMax.set(c[i].querySelector('.cube-front'), { clearProps: 'all' });
      TweenMax.set(c[i].querySelector('.cube-back'), { clearProps: 'all' });
      TweenMax.set(c[i].querySelector('.cube-left'), { clearProps: 'all' });
    }
    addGift();
    startAnimation();
  }

  function openModal (ms, t) {
    while(containerMs.firstChild) containerMs.removeChild(containerMs.firstChild);
    containerMs.innerHTML = ms;
    var tl = new TimelineMax();
    tl.to(modalContainer, 0.5, {
      autoAlpha: 1
    })
    .to(modalContainer.querySelector('.modal'), 0.5, {
      y: 0 + '%'
    });
    if (t === true) {
      soundJingle.play();
    }
  }
  
  function closeModal () {
    containerMs.innerHTML = '';
    overall.checked = false;
    document.querySelector('.win').classList.remove('pseudo-block');
    var tl = new TimelineMax();
    tl.to(modalContainer.querySelector('.modal'), 0.5, {
      y: 100 + '%'
    })
    .to(modalContainer, 0.5, {
      autoAlpha: 0
    });
  }
  
  init();
  
})();