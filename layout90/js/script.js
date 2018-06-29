$(document).ready(function() {

  var animating = false;

  var $body = $(".demo__body");
  var $content = $(".demo__content");
  var $line = $(".demo__svg__line");
  var $smile = $(".demo__svg__smile");
  var $bgPath = $(".demo__svg-bg__path");

  var resetD = "M0,0 C125,0 250,0 375,0 S375,0 375,0 L375,667 0,667z";
  var smileInit = "M176.61,25 Q187,19 197.39,25";
  var smileMid = "M176.61,25 Q187,25 197.39,25";
  var smileEnd = "M176.61,25 Q187,34 197.39,25";

  var totalLen = $line[0].getTotalLength();
  var upperLen = 187;
  var circleLen = totalLen - upperLen;
  var minLineLen = 60;
  var lineDragBoundries = upperLen - minLineLen;

  var pullDeltaY = 0;
  var pullSlowCoef = 1.2;
  var maxPullY = 150;
  var minReleaseY = 120;
  var contentYCoef = 0.4;
  var maxContentY = maxPullY*contentYCoef;
  var bodyOffsetX = 0;
  var bodyW = $body.outerWidth();

  var resetAT = 500;
  var releaseStep1AT = 800;
  var releaseWaitTime = 3000;

  var easings = {
    elastic: function(t,b,c,d) {
      var ts = (t/=d)*t;
      var tc = ts*t;
      return b+c*(33*tc*ts + -106*ts*ts + 126*tc + -67*ts + 15*t);
    },
    inCubic: function(t,b,c,d) {
      var tc = (t/=d)*t*t;
      return b+c*(tc);
    }
  };

  function SvgAddClass(el, cl) {
    var regEx = new RegExp('(?:^|\\s)'+cl+'(?!\\S)', "gi");
    if (regEx.test(el.attr("class"))) return;
    el.attr("class", el.attr("class") + " " + cl);
  };

  function SvgRemoveClass(el, cl) {
    var regEx = new RegExp('(?:^|\\s)'+cl+'(?!\\S)', "gi");
    el.attr("class", el.attr("class").replace(regEx, ""));
  };

  function SvgPathTween(from, to, time, easing) {
    var regex = /\d+(\.\d{1,2})?/g;
    var fromD = from.attr("d");
    var fm = fromD.match(regex);
    var tm = to.match(regex);
    var diff = [];
    for (var i = 0; i < fm.length; i++) {
      diff.push(+fm[i] - (+tm[i]));
    }
    var time = time || 600;
    var curFrame = 0;
    var frames = time / 1000 * 60;
    var easing = easing || "elastic";

    function animate() {
      if (curFrame > frames) return;
      var i = 0;
      var newD = fromD.replace(regex, function(m) {
        if (+m === 0 || // if nothing changed - skip
            i % 2 === 0) { // in this demo I want to animate only y values
          i++;
          return m;
        }
        return +easings[easing](curFrame, +fm[i], 0 - diff[i++], frames).toFixed(2);
      });
      from.attr("d", newD);
      curFrame++;
      requestAnimationFrame(animate);
    };

    animate();
  };

  function pullChange(y, x) {
    var pullY = (y <= maxPullY) ? y : maxPullY;
    if (pullY < 0) pullY = 0;
    var pullCoef = pullY / maxPullY;
    var sdo = circleLen + pullCoef * lineDragBoundries;
    var pullYCont = +(pullY*contentYCoef).toFixed(2);
    var bodyX = parseInt(x - bodyOffsetX, 10);
    if (bodyX < 0) bodyX = 0;
    if (bodyX > bodyW) bodyX = bodyW;
    var leftX = bodyX - 50;
    if (leftX < 0) leftX = 0;
    var rightX = bodyX + 50;
    if (rightX > bodyW) rightX = bodyW;

    $body.css("transform", "translate3d(0,"+ pullY +"px,0)");
    $content.css("transform", "translate3d(0,"+ pullYCont +"px,0)");
    $line.css("stroke-dashoffset", sdo);

    $bgPath.attr("d", "M0,0 C"+(leftX-25)+",0 "+(leftX)+","+pullYCont+" "+bodyX+","+pullYCont+" S"+(rightX+25)+",0 375,0 L375,667 0,667z");
  };

  function reset() {
    $body.addClass("reset");
    $content.addClass("reset");
    SvgAddClass($line, "reset");
    SvgPathTween($bgPath, resetD);

    setTimeout(function() {
      $body.removeClass("reset").attr("style", "");
      $content.removeClass("reset").attr("style", "");
      SvgRemoveClass($line, "reset");
      $line.attr("style", "");
      animating = false;
    }, resetAT);
  };

  function performMagic() {
    $body.addClass("waiting");
    SvgAddClass($line, "show-circle");
    SvgPathTween($bgPath, resetD);
    $content.addClass("reset");

    setTimeout(function() {
      SvgAddClass($line, "rotating");
    }, releaseStep1AT*0.32);

    setTimeout(function() {
      $content.removeClass("reset").attr("style", "");
      
      SvgAddClass($smile, "active");
      
      setTimeout(function() {
        SvgPathTween($smile, smileMid, 300, "inCubic");
        
        setTimeout(function() {
          SvgPathTween($smile, smileEnd, 300, "inCubic");
          
          SvgAddClass($smile, "minified");
        }, 500);
      }, 700);
      
    }, resetAT);

    setTimeout(function() {
      SvgRemoveClass($line, "rotating");
      SvgRemoveClass($line, "show-circle");
      SvgAddClass($line, "reset");
      $body.removeClass("waiting").addClass("reset");

      setTimeout(function() {
        $body.removeClass("reset").attr("style", "");
        SvgRemoveClass($line, "reset");
        $line.attr("style", "");
        SvgRemoveClass($smile, "minified");
        SvgRemoveClass($smile, "active");
        SvgPathTween($smile, smileInit, 50, "inCubic");
        animating = false;
      }, resetAT);

    }, releaseWaitTime);

  };

  function release() {
    animating = true;
    if (pullDeltaY < minReleaseY) {
      reset();
    } else {
      performMagic();
    }
  };

  $(document).on("mousedown touchstart", ".demo__body", function(e) {
    if (animating) return;
    var startY =  e.pageY || e.originalEvent.touches[0].pageY;
    bodyOffsetX = $body.offset().left;

    $(document).on("mousemove touchmove", function(e) {
      var y = e.pageY || e.originalEvent.touches[0].pageY;
      var x = e.pageX || e.originalEvent.touches[0].pageX;
      pullDeltaY = (y - startY) / pullSlowCoef;
      if (!pullDeltaY) return;
      pullChange(pullDeltaY, x);
    });

    $(document).on("mouseup touchend", function() {
      $(document).off("mousemove touchmove mouseup touchend");
      if (!pullDeltaY) return;
      release();
    });
  });

});