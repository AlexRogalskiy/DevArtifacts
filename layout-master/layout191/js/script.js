'use strict';
class Cards {
  constructor () {
    this.cardsContainer = document.querySelector('.js-cards');
    this.fullCard = document.querySelector('.full-card');
    this.fullCardTitle = document.querySelector('.full-card__title');
    this.closeBtn = document.querySelector('.js-close-link');
    this.card = Array.prototype.slice.call(document.querySelectorAll('.card'));
    
    this.distanceToCenter = 0;
    this.onTransitionEnd = this.onTransitionEnd.bind(this);
    this.onFullCardOpenEnd = this.onFullCardOpenEnd.bind(this);
    this.onClose = this.onClose.bind(this);
    
    this.addEventListeners();
  }
  
  addEventListeners() {
    this.cardsContainer.addEventListener('click', this.onCardClick.bind(this));
    this.closeBtn.addEventListener('click', this.onClose, false);
  }
  
  onCardClick(evt) { 
    var target = evt.target;
    
    if (target === evt.currentTarget || target.classList.contains('full-card')) {
      return;
    } 
    var isOpenElm = evt.currentTarget.querySelector('.is-open');
    
    if (isOpenElm) {
      isOpenElm.classList.remove('is-open');
    }
    
    while (!target.classList.contains('card')) {
      target = target.parentNode;
      if (target.classList.contains('full-card')) {
        return;
      }
    }    
    target.classList.add('is-open');
    var headerTxt = target.querySelector('.card__title').textContent;
    this.fullCardTitle.textContent = headerTxt;
  
    var pBounds = target.parentNode.getBoundingClientRect();
    this.distanceToCenter = pBounds.left + pBounds.width / 2;
    
    this.card.forEach(this.calcCardMovement, this); 
    this.card.forEach(this.moveCard, this); 
  }
  
  calcCardMovement(elm, idx) {
    var bounds = elm.getBoundingClientRect();
    elm.moveDistance = ((bounds.left + bounds.width / 2) - this.distanceToCenter) * -1;
  }
   
  moveCard(elm) {
    if (elm.classList.contains('is-open')) {
      elm.style.transform = "translateX(" + elm.moveDistance + "px)";
      elm.addEventListener('transitionend', this.onTransitionEnd, false);
    } else {
      elm.style.transform = "translateX(" + elm.moveDistance + "px)";
    }
  }
  
  onTransitionEnd (evt) {
    var distance = evt.target.moveDistance;    
    evt.target.style.transform = "translateX(" + distance + "px) rotateY(-90deg)";
    evt.target.removeEventListener('transitionend', this.onTransitionEnd, false);
    this.fullCard.classList.add('full-card--end');
  }
  
  onFullCardOpenEnd(evt) {
  }
  
  onClose(evt) {
    this.card.forEach(function(elm) {
      elm.style.transform = "none";
      elm.classList.remove('is-open');
    }, this);
    this.fullCard.classList.remove('full-card--end');
  }
  
}

new Cards();