function init(){
  var logo = d3.selectAll(".logo_aaa"),
      line = logo.selectAll('.lines path'),
      logoTL = new TimelineLite();
  
    TweenLite.set(line, {drawSVG: 0});
    logoTL.to(line[0][0], 1, {drawSVG:'100%', autoAlpha: 1}, 0)
    logoTL.to(line[0][1], 1, {drawSVG:'100%', autoAlpha: 1}, .4)
    logoTL.to(line[0][2], 1, {drawSVG:'100%', autoAlpha: 1}, .7)
    logoTL.to(line[0][3], 1, {drawSVG:'100%', autoAlpha: 1}, 1)
    logoTL.to(line[0][4], 1, {drawSVG:'100%', autoAlpha: 1}, 1.1)
    logoTL.to(line[0][5], 1, {drawSVG:'100%', autoAlpha: 1}, 1.3)
    logoTL.to(line[0][6], 1, {drawSVG:'100%', autoAlpha: 1}, 1.6)
    logoTL.to(line[0][7], 1, {drawSVG:'100%', autoAlpha: 1}, 1.9)
    logoTL.to(line[0][8], 1, {drawSVG:'100%', autoAlpha: 1}, 2.1)
    logoTL.to(line[0][9], 1, {drawSVG:'100%', autoAlpha: 1}, 2.3)
  
}


init();

