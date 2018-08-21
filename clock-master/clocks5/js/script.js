/** Our wonderfull little clock **/
class Clock {

  /**
   * Clock initialization
   */
  constructor() {
    this.sound = new Audio("data:audio/wav;base64,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"); 
    this.hourHand   = document.querySelector('.hour.hand');
    this.minuteHand = document.querySelector('.minute.hand');
    this.secondHand = document.querySelector('.second.hand');
    this.timer();
    
    setInterval(() => this.timer(), 1000);
  }
  
  /**
   * Timer of the clock
   */
  timer() {
    this.sethandRotation('hour');
    this.sethandRotation('minute');
    this.sethandRotation('second');
  }

  /**
   * Changes the rotation of the hands of the clock
   * @param  {HTMLElement} hand   One of the hand of the clock
   * @param  {number}      degree degree of rotation of the hand
   */
  sethandRotation(hand) {
    let date = new Date(), hours, minutes, seconds, percentage, degree;
    
    switch (hand) {
      case 'hour':
        hours       = date.getHours();
        hand        = this.hourHand;
        percentage  = this.numberToPercentage(hours, 12);
        break;
      case 'minute':
        minutes     = date.getMinutes();
        hand        = this.minuteHand;
        percentage  = this.numberToPercentage(minutes, 60);
        break;
      case 'second':
        seconds     = date.getSeconds();
        hand        = this.secondHand;
        percentage  = this.numberToPercentage(seconds, 60);
        this.sound.play();
        break;
    }
  
    degree                = this.percentageToDegree(percentage);
    hand.style.transform  = `rotate(${degree}deg) translate(-50%, -50%)`;
  }

  /**
   * Converting a number to a percentage
   * @param  {number} number Number
   * @param  {number} max    Maximum value of the number
   * @return {number}        Return a percentage
   */
  numberToPercentage(number = 0, max = 60) {
    return (number / max) * 100;
  }

  /**
   * Converting a percentage to a degree
   * @param  {number} percentage Percentage
   * @return {number}            Return a degree
   */
  percentageToDegree(percentage = 0) {
    return (percentage * 360) / 100;
  }

}

let clock = new Clock();