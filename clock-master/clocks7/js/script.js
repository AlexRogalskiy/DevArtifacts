window.onload = function() {
   // get the elements needed:
   var sec     = document.getElementById('sec');
   var min     = document.getElementById('min');
   var hour    = document.getElementById('hour');
   var tmpRotValue  = "";

   var curDate, curSec, curMin, curHour, secRot, minRot, hourRot;

   function setRotation(elem, degrees) {
      tmpRotValue = "rotate(" + degrees + "deg)";
      elem.setAttribute(
         "style",
         "-webkit-transform:"+tmpRotValue+"; -moz-transform:"+tmpRotValue+"; -ms-transform:"+tmpRotValue+"; -o-transform:"+tmpRotValue+"; transform:"+tmpRotValue+";" 
      );
   }

   // Timer function:
   function tick() {
      // get the current date and time:
      curDate = new Date();
      // split up:
      curSec   = curDate.getSeconds();
      curMin   = curDate.getMinutes();
      curHour  = curDate.getHours();
      // make sure, the hour is in the range of [0..11] and not in [12..23]
      if ( curHour > 11 ) {
         curHour -= 12;
      }
      // calculate the rotations per hand:
      secRot   = curSec * 6;     // 360Ў/60sec = 6Ў per second
      minRot   = curMin * 6;     // 360Ў/60min = 6Ў per minute
      hourRot  = curHour * 30 + curMin/2;   // 360Ў/12hours = 30Ў per hour
      // apply rotations:
      setRotation(sec,  secRot);
      setRotation(min,  minRot);
      setRotation(hour, hourRot);
   }
   // on time call on launch:
   tick();
   //document.getElementById('clock').setAttribute("style", "visibility:show;")
   // set interval to 1 sec
   setInterval(function(){tick()}, 1000);
};