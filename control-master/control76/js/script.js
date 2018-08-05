class Progression {
  defaults = {
    bar: '.progressBar',
    btnNext: '.button-advance',
    btnPrev: '.button-previous',
    progress: {
      current: 1,
      total: 1
    }
  };

  constructor(data = {}) {
    this.settings = Object.assign({}, this.defaults, data);
    
    this.bar = document.querySelector(this.settings.bar);
    this.buttonNext = document.querySelector(this.settings.btnNext);
    this.buttonPrev = document.querySelector(this.settings.btnPrev);
    
    this.progress = this.settings.progress;
    
    this.init();
  };
  
  init = () => {
    this.buttonNext.addEventListener('click', this.moveNext);
    this.buttonPrev.addEventListener('click', this.movePrev);
    
    //set the css variables on the same element you declared them on.
    //this will recalculate the width based on the new total passed in from the javascript.
    this.bar.style.setProperty('--step', this.progress.current);
    this.bar.style.setProperty('--total', this.progress.total);
    
    //Add the class after initializing variables to prevent an "on-load" animation.
    this.bar.classList.add('js-initialized');
  };

  updateStep = () => {
    //update the step counter and watch the bar animate!
    this.bar.style.setProperty('--step', this.progress.current);
  };

  moveNext = () => {
    this.progress.current++;
    console.log(this.progress.current);
    
    if (this.progress.current > this.progress.total) this.progress.current = this.progress.total;
    
    this.updateStep();
  };

  movePrev = () => {
    this.progress.current--;
    
    if (this.progress.current < 0) this.progress.current = 0;
    
    this.updateStep();
  };
}

let progressBar = new Progression({
  progress: {
    current: 1,
    total: 5
  }
});