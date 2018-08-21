TweenLite.set('circle', {drawSVG: '0'});
TweenLite.defaultEase = Sine.easeInOut;

var duration = 1.25,
    ctl = new TimelineMax({repeat: -1}),
    ptl = new TimelineMax({repeat: -1, yoyo: true});

ptl.add( TweenMax.fromTo('p', duration/2, {opacity: 1}, {opacity: 0.65}) );

$('circle').each(function(index, el){
  var offset = $(el).data('offset');
  ctl.add(arc(el, (duration - offset)), offset);
});

function arc(circle, duration) {
  var tl = new TimelineLite();
  tl.to(circle, duration*0.9, {drawSVG: '90% 100%'})
    .to(circle, duration*0.1, {drawSVG: '99.75% 100%'});
  return tl;
}