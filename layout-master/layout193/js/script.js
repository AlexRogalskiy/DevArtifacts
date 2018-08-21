/*
  Quick sunday afternoon remake of Ramotion's pull to refresh concept. Works on  mobile too.
  https://dribbble.com/shots/1797373-Pull-Down-To-Refresh
*/


$(document).ready(function() {

  var START = undefined,
    LIMIT = 100,

    LIST = $('.list__wrapper'),
    CURVE = $('#curve'),
    CIRCLE = $('#circle'),
    FRICTION = 1,
    FPS = 35,
    DIFFERENCE,
    ANIMATING,
    TRANSLATE_HEIGHT = 90,
    REACHED_END = false,
    CURVE_HEIGHT = 190,
    START_CURVE = 'M-10 90 Q 161 90 332 90',
    END_CURVE = 'M-10 90 Q 161 120 332 90';

  $(".list__wrapper").on('touchstart mousedown',function(event) {
    event.stopPropagation(); 
    event.preventDefault();
    START = event.clientY || event.originalEvent.touches[0].clientY || event.originalEvent.changedTouches[0].clientY;

    $(window).on('touchmove mousemove', function(event){
      event.stopPropagation();
      event.preventDefault();

      if (ANIMATING) {
        return false;
      }
      if(event.type === 'touchmove'){
        var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
        DIFFERENCE = (START - touch.clientY) * (-1);

      } else {
        DIFFERENCE = (START - event.clientY) * (-1);
      }

      if (DIFFERENCE < TRANSLATE_HEIGHT) {
        translateSVG(DIFFERENCE);
        setOpacity(DIFFERENCE);
        REACHED_END = false;

      } else if (DIFFERENCE > TRANSLATE_HEIGHT && DIFFERENCE < CURVE_HEIGHT) {
        outerCurve(DIFFERENCE);
        setOpacity(DIFFERENCE);
        REACHED_END = false;
      } else if (DIFFERENCE >= CURVE_HEIGHT) {
        REACHED_END = true;
      }
    });
  });

  $(window).on('touchend mouseup', function(event) {
    event.stopPropagation();
    event.preventDefault();
    START = 0;
    if (REACHED_END) {
      runAnimation();
    } else {
      backToStart();
    }
    $(window).off('mousemove');
  });

  function backToStart() {
    if (DIFFERENCE > TRANSLATE_HEIGHT) {
      setTimeout(function() {
        $({
          x: parseInt($('.list__wrapper').css('transform').split(',')[5])
        }).animate({
          x: -183
        }, {
          duration: 300,
          step: function(now) {
            $('.list__wrapper').css({
              transform: 'translate3d(0,' + now + 'px,0)'
            })
          }
        });
      }, 100);
      $('.list').velocity({
        opacity: 1,
        duration: 300,
        delay: 200
      });
      $("#curve").velocity({
        tween: [90, DIFFERENCE]
      }, {
        duration: 150,
        loop: false,
        /*easing: [ 300, 8 ],*/
        easing: 'easeOutCubic',
        progress: function(e, c, r, s, t) {
          if (t > 90) {
            $('#curve').attr('fill', '#8B90B1');
          } else {
            $('#curve').attr('fill', 'white');
          }
          createCurve(t);
        }
      });
    } else {
      $({
        x: parseInt($('.list__wrapper').css('transform').split(',')[5])
      }).animate({
        x: -183
      }, {
        duration: 300,
        step: function(now) {
          $('.list__wrapper').css({
            transform: 'translate3d(0,' + now + 'px,0)'
          })
        }
      });
      $('.list').velocity({
        opacity: 1,
        duration: 300,
        delay: 200
      });
    }
  }

  function translateSVG(offset) {
    var dist = offset - 183;
    if (dist > -188) {
      $(LIST).css({
        transform: 'translate3d(0,' + dist + 'px,0)'
      });
    }
  }

  function setOpacity(distance) {
    distance = 140 - distance;
    var pct = distance / 140;
    $('.list').css({
      opacity: pct
    });
  }

  function runAnimation() {
    ANIMATING = true;

    $('svg:first-child').css({
      'filter': 'url(#goo)',
      '-webkit-filter': 'url(#goo)',
      '-moz-filter': 'url(#goo)',
      '-o-filter': 'url(#goo)',
      '-ms-filter': 'url(#goo)'
    });
    $("#curve").velocity({
      tween: [90, 200]
    }, {
      duration: 700,
      loop: false,
      easing: [0, 3, .3, 0.4],
      progress: function(e, c, r, s, t) {
        if (t > 90) {
          $('#curve').attr('fill', '#8B90B1');
        } else {
          $('#curve').attr('fill', 'white');
        }
        createCurve(t);
      }
    });
    setTimeout(function() {
      $('#circle_group').attr({
        'cy': 110
      });
      $('#circle').attr({
        fill: 'rgba(255,255,255,1)'
      });
      $('#circle').velocity({
        cy: 45
      }, {
        duration: 200,
        easing: 'easeOutSine'
      });

      $('#progress').velocity({
        strokeDashoffset: 0
      }, {
        duration: 800,
        delay: 300
      });
      $('svg:nth-child(2)').velocity({
        scale: 1.15,
        opacity: 0,
      }, {
        duration: 400,
        delay: 1200,
        easing: [.11, 1, .34, .98]
      });
      setTimeout(function() {
        $('#curve').attr('d', END_CURVE);
      }, 1450);
      setTimeout(function() {
        $('svg:first-child').css({
          'filter': 'none',
          '-webkit-filter': 'none',
          '-moz-filter': 'none',
          '-o-filter': 'none',
          '-ms-filter': 'none'
        });
      }, 1800);
      $('#circle').velocity({
        cy: 140
      }, {
        duration: 450,
        delay: 1300,
        complete: function() {
          $('#curve').attr('d', START_CURVE);
          $({
            x: parseInt($('.list__wrapper').css('transform').split(',')[5])
          }).animate({
            x: -183
          }, {
            step: function(now) {
              $('.list__wrapper').css({
                transform: 'translate3d(0,' + now + 'px,0)'
              })
            }
          });
          $('.list').velocity({
            opacity: 1
          }, 500);
          $('#circle').attr('cy', 190);
          $('#progress').css({
            strokeDashoffset: 345.6
          });
          $('svg:nth-child(2)').velocity({
            scale: 1,
            opacity: 1
          }, 0)
          REACHED_END = false;
          ANIMATING = false;
        }
      })
    }, 50);

  };

  function outerCurve(height) {
    var FRICTION_HEIGHT = height * FRICTION;
    var d = "M0 90 Q 161 " + FRICTION_HEIGHT + " 322 90"
    $(CURVE).attr({
      d: d,
      fill: '#8B90B1'
    });
  }

  function createCurve(height) {
    var FRICTION_HEIGHT = height * FRICTION;
    var d = "M-10 90 Q 161 " + FRICTION_HEIGHT + " 332 90"
    $(CURVE).attr('d', d);
  }
});