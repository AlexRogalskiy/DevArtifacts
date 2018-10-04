var tris = [].slice.call(document.querySelectorAll('.tri'));
tris = tris.reverse();
var container = document.querySelector('#triangle');

TweenMax.set(tris, {transformOrigin: '50%, 65%'});
TweenMax.set(container, {visibility:"visible"});


tlr = new TimelineMax({repeat:-1});
tlr.to(container, 10, {rotation:"+=360", ease:Power0.easeNone});
tlr.timeScale(.5);

tls = new TimelineMax({repeat:-1, yoyo:true});
tls.add("scale");
  for (var i=0; i < tris.length-1; i++) {
    tls.to(tris[i], .95, {scale: .2+(i/5), ease: Circ.easeOut}, 'scale+i/10');
  }
tls.to({},.85,{});
tls.timeScale(.8);


    
