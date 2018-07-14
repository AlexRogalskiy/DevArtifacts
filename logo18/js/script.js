var GSAP = function() {
  
  var pineconeTl = new TimelineLite(),
  pineconeLogo = $('.powered_by_pinecone svg'),
  pineconeEls = pineconeLogo.find('path[id*="cone"]'),
  pineconeType = pineconeLogo.find('path[id*="type"]'),
  pineconePlay = pineconeLogo.find('path[id="play"]'),
  pineconeSpan = $('.powered_by_pinecone span');
  
  TweenLite.set([pineconeLogo, pineconeSpan], {
    visibility: 'visible'
  });
  TweenLite.set(pineconeSpan, {
    x: 7
  });

  // timeline animations pines, type and "powered by"
  pineconeTl.timeScale(0.65);
  pineconeTl.staggerFrom(pineconeEls, 0.2, {
    transformOrigin: 'center',
    scale: 0,
    autoAlpha: 0,
    y: 150,
    ease: Back.easeOut.config(3)
  }, 0.05);
  pineconeTl.staggerFrom(pineconeType, 0.2, {
    transformOrigin: 'center',
    scale: 0,
    autoAlpha: 0,
    rotationX: -180,
    y: 150,
    ease: Back.easeOut.config(4)
  }, 0.05, '-=0.25');
  pineconeTl.from(pineconeSpan, 0.8, {
    autoAlpha: 0,
    y: 30,
    scaleY: 0,
    ease: Elastic.easeOut.config(1.5, 0.4)
  }, '-=0.45');

  pineconeLogo.on('mouseenter', function() {
    TweenLite.to(pineconePlay, 0.3, {
      transformOrigin: 'center',
      autoAlpha: 1,
      scale: 1,
      ease: Back.easeOut.config(3)
    });
    TweenLite.to([pineconeType, pineconeSpan, pineconeEls], 0.5, {
      opacity: 0.5
    });
    pineconeLogo.click(function() {
      TweenLite.set([pineconeType, pineconeSpan, pineconeEls], {
        opacity: 1
      });
      pineconeTl.restart();
      TweenLite.to(pineconePlay, 0.3, {
        transformOrigin: 'center',
        autoAlpha: 0,
        scale: 0
      });
    });
  });

  pineconeLogo.on('mouseleave', function() {
    TweenLite.to(pineconePlay, 0.3, {
      transformOrigin: 'center',
      autoAlpha: 0,
      scale: 0
    });
    TweenLite.to([pineconeType, pineconeSpan, pineconeEls], 0.3, {
      opacity: 1
    });
  });
};

$(document).on('ready', function() {
  GSAP();
});