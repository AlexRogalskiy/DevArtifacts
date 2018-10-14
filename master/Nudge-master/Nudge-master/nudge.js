// Nudge Function
// from http://github.com/lukejacksonn/nudge
(function(_delay, _distance, _duration){
  
  setTimeout(function() {
    
    if(window.scrollY > 0) return;
    
    // Cubic-Bezier Function 
    // modified from https://github.com/arian/cubic-bezier
    var bezier=function(r,n,t,u,a){var e=function(n){var u=1-n;return 3*u*u*n*r+3*u*n*n*t+n*n*n},f=function(r){var t=1-r;return 3*t*t*r*n+3*t*r*r*u+r*r*r},i=function(n){var u=1-n;return 3*(2*(n-1)*n+u*u)*r+3*(-n*n*n+2*u*n)*t};return function(r){var n,t,u,o,v,b,c=r;for(u=c,b=0;8>b;b++){if(o=e(u)-c,Math.abs(o)<a)return f(u);if(v=i(u),Math.abs(v)<1e-6)break;u-=o/v}if(n=0,t=1,u=c,n>u)return f(n);if(u>t)return f(t);for(;t>n;){if(o=e(u),Math.abs(o-c)<a)return f(u);c>o?n=u:t=u,u=.5*(t-n)+n}return f(u)}};

    var start; 
    var epsilon = (1000 / 60 / _duration) / 4,
        easeIn = bezier(0.07, 0.82, 0.16, 1.0, epsilon);
    
    // Animation Function
    // modified from https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = timestamp - start;
      window.scrollTo(0, Math.floor(easeIn(progress/1000)*_distance));
      if (progress < _duration ) window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);

  }, _delay)

})(3000, 40, 1000)
