$(document).ready(function() { 
  const SCALE = 4;
  const ANIMATION_DURATION = 500;
  const QUICK_ANIMATION_DURATION = 200;
  const DRAG_LIMIT = 375;
  
  let initialMouseY;
  let lastTranslateValue = 0;
  let diff = 0;
  let busy = false;
  let cardsCreated = 0;
  let $notched = $('.demo__card--notched');
  let $controls = $('.demo__controls');
  let $cards = $('.demo__card');
  let $regularCards = $('.demo__card--regular');
  let $timeIndicator = $('.demo__indicator--time');  
  
  const codepenCard = {
    type: 'LINK',
    imageUrl: 'https://kiyutink.github.io/logos/codepen.png',
    caption: '<a class="demo__profile-link" href="https://codepen.io/kiyutink/" target="_blank">My codepen</a>',
    description: 'Check out my other pens',
    time: 'just now'
  }
  
  const twitterCard = {
    type: 'LINK',
    imageUrl: 'https://kiyutink.github.io/logos/twitter.jpg',
    caption: '<a class="demo__profile-link" href="https://twitter.com/kiyutin_k" target="_blank">My twitter</a>',
    description: 'Follow me',
    time: 'just now'
  }
  
  const dribbbleCard = {
    type: 'LINK',
    imageUrl: 'https://kiyutink.github.io/logos/dribbble.png',
    caption: '<a class="demo__profile-link" href="https://dribbble.com/shots/4089014-Pull-To-Refresh-iPhone-X" target="_blank">Dribble shot</a>',
    description: 'By Saptarshi Prakash',
    time: 'just now'
  }
  
  setCurrentTime();
  setInterval(setCurrentTime, 60 * 1000);  
  
  function setCurrentTime() {
    const curDate = new Date();
    let hours = curDate.getHours() + '';
    if (hours.length <= 1)
      hours = 0 + hours;
    let minutes = curDate.getMinutes() + '';
    if (minutes.length <= 1)
      minutes = 0 + minutes;
    $timeIndicator.text(`${hours}:${minutes}`);
  }
  
  
  $('.demo__phone').on('mousedown touchstart', '.demo__screen', e => {
    e.preventDefault();
    if (busy) return;
    initialMouseY = e.clientY || e.touches[0].clientY;
    
    $(document).on('mousemove touchmove', scrollCards);
  });
  
  function scrollCards(e) {
    diff = (e.clientY || e.touches[0].clientY) - initialMouseY;
    if (diff < 0) 
      return;
     
    if (diff < DRAG_LIMIT / SCALE) 
      $notched.find('.demo__card-release').css('opacity', 0);    
      
    if (diff > DRAG_LIMIT / SCALE) {
      diff = DRAG_LIMIT / SCALE;
      $notched.find('.demo__card-release').css('opacity', 0.6);
    }
    
    $notched.css('transform', `scale(0.6) rotateX(180deg) translateY(${700 / SCALE - diff}px)`)
    $regularCards.css('transform', `translateY(${diff + lastTranslateValue}px)`);
  }
  
  function makeCard(cardDetails) {    
    return `
      <div class="demo__card demo__card demo__card--notched">
        <div class="demo__card-frontside">
          <div class="demo__card-type">${cardDetails.type}</div>
          <div class="demo__card-body">
            <div class="demo__card-picture" style='background-image: url(${cardDetails.imageUrl});'></div>
            <div class="demo__card-info">
              <div class="demo__card-caption">${cardDetails.caption}</div>
              <div class="demo__card-description">${cardDetails.description}</div>
            </div>            
          </div>
          <div class="demo__card-bottom">
              <div class="demo__card-button">View balance</div>
              <div class="demo__card-time">${cardDetails.time}</div>
          </div>
        </div>
        <div class="demo__card-backside">
            <div class="demo__card-release">
              release
            </div>
        </div>
      </div>
`}
  
  
  $(window).on('mouseup touchend', () => {
    $(document).off('mousemove touchmove', scrollCards);
    lastTranslateValue = diff + lastTranslateValue;
    if (lastTranslateValue >= DRAG_LIMIT / SCALE) {
      busy = true;
      const animatedCard = $('.demo__card--notched');
      $cards.addClass('animation');
      setTimeout(() => {
        $cards.removeClass('animation');
        animatedCard.addClass('demo__card--regular').removeClass('demo__card--processing');
        $regularCards = $('.demo__card--regular');
        $regularCards.css('transform', 'none');
        busy = false;
      }, ANIMATION_DURATION);
      
      $regularCards.css('transform', `translateY(${605 / SCALE}px)`);
      $notched.css('transform', '').removeClass('demo__card--notched').addClass('demo__card--processing');
      
      if (cardsCreated >= 4)
        cardsCreated = 0;
      
      switch (cardsCreated) {
        case 0:
          $controls.after(makeCard(codepenCard));
          break;
        case 1:
          $controls.after(makeCard(twitterCard));
          break;
        case 2:
          $controls.after(makeCard(dribbbleCard));
          break;
        case 3:
          $controls.after(makeCard({
            type: 'PAYMENT',
            caption: 'Kirill Kiyutin',
            imageUrl: 'https://kiyutink.github.io/profile-pic.jpg',
            description: 'Moscow, Russia',            
            time: 'just now'
          }));
          break;
      }
      
      cardsCreated ++;
      
      $notched = $('.demo__card--notched');
      $cards = $('.demo__card');
    }
    
    else {
      if (busy)
        return;
      $cards.addClass('short-animation');
      setTimeout(() => {        
        $cards.removeClass('short-animation');
      }, QUICK_ANIMATION_DURATION);
      $notched.css('transform', `rotateX(180deg) scale(0.6) translateY(${700 / SCALE}px)`);
      $regularCards.css('transform', 'none');      
    }
    diff = 0;
    lastTranslateValue = 0;
  });  
});