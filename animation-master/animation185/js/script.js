var sun = document.createElement("div");
    sun.setAttribute("id","sun");
    document.body.appendChild(sun);

for(var i=0; i<=200; i++){
  var size = Math.round(Math.random()*3,2);
  var star = document.createElement("div");
      star.style.position = 'absolute';
      star.style.backgroundColor = '#ffffff';
      star.style.width = star.style.height = size +"px";
      star.style.borderRadius = size/2 +"px";
      star.style.boxShadow = "0px 0px "+Math.round(Math.random()*30)+"px #ffffff";
      star.style.top = Math.round(Math.random()*window.innerHeight)-5 + "px";
      star.style.left = Math.round(Math.random()*window.innerWidth)-5 + "px";
  document.body.appendChild(star);
}