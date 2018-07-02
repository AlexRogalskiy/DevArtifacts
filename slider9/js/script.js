var root = 'http://www.fouditforless.com/slideshowdemo/';

var carrosel = {
  frames : {
    0 : $('.frame0'),
    1 : $('.frame1'),
    2 : $('.frame2'),
    3 : $('.frame3'),
    4 : $('.frame4')
  },
  
  captionDisplayed : false,
  
  nextFrame : function () {
    var shownFrame = this.frames[this.currentFrame],
        nextFrameNum = parseInt((++this.currentFrame % 5),10),
        nextFrame  = this.frames[nextFrameNum];
    clearTimeout(this.timer);
    shownFrame.fadeOut(300);
    nextFrame.fadeIn(900);
    this.currentFrame = nextFrameNum;
    this.showPosition();
    this.timer = setTimeout(function ()  {
      carrosel.nextFrame();
    },4700);
  },
  
  prevFrame : function (frameNum){
    clearTimeout(this.timer);
    var shownFrame = this.frames[this.currentFrame],
        nextFrameNum = parseInt((--this.currentFrame % 5),10),
        nextFrame  = nextFrameNum === -1 ? this.frames[4]: this.frames[nextFrameNum];
    
    shownFrame.fadeOut(300);
    nextFrame.fadeIn(900);
    this.currentFrame = nextFrameNum === -1 ? 4 : nextFrameNum;
    this.showPosition();
    this.timer = setTimeout(function ()  {
      carrosel.prevFrame();
    },4700);
  },
  
  showPosition : function (color) {
    var num = parseInt((this.currentFrame + 1),10);
    color = color || '#AA6C39';
    $('.carrosel .frameMarker').css('background-color','#D49A6A');
    $('.carrosel .frameMarker:nth-of-type('+ num +')').css('background-color',color);
  },
  
  stopTheRide : function () {
    clearTimeout(this.timer);
    this.timer = setTimeout(function ()  {
      carrosel.nextFrame();
    },47000);
  },
  
  init : function () {
    $('.carrosel > div > figure').css('display','none');
    this.frames[0].css('display','block');
    this.currentFrame = 0;
    this.showPosition();
    
    $('#nextFrameBtn').on('click',function () {
      carrosel.nextFrame();
    });
    
    $('#prevFrameBtn').on('click',function () {
      carrosel.prevFrame();
    });
    
    $('#pauseFrameBtn').on('click',function () {
      carrosel.stopTheRide();
    });
    
    $('.carrosel').on('mouseover',function () {
      if (carrosel.captionDisplayed === false){
        $('.caption').fadeIn(400);
        //carrolel.stopTheRide();
        carrosel.captionDisplayed = true;
      }
    });
    
    $('.carrosel').on('mouseleave',function () {
      if (carrosel.captionDisplayed === true){
        $('.caption').fadeOut(400).finish();
        carrosel.captionDisplayed = false;
      }
    });
    
    //set initial timeout
    this.timer = setTimeout(function ()  {
      carrosel.nextFrame();
    }, 4700);
    
  }
  
};

carrosel.init();