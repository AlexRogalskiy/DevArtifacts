'use strict';

// OPEN IN FULL VIEW FOR BETTER EXPERIENCE

document.addEventListener('DOMContentLoaded', () => {
  const inviteEl = document.querySelector('.invite');
  const inviteBtnEl = document.querySelector('.btn-invite');
  const imagesEl = document.querySelectorAll('.invite__image');

  let selectedImages = 0;

  // ripple effect on button
  const createRipple = (el) => {
    let rippleEl = document.createElement('div');
    rippleEl.classList.add('ripple');
    el.appendChild(rippleEl);

    window.setTimeout(() => {
      el.removeChild(rippleEl);
    }, 500);
  };

  // open invite modal
  const openInvite = () => {
    let btnWrapper = inviteBtnEl.querySelector('.btn-invite__wrapper');
    inviteEl.classList.add('invite--opened');

    btnWrapper.style.backgroundColor = 'transparent';
    btnWrapper.style.transform = 'rotate(135deg)';

    // it's necessary to calculate ratio to bg grow in "square proportion"
    let windowWidth = window.outerWidth;
    let windowHeight = window.outerHeight;

    let ratio = windowWidth / windowHeight;
    let inviteBgEl = document.querySelector('.invite-bg');
    inviteBgEl.style.transform = `scale(2, ${2 * ratio})`;

    inviteBtnEl.style.top = `${windowHeight - 200}px`;
  };

  // close invite modal
  const closeInvite = () => {
    let inviteBgEl = document.querySelector('.invite-bg');
    let btnWrapper = inviteBtnEl.querySelector('.btn-invite__wrapper');

    imagesEl.forEach((el) => {
      el.style.display = 'none';
    });

    inviteBgEl.style.transform = '';
    inviteBgEl.style.opacity = '0.6';

    btnWrapper.style.backgroundColor = '';
    btnWrapper.style.transform = '';

    inviteBtnEl.style.top = '';

    // after animation remove the opened class
    const closeAnimationComplete = () => {
      inviteBgEl.removeEventListener('transitionend', closeAnimationComplete);
      inviteEl.classList.remove('invite--opened');

      inviteBgEl.style.opacity = '';

      imagesEl.forEach((el) => {
        el.style.display = '';
      })
    };

    inviteBgEl.addEventListener('transitionend', closeAnimationComplete);
  };

  // add event listeners
  inviteBtnEl.addEventListener('click', () => {
    let toConfirm = inviteBtnEl.classList.contains('btn-invite--confirm');

    if (toConfirm) {
      let confirmBg = document.querySelector('.invite-bg--confirm');
      let confirmText = document.querySelector('.invite-confirm-text');

      confirmBg.style.transform = 'scale(5)';
      inviteBtnEl.style.top = '';

      confirmText.classList.add('invite-confirm-text--show');

    } else {
      if (inviteEl.classList.contains('invite--opened')) {
        // close invite modal
        closeInvite();

      } else {
        createRipple(inviteBtnEl);

        // open invite modal
        setTimeout(() => {
          openInvite();
        }, 300);

      }
    }

  });

  imagesEl.forEach((image) => {
    var imgEl = image.querySelector('img');

    image.addEventListener('mousedown', () => {
      imgEl.style.transform = 'scale(0.9)';
    });

    image.addEventListener('mouseup', () => {
      imgEl.style.transform = '';
    });

    image.addEventListener('click', () => {
      let btnWrapper = inviteBtnEl.querySelector('.btn-invite__wrapper');

      // toggle selected class
      if (image.classList.contains('invite__image--selected')) {
        image.classList.remove('invite__image--selected');

        selectedImages--;
      } else {
        image.classList.add('invite__image--selected');

        selectedImages++;
      }

      // check if can confirm or not (minimum 3)
      if (selectedImages > 2) {
        inviteBtnEl.classList.add('btn-invite--confirm');
        btnWrapper.style.transform = 'rotate(-215deg)';
      } else {
        btnWrapper.style.transform = 'rotate(135deg)';
        inviteBtnEl.classList.remove('btn-invite--confirm');
      }
    });
  });



});
