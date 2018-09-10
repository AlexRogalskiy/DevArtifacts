/**
 * Zachary Johnson
 * June 2009
 * www.zachstronaut.com
 */
 
var text;
var spot;

///window.onload = init;
init();

function init() {
    text = document.getElementById('tsb-text');
    spot = document.getElementById('tsb-spot');
    
    document.getElementById('text-shadow-box').onmousemove = onMouseMove;
    document.getElementById('text-shadow-box').ontouchmove = function (e) {e.preventDefault(); e.stopPropagation(); onMouseMove({clientX: e.touches[0].clientX, clientY: e.touches[0].clientY});};
    
    onMouseMove({clientX: 300, clientY: 200});
}


function onMouseMove(e) {
    var xm = e.clientX - 300;
    var ym = e.clientY - 175;
    var d = Math.sqrt(xm*xm + ym*ym);
    text.style.textShadow = -xm + 'px ' + -ym + 'px ' + (d / 5 + 10) + 'px black';
    
    xm = e.clientX - 600;
    ym = e.clientY - 450;
    spot.style.backgroundPosition = xm + 'px ' + ym + 'px';
}