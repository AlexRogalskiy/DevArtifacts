 /*

 author: Marco Barría
 devDependencies:
   - GSAP TweenMax https://greensock.com/tweenmax (Necessary for animation.)
   - GSAP Draggable
   - NO jQuery

 */

 var _preload = document.querySelector('.preload'),
   _world = document.querySelector('.container-bike'),
   _back = document.querySelector('.background'),
   _tree = document.querySelectorAll('.tree'),
   _bike = document.querySelector('.bike'),
   _headerCyclo = document.querySelector('.body-box'),
   _legsRight = document.querySelector('.legs-right'),
   _legsLeft = document.querySelector('.legs-left'),
   _legsRightPart = document.querySelector('.legs-part'),
   _wheel = document.querySelectorAll('.wheel'),
   _wheelParticle = document.querySelectorAll('.wheel-particle > div');

 TweenMax.set([_wheel, _world], {
   transformOrigin: '50% 50%'
 });

 TweenMax.set(_tree, {
   transformOrigin: '50% 100%'
 });

 var initAnimation = function initAnimation() {

   function initText() {
     var tl = new TimelineMax();
     tl.to(_preload, 1, {
       alpha: 0,
       ease: Power2.easeOut,
       onComplete: function() {
         _preload.style.display = "none";
       }
     })
     return tl;
   }

   function initTree() {
     var tl = new TimelineMax();
     tl.staggerFromTo(_tree, 1, {
       opacity: 0,
       y: 400,
       force3D: true,
       scale: 0,
     }, {
       opacity: 1,
       y: 0,
       scale: 1,
       force3D: true,
       ease: Elastic.easeOut.config(0.9, 0.7)
     }, 0.2);
     return tl;
   }

   function initBike() {
     var tl = new TimelineMax();
     tl.fromTo(_bike, 1, {
       opacity: 0,
       x: -500,
       force3D: true,
       ease: Power2.easeIn
     }, {
       opacity: 1,
       x: 0,
       force3D: true,
       ease: Power2.easeOut
     })
     return tl;
   }

   var masterInit = new TimelineMax({
     onStart: function() {
       init();
     }
   });
   masterInit.add(initText(), "+=3", "scene1")
     .add(initTree(), "scene2")
     .add(initBike(), "-=1.5", "scene3");
   masterInit.timeScale(1);

 };

 var init = function init() {

   function cyclo(el, value1, value2) {
     var tl = new TimelineMax();
     tl.to(el, 1, {
         rotation: value1,
         force3D: true,
         ease: Power0.easeNone,
       })
       .to(el, 1, {
         rotation: value2,
         force3D: true,
         ease: Power0.easeNone
       });
     return tl;
   }

   function headerCyclo(r) {
     TweenMax.to(_headerCyclo, 0.5, {
       rotation: r,
       ease: Power2.easeOut
     })
   }

   function backgroundMove() {
     var tl = new TimelineMax();
     tl.to(_back, 8, {
       x: -50 + '%',
       force3D: true,
       ease: Power0.easeNone
     });
     return tl;
   }

   function rotateTree(n) {
     TweenMax.set(_tree, {
       rotation: n
     });
   }

   function leftRightBike(v) {
     TweenMax.to(_bike, 1, {
       x: v,
       ease: Power2.easeOut
     })
   }

   function rotateWheel() {
     var tl = new TimelineMax();
     tl.to(_wheel, 1, {
       rotation: 360,
       ease: Power0.easeNone
     });
     return tl;
   }

   function wheelParticle() {
     var tl = new TimelineMax();
     tl.staggerFromTo(_wheelParticle, 0.4, {
       opacity: 0,
       x: 0,
       y: 0,
       force3D: true,
       scale: 1,
     }, {
       opacity: 1,
       x: -40,
       y: -10,
       scale: 0.3,
       force3D: true,
       ease: Power0.easeNone
     }, 0.2);
     return tl;
   }

   // MASTER SCENES

   var cyclist = new TimelineMax({
     repeat: -1,
     repeatDelay: 0
   });

   cyclist.add(cyclo(_legsRight, -65, -30), "scene1")
     .add(cyclo(_legsLeft, -30, -65), "-=2");
   cyclist.timeScale(1);

   var master = new TimelineMax({
     repeat: -1,
     repeatDelay: 0
   });

   master.add(rotateWheel(), "scene1");
   master.timeScale(1);

   var backMaster = new TimelineMax({
     repeat: -1,
     repeatDelay: 0
   });

   backMaster.add(backgroundMove(), "scene1");
   backMaster.timeScale(1);

   var particleMaster = new TimelineMax({
     repeat: -1,
     paused: true
   });

   particleMaster.add(wheelParticle(), "scene1");
   particleMaster.timeScale(1);

   function bikeVelocity(obj) {
     leftRightBike((_world._gsTransform.rotation * 4));
     rotateTree(-(_world._gsTransform.rotation));
     if (_world._gsTransform.rotation < 0) {
       cyclist.timeScale((_world._gsTransform.rotation / 10) + 1);
       master.timeScale(Math.abs((-(_world._gsTransform.rotation / obj.maxX) - 1)));
       backMaster.timeScale(Math.abs((-(_world._gsTransform.rotation / obj.maxX) - 1)));
       particleMaster.pause(0);
       headerCyclo(_world._gsTransform.rotation);
     } else if (_world._gsTransform.rotation > 0) {
       particleMaster.play(0);
       cyclist.timeScale((_world._gsTransform.rotation / 10) + 1);
       master.timeScale((_world._gsTransform.rotation / 10) + 1);
       backMaster.timeScale((_world._gsTransform.rotation / 10) + 1);
       headerCyclo(-(_world._gsTransform.rotation));
     }
   }

   Draggable.create(_world, {
     type: "rotation",
     bounds: {
       minRotation: -40,
       maxRotation: 40
     },
     onDrag: function() {
       bikeVelocity(this);
     },
     onRelease: function() {
       TweenMax.to(_world, 2, {
         rotation: 0,
         ease: Elastic.easeOut.config(0.5, 0.7)
       });
       master.timeScale(1);
       cyclist.timeScale(1);
       backMaster.timeScale(1);
       particleMaster.pause(0);
       leftRightBike(0);
       headerCyclo(0);
       TweenMax.to(_tree, 2, {
         rotation: 0,
         ease: Elastic.easeOut.config(0.5, 0.7)
       })
     }
   });

 };

 window.onload = initAnimation;