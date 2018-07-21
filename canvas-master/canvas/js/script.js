/* https://github.com/bendc/animateplus */
var animate=function(){function y(a){return Array.isArray(a)?a:Array.prototype.slice.call(a)}var z,m=function(a){var b=a.length;return function d(){for(var e=arguments.length,f=Array(e),g=0;g<e;g++)f[g]=arguments[g];return f.length<b?function(){for(var a=arguments.length,b=Array(a),e=0;e<a;e++)b[e]=arguments[e];return d.apply(void 0,f.concat(b))}:a.apply(void 0,f)}},q=function(){for(var a=arguments.length,b=Array(a),c=0;c<a;c++)b[c]=arguments[c];return function(a){return b.reduce(function(a,b){return b(a)},
a)}},r=function(a){return function(){return!a.apply(void 0,arguments)}},H={linear:function(a,b,c,d){return b+a/d*c},easeInQuad:function(a,b,c,d){return c*(a/=d)*a+b},easeInCubic:function(a,b,c,d){return c*(a/=d)*a*a+b},easeInQuart:function(a,b,c,d){return c*(a/=d)*a*a*a+b},easeInQuint:function(a,b,c,d){return c*(a/=d)*a*a*a*a+b},easeInSine:function(a,b,c,d){return-c*Math.cos(a/d*(Math.PI/2))+c+b},easeInExpo:function(a,b,c,d){return 0==a?b:c*Math.pow(2,10*(a/d-1))+b},easeInCirc:function(a,b,c,d){return-c*
(Math.sqrt(1-(a/=d)*a)-1)+b},easeInElastic:function(a,b,c,d){var e=1.70158,f=0,g=c;if(0==a)return b;if(1==(a/=d))return b+c;f||(f=.3*d);g<Math.abs(c)?(g=c,e=f/4):e=f/(2*Math.PI)*Math.asin(c/g);return-(g*Math.pow(2,10*--a)*Math.sin(2*(a*d-e)*Math.PI/f))+b},easeInBack:function(a,b,c,d,e){void 0==e&&(e=1.70158);return c*(a/=d)*a*((e+1)*a-e)+b},easeOutQuad:function(a,b,c,d){return-c*(a/=d)*(a-2)+b},easeOutCubic:function(a,b,c,d){return c*((a=a/d-1)*a*a+1)+b},easeOutQuart:function(a,b,c,d){return-c*((a=
a/d-1)*a*a*a-1)+b},easeOutQuint:function(a,b,c,d){return c*((a=a/d-1)*a*a*a*a+1)+b},easeOutSine:function(a,b,c,d){return c*Math.sin(a/d*(Math.PI/2))+b},easeOutExpo:function(a,b,c,d){return a==d?b+c:c*(-Math.pow(2,-10*a/d)+1)+b},easeOutCirc:function(a,b,c,d){return c*Math.sqrt(1-(a=a/d-1)*a)+b},easeOutElastic:function(a,b,c,d){var e=1.70158,f=0,g=c;if(0==a)return b;if(1==(a/=d))return b+c;f||(f=.3*d);g<Math.abs(c)?(g=c,e=f/4):e=f/(2*Math.PI)*Math.asin(c/g);return g*Math.pow(2,-10*a)*Math.sin(2*(a*
d-e)*Math.PI/f)+c+b},easeOutBack:function(a,b,c,d,e){void 0==e&&(e=1.70158);return c*((a=a/d-1)*a*((e+1)*a+e)+1)+b},easeOutBounce:function(a,b,c,d){return(a/=d)<1/2.75?7.5625*c*a*a+b:a<2/2.75?c*(7.5625*(a-=1.5/2.75)*a+.75)+b:a<2.5/2.75?c*(7.5625*(a-=2.25/2.75)*a+.9375)+b:c*(7.5625*(a-=2.625/2.75)*a+.984375)+b},easeInOutQuad:function(a,b,c,d){return 1>(a/=d/2)?c/2*a*a+b:-c/2*(--a*(a-2)-1)+b},easeInOutCubic:function(a,b,c,d){return 1>(a/=d/2)?c/2*a*a*a+b:c/2*((a-=2)*a*a+2)+b},easeInOutQuart:function(a,
b,c,d){return 1>(a/=d/2)?c/2*a*a*a*a+b:-c/2*((a-=2)*a*a*a-2)+b},easeInOutQuint:function(a,b,c,d){return 1>(a/=d/2)?c/2*a*a*a*a*a+b:c/2*((a-=2)*a*a*a*a+2)+b},easeInOutSine:function(a,b,c,d){return-c/2*(Math.cos(Math.PI*a/d)-1)+b},easeInOutExpo:function(a,b,c,d){return 0==a?b:a==d?b+c:1>(a/=d/2)?c/2*Math.pow(2,10*(a-1))+b:c/2*(-Math.pow(2,-10*--a)+2)+b},easeInOutCirc:function(a,b,c,d){return 1>(a/=d/2)?-c/2*(Math.sqrt(1-a*a)-1)+b:c/2*(Math.sqrt(1-(a-=2)*a)+1)+b},easeInOutElastic:function(a,b,c,d){var e=
1.70158,f=0,g=c;if(0==a)return b;if(2==(a/=d/2))return b+c;f||(f=.3*d*1.5);g<Math.abs(c)?(g=c,e=f/4):e=f/(2*Math.PI)*Math.asin(c/g);return 1>a?-.5*g*Math.pow(2,10*--a)*Math.sin(2*(a*d-e)*Math.PI/f)+b:g*Math.pow(2,-10*--a)*Math.sin(2*(a*d-e)*Math.PI/f)*.5+c+b},easeInOutBack:function(a,b,c,d,e){void 0==e&&(e=1.70158);return 1>(a/=d/2)?c/2*a*a*(((e*=1.525)+1)*a-e)+b:c/2*((a-=2)*a*(((e*=1.525)+1)*a+e)+2)+b}},t=function(a){return a[0]},I=function(a){return a.reduce(function(a,c){return a.concat(c)})},
n=function(){return Array.prototype.includes?function(a,b){return a.includes(b)}:function(a,b){return a.some(function(a){return a===b})}}(),A=function(a){for(var b=arguments.length,c=Array(1<b?b-1:0),d=1;d<b;d++)c[d-1]=arguments[d];var e=I(c);return a.filter(function(a){return r(n)(e,a)})},p=function(){return Array.from?function(a){return Array.from(a.keys())}:function(a){var b=[];a.forEach(function(a,d){return b.push(d)});return b}}(),J=function(){var a=function(a){var c=new Map;Object.keys(a).forEach(function(d){return c.set(d,
a[d])});return c};return function(b){return b instanceof Map?b:a(b)}}(),h=function(){try{if(!(new Map((new Map).set(null,null))).size)throw Error();}catch(a){return function(a){var c=new Map;a.forEach(function(a,b){return c.set(b,a)});return c}}return function(a){return new Map(a)}}(),K=function(a){return/^#/.test(a)},B=function(a){return/^rgb/.test(a)},L=function(){var a=function(a){return 7>a.length?a.split("").reduce(function(a,b){return a+b+b}):a},b=function(a){return a.match(/[\d\w]{2}/g).map(function(a){return parseInt(a,
16)})};return function(c){if(B(c))return c;c=q(a,b)(c);return"rgb("+c[0]+", "+c[1]+", "+c[2]+")"}}(),C=function(a){a="string"==typeof a?/^[\#.]?[\w-]+$/.test(a)?"."==a[0]?document.getElementsByClassName(a.slice(1)):"#"==a[0]?document.getElementById(a.slice(1)):document.getElementsByTagName(a):document.querySelectorAll(a):a;return Array.isArray(a)?a:a.nodeType?[a]:a instanceof NodeList||a instanceof HTMLCollection?[].concat(y(a)):a.get()},k=new Map;"el delay begin complete loop direction".split(" ").forEach(function(a){return k.set(a,
null)});k.set("duration",1E3);k.set("easing","easeOutElastic");var M=function(){var a=p(k).filter(function(a){return k.get(a)}),b=function(b){return a.every(function(a){return b.has(a)})},c=function(b){var c=h(b);a.forEach(function(a){c.has(a)||c.set(a,k.get(a))});return c};return function(a){return b(a)?a:c(a)}}(),N=function(){var a=m(function(a,b){return Array.isArray(a.get(b))}),b=function(b){return u(b).every(a(b))},c=function(b){return u(b).filter(r(a(b)))};return function(a){if(b(a))return a;
var e=h(a);c(e).forEach(function(a){return e.set(a,[D.get(a),e.get(a)])});return e}}(),O=function(){var a=m(function(a,b){return a.get(b).some(K)}),b=function(b){return!E(b).some(a(b))},c=function(b){return E(b).filter(a(b))};return function(a){if(b(a))return a;var e=h(a);c(a).forEach(function(a){return e.set(a,e.get(a).map(L))});return e}}(),F=function(a){var b=h(a);v(a).forEach(function(a){return b.set(a,b.get(a).slice().reverse())});return b},P=q(J,M,N,O,function(a){var b=h(a);b.set("el",C(a.get("el")));
return b},function(a){return"reverse"==a.get("direction")?F(a):a}),v=function(){var a=p(k),b=function(b){return r(n)(a,b)};return function(a){return p(a).filter(b)}}(),S=function(){var a=q(t,B),b=m(function(b,d){var e=b.get(d).map(Q),f=new Map;f.set("prop",d);f.set("from",e[0]);f.set("to",t(e.slice(-1)));f.set("isTransformFunction",R(d));f.set("isColor",f.get("isTransformFunction")?!1:a(b.get(d)));return f});return function(a,d){return v(a).map(b(a))}}(),u=function(){var a=function(a){return n(w,
a)};return function(b){return p(b).filter(a)}}(),E=function(a){return A(v(a),u(a))},w=(z=["opacity","skewX","skewY","perspective"]).concat.apply(z,y(["translate","scale","rotate"].map(function(a){return["X","Y","Z"].map(function(b){return a+b})}))),D=new Map;w.forEach(function(a){return D.set(a,n(["opacity","scaleX","scaleY"],a)?1:0)});var R=function(){var a=w.filter(function(a){return"opacity"!=a});return function(b){return n(a,b)}}(),U=function(a,b){return a.reduce(function(a,d,e){d=d+"("+T(d,b[e])+
")";return a?a+" "+d:d},null)},T=function(){return function(a,b){return/\D$/.test(b)||/scale/.test(a)?b:/rotate|skew/.test(a)?b+"deg":b+"px"}}(),V=function(a,b){return b.reduce(function(b,d,e){return b+a[e-1]+d})},Q=function(){var a=/-?\d*\.?\d+/g;return function(b){var c=new Map;c.set("digits",("string"==typeof b?b:String(b)).match(a).map(Number));c.set("others",("string"==typeof b?b:String(b)).split(a));return c}}(),W=m(function(a,b,c){var d=c.get("to").get("digits").map(function(d,f){var g=c.get("from").get("digits")[f];
if(g==d)return g;var G=d-g,g=H[a.get("easing")](b,g,G,a.get("duration"));return c.get("isColor")?Math.round(g):g});return V(d,c.get("to").get("others"))}),X=m(function(a,b){var c=a.get(b.get("prop"));return t(c.slice(-1))}),Y=function(){var a=void 0;return m(function(b,c,d){var e=void 0;b.forEach(function(a,b){a.get("isTransformFunction")?(e||(e=new Map,e.set("functions",[]),e.set("values",[])),e.get("functions").push(a.get("prop")),e.get("values").push(c[b])):"opacity"==a.get("prop")?d.style.opacity=
c[b]:d.setAttribute(a.get("prop"),c[b])});e&&(a||(a="transform"in document.body.style?"transform":"-webkit-transform"),d.style[a]=U(e.get("functions"),e.get("values")))})}(),Z=function(){var a=function(a,c){c.get("begin")&&c.get("begin")(c.get("el"));requestAnimationFrame(a)};return function(b,c){return c.get("delay")?setTimeout(function(){return a(b,c)},c.get("delay")):a(b,c)}}(),aa=function(a){return x(function(){if("alternate"==a.get("direction"))return F(a);if("reverse"==a.get("direction")){var b=
h(a);b["delete"]("direction");return b}return a}())},l=new Map,ba=function(){var a=0;return function(b){var c=a++,d=h(l);d.set(c,b);l=d;return c}}(),x=function(a){var b=P(a),c=S(b),d=ba(b.get("el")),e=new Map;Z(function g(a){if(l.has(d)){e.has("start")||e.set("start",a);e.set("elapsed",a-e.get("start"));a=e.get("elapsed")<b.get("duration");var k=c.map(a?W(b,e.get("elapsed")):X(b));l.get(d).forEach(Y(c,k));a?requestAnimationFrame(g):(a=h(l),a["delete"](d),l=a,b.get("complete")&&b.get("complete")(b.get("el")),
b.get("loop")&&aa(b))}},b)};x.stop=function(a){var b=C(a),c=h(l);c.forEach(function(a,e){var f=A(a,b);f.length?c.set(e,f):c["delete"](e)});l=c};return x}();"undefined"!=typeof module&&module.exports&&(module.exports=animate);


/* demo code */

(function () {
  var size = {w: 273, h: 264};
  var mouse = {x: 0, y: 0};
  var controls = {
    button: document.querySelector('button'),
    size: document.querySelector('input[type=number]'),
    color: document.querySelector('input[type=color]')
  };

  var canvas = document.querySelector('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = size.w;
  canvas.height = size.h;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  canvas.addEventListener('mousemove', function(e) {
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
  }, false);

  canvas.addEventListener('mousedown', function(e) {
    ctx.beginPath();
    ctx.moveTo(mouse.x, mouse.y);
    canvas.addEventListener('mousemove', onPaint, false);
  }, false);

  window.addEventListener('mouseup', function() {
    canvas.removeEventListener('mousemove', onPaint, false);
  }, false);
  
  controls.button.addEventListener('click', function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  var onPaint = function () {
    ctx.lineWidth = controls.size.value;
    ctx.strokeStyle = controls.color.value;
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();
  };

  var body = document.querySelector('.scene');
  var divs = document.querySelectorAll('.body div');
  var checkbox = document.getElementById('checkbox');
  
  var urls = {
    element: '-moz-element(#canvas)',
    elementVideo: '-moz-element(#video)',
    canvas: '-webkit-canvas(cssCanvas)',
    gif: 'url(http://imgs.iamvdo.me/london.gif)'
  };
  var bgP = 0;
  var t;
  
  [].forEach.call(divs, function (el) {
    var s1 = document.createElement('span');
    s1.className = 'image';
    // browsers that don't support -moz-element
    s1.style.backgroundImage = urls.gif;
    // browsers that do support -moz-element
    s1.style.backgroundImage = urls.element + ',' + urls.elementVideo;
    s1.style.backgroundPosition = '0 -' + bgP + 'px';
    
    var s2 = document.createElement('span');
    s2.className = 'back';
    
    el.appendChild(s1);
    el.appendChild(s2);
    
    bgP += el.clientHeight;
  });

  function goAnim (e, reverse) {
    if (reverse === undefined) {
      [].forEach.call(divs, function (el) {
        animate.stop(el);
        animate({
          el: el,
          rotateZ: [0, 5],
          duration: 400,
          easing: 'easeOutBack'
        });
      });
    } else {
      [].forEach.call(divs, function (el) {
        animate.stop(el);
        animate({
          el: el,
          rotateZ: [5, -5],
          duration: 200,
          easing: 'linear',
          complete: complete
        });
        function complete (el) {
          animate.stop(el);
          animate({
            el: el,
            rotateZ: [-5, 0],
            duration: 1500
          });
        }
      });
    }
  }
  function goAnimReverse (e) { 
    goAnim(e, true);
  }
  function addHoverEvents () {
    body.addEventListener('mouseenter', goAnim);
    body.addEventListener('mouseleave', goAnimReverse);
  }
  function removeHoverEvents () {
    body.removeEventListener('mouseenter', goAnim);
    body.removeEventListener('mouseleave', goAnimReverse);
  }
  function startAnimation () {
    goAnim();
    setTimeout(function() {
      goAnim({}, true);
    }, 400);
  }
  
  addHoverEvents();

  checkbox.addEventListener('change', function (e) {
    if (!e.target.checked) {
      addHoverEvents();
      clearInterval(t);
    } else {
      removeHoverEvents();
      startAnimation();
      t = setInterval(function() {
        startAnimation(); 
      }, 2000);
    }
  });
  
}());