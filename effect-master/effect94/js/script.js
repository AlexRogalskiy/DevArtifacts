var view = $('.view');
var parent = $('.ls-slide');
var imgs = parent.find('.imageFX--perspective');
var scene = $('<div class="scene"></div>');
//scene.prepend(imgs);
//parent.append(scene);

//TweenLite.set(view, { css: { transformPerspective: 1500, perspective: 1500, transformStyle: "preserve-3d" }});

TweenLite.set( $('.ls-slide'), { 
    css: { 
        transformPerspective:1500,
        transformStyle: "preserve-3d",
        //transformOrigin: "50% 50% 0",
        ///x: 0,
        ///y: -555,
        ///z: -1855,
        ///rotationX: 45,
       /// rotationY: 0,
        ///rotationZ: -25,
        //scaleX: 0.5,
        //scaleY: 0.5,
    } 
});

TweenLite.set(imgs, { 
    css: { 
        transformOrigin: "50% 50% 0",
        x: '15%',
        y: '25%',
        rotationX: 0,
        rotationZ: 0,
        scaleX: 0.75,
        scaleY: 0.75,
      } 
});


var t1 = new TimelineLite( {repeat:2});
t1.from($('.imageFX--perspective.img1'), 5, { css: {rotationX:'360'}, delay:0.2 })
  .from($('.imageFX--perspective.img2'), 1, { css: {rotationX:'360'}, delay:0.4 });
//t1.pause();





