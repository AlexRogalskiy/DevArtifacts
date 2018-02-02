$(function() {

  // Console Log
  function cl($m) {
    console.log($m);
  }

  // Utility Console Log
  var sp = ', ';
  var br = '<br>';

  var first = true;
  var canvas = document.getElementById('myCanvas');
  var context = canvas.getContext('2d');

  var x, y, oldX, oldY;

  var fronte = false;
  var st = 40; // S-pessore T-rama : Distanza tra i buchi in cui far passare il filo

  var story = [];

  // Impostazione filo
  var filo = {
    w: 5,
    color: '#fff',
    cap: 'round',
    join: 'round',
    shColor: 'rgba(0,0,0,.4)',
    shBlur: 8,
    shOffX: 2,
    shOffY: 2,
    dash: [0]
  };
  var filoRetro = {
    w: 5,
    color: 'rgba(0,0,0,.07)',
    //dash : [5, 10] // Tratteggiato
    dash: [0]
  };

  function setFiloFronte($context) {
    $context.strokeStyle = filo.color;
    $context.setLineDash(filo.dash);
    $context.lineWidth = filo.w;
  }

  function setFiloRetro($context) {
    $context.strokeStyle = filoRetro.color;
    $context.setLineDash(filoRetro.dash);
    $context.lineWidth = filoRetro.w;
  }

  function toggleFronteRetro($context) {
    if (fronte) {
      setFiloFronte($context);
    } else {
      setFiloRetro($context);
    }
  }

  function initContext() {
    context.lineWidth = filo.w;
    context.lineCap = filo.cap;
    context.lineJoin = filo.join;
    context.strokeStyle = filo.color;
    context.shadowColor = filo.shColor;
    context.shadowBlur = filo.shBlur;
    context.shadowOffsetX = filo.shOffX;
    context.shadowOffsetY = filo.shOffY;
  }

  function drawBG() {
    var imageObj = new Image();
    imageObj.onload = function() {
      var pattern = context.createPattern(imageObj, 'repeat');
      context.rect(0, 0, canvas.width, canvas.height);
      context.fillStyle = pattern;
      context.fill();
    };
    imageObj.src = 'img/foro.png';
  }

  function log($t) {
    document.getElementById("log").innerHTML = $t;
  }

  function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    first = true;
    fronte = false;
  }

  function points() {

    var oldX = story[story.length - 2][0];
    var newX = story[story.length - 1][0];
    var oldY = story[story.length - 2][1];
    var newY = story[story.length - 1][1];

    var deltaX = Math.abs(oldX - newX);
    var deltaY = Math.abs(oldY - newY);

    function good() {
      cl('good')
      $('#points').text('Well done, kiddo!').attr('class', 'ok');
      $('#avatar').attr('class', 'ok');
    }

    function bad() {
      $('#points').text('Oh, not like that...').attr('class', 'no');
      $('#avatar').attr('class', 'no');
    }

    if (fronte) {
      if (deltaX === st && deltaY === st) {
        good();
      } else {
        bad();
      }
    } else {
      if (deltaX === 0 && deltaY === st) {
        good();
      } else {
        bad();
      }
    }

  }

  /* Event assignments */

  $('canvas').on('click', function(event) {

    x = (Math.round(event.pageX / st)) * st;
    y = (Math.round(event.pageY / st)) * st;

    story.push([x, y]);

    // Primo click 
    if (first) {

      first = false;

    } else {
      context.beginPath();
      context.moveTo(oldX, oldY);
      context.lineTo(x, y);

      // Inverte il verso del filo
      toggleFronteRetro(context);

      // Disegna il tratto
      context.stroke();

      // Calcola il punteggio
      points();
    }

    // Update vars
    oldX = x;
    oldY = y;
    fronte = !fronte;
    //log(+ x + ', ' + y);

  }).on('mousemove', function(event) {
    var x = (Math.round(event.pageX / st)) * st - 5;
    var y = (Math.round(event.pageY / st)) * st - 4;

    $('#cursor').css({
      'left': x + 'px',
      'top': y + 'px'
    });
  });

  $('#endPath').on('click', function(event) {
    first = true;
  });

  $('.colors a').on('click', function(event) {
    filo.color = $(this).css('background-color')
    $('.colors a').removeClass('active');
    $(this).addClass('active');
  });

  $('#reset').on('click', function(event) {
    clearCanvas();
  });

  $('#replay').on('click', function(event) {

    clearCanvas();

    fronte = false;
    setFiloFronte(context);

    for (i = 0; i < (story.length - 1); i++) {

      context.beginPath();
      context.moveTo(story[i][0], story[i][1]);
      context.lineTo(story[i + 1][0], story[i + 1][1]);
      context.stroke();

      toggleFronteRetro(context);
      fronte = !fronte;
    }

    //setTimeout(function(){
    /*	for(i=1; i<story.length; i++) {
    		cl(story[1][0] + sp +  story[1][1]);
    		//context.lineTo(story[i][0], story[i][1]);
    }, 500);
    }*/

  });

  window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  })();

  function drawLine(myLine, contextFilo) {
    contextFilo.beginPath();
    contextFilo.moveTo(myLine.a[0], myLine.a[1]);
    contextFilo.quadraticCurveTo(myLine.a1[0], myLine.a1[1], myLine.b[0], myLine.b[1]);
    contextFilo.lineCap = filo.cap;
    contextFilo.lineJoin = filo.join;
    contextFilo.shadowColor = filo.shColor;
    contextFilo.shadowBlur = filo.shBlur;
    contextFilo.shadowOffsetX = filo.shOffX;
    contextFilo.shadowOffsetY = filo.shOffY;
    contextFilo.stroke();
  }

  function animateLine(myRectangle, canvasFilo, contextFilo) {

    var distX = Math.round((myLine.b[0] - myLine.a[0]) / 2);
    var distY = Math.round((myLine.b[1] + myLine.a[1]) / 2);

    myLine.a[0] = x || myLine.a[0];
    myLine.a[1] = y || myLine.a[1];
    myLine.b[0] = mX || 0;
    myLine.b[1] = mY || 0;

    // Punto intermedio
    myLine.a1[0] = myLine.a[0] + distX;
    myLine.a1[1] = distY + 500;

    toggleFronteRetro(contextFilo);

    // clear
    contextFilo.clearRect(0, 0, canvasFilo.width, canvasFilo.height);

    // Redraw
    drawLine(myLine, contextFilo);

    // request new frame
    requestAnimFrame(function() {
      animateLine(myLine, canvasFilo, contextFilo);
    });
  }

  var canvasFilo = document.getElementById('filo');
  var contextFilo = canvasFilo.getContext('2d');

  var myLine = {
    a: [161, 201],
    a1: [150, 150],
    b: [mX, mY]
  };

  var mX, mY;

  $('canvas').on('mousemove', function(ev) {
    mX = ev.pageX;
    mY = ev.pageY;
    $('.l2').html(mX + ', ' + mY + '<br>' + myLine.a + ', ' + myLine.a1 + ', ' + myLine.b);
  });

  //drawRectangle(myRectangle, contextFilo);

  $(function() {

    //drawLine(myLine, contextFilo);
    animateLine(myLine, canvasFilo, contextFilo);

  });

  // wait one second before starting animation
  /*setTimeout(function () {
      var startTime = (new Date()).getTime();
          
      //animate(myRectangle, canvasFilo, contextFilo, startTime);
      animateLine(myLine, canvasFilo, contextFilo, startTime);
  }, 1000);*/

  initContext();

});