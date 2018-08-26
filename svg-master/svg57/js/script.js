const left = document.getElementById("Logo-left")
const right = document.getElementById("Logo-right")
const bottom = document.getElementById("Logo-bottom")

const speed = 2
const duration = 0.8
const run = () => {
  TweenLite.to(bottom, duration, { fillOpacity: 0 });
  TweenLite.to(right, duration, { fillOpacity: 0, delay: 0.6 / speed});
  TweenLite.to(left, duration, { fillOpacity: 0, delay: 1.2 / speed });
  
  TweenLite.to(bottom, duration, { fillOpacity: 1, delay: 4.2 / speed})
  TweenLite.to(left, duration, { fillOpacity: 1, delay: 3 / speed})
  TweenLite.to(right, duration, { fillOpacity: 1, delay: 3.6 / speed})
};

const button = document.getElementById("Run")
button.onclick = run;