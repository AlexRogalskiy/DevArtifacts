/*
 Breathing algo credit belongs to this guy. 
 http://sean.voisen.org/blog/2011/10/breathing-led-with-arduino/
 (exp(sin(millis()/2000.0*PI)) - 0.36787944)*108.0;

Just changed the 255/(e - 1/e) => 1/(e - 1/e) so it comes out from 0-1 instead of 0-255 ( he made it for PWM LED control )

I then bound it to 0.5 -> 1
*/
var f = function(x) {
	var y = (Math.exp(Math.sin(x/2000.0*Math.PI)) - 0.36787944) * 0.425459064;
	return ((y) + 1) * 0.5;
}

var element = document.getElementById('heart');
var start;
function step(timestamp) {
  if (!start) start = timestamp;
  var progress = timestamp - start;
	element.style.transform = 'scale(' + (f( progress )) + ')';
	element.style.boxShadow = '0 0 ' + 100*(f( progress )) + 'px rgba(255,255,255,0.9)';
  window.requestAnimationFrame(step);

}

window.requestAnimationFrame(step);