const hearts = document.querySelectorAll(".heart");
const circs = document.querySelectorAll(".circ");
const rects = document.querySelectorAll(".rect");

TweenLite.defaultEase = Back.easeOut.config(2);

let tlr = new TimelineMax({repeat: -1});
tlr.to("#shapey", 40, {rotation:180, ease: Power0.easeNone});

let tls = new TimelineMax();
tls.add("start");
tls.add(morphy(0), "start");
tls.add(morphy(1), "start+=0.05");
tls.add(morphy(2), "start+=0.1");
tls.add(morphy(3), "start+=0.15");

function morphy(i) {
  let tl = new TimelineMax({repeat: -1});
  tl.to(hearts[i], 1, {morphSVG:circs[i]});
  tl.to(hearts[i], 1, {morphSVG:rects[i]});
  tl.to(hearts[i], 1, {morphSVG:circs[i]});
  tl.to(hearts[i], 1, {morphSVG:hearts[i]});
  return tl;
}
