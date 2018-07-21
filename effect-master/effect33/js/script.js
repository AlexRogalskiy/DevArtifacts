function on(events, className, handler) {
  if(Array.isArray(events)) {
    events.forEach(event => addListener(event))
  } else {
    addListener(events);
  }
  function addListener(event) {
    document.addEventListener(event, function(e) {
      for (let target=e.target; target && target!=this; target=target.parentNode) {
        if (target.classList.contains(className)) {
          handler.call(target, e);
          break;
        }
      }
    }, false);
  }
}

on(['mouseover', 'touchstart'], 'tilt', function(e) {
  console.log('in');
  this.classList.remove('demo');
  this.style.zIndex = 1;
});
on(['mouseout', 'touchend'], 'tilt', function(e) {
  console.log('out');
  this.classList.add('demo');
  this.style.zIndex = 0;
});
on(['mousemove', 'touchmove'], 'tilt', function(e) {
  let target = e.target;
  let offsetX, offsetY;
  if(e.type === 'touchmove') {
    let touch = e.targetTouches[0];
    [offsetX, offsetY] = [touch.clientX - target.x, touch.clientY - target.y];
  } else {
    [offsetX, offsetY] = [e.offsetX, e.offsetY];
  }
  let [rotY, rotX] = [
    (0.5 - offsetX / target.clientWidth) * target.clientWidth,
    (offsetY / target.clientHeight - 0.5) * target.clientHeight
  ].map(rotate => rotate * 20 / target.clientWidth);
  this.style.transform = `perspective(300px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3D(1.1, 1.1, 1.1)`;
  // console.log(rotX, rotY);
});

let speechSynth = window.speechSynthesis;
// Chrome loads voices asynchronously.
let voices, voice;
speechSynth.onvoiceschanged = function(e) {
  voices = window.speechSynthesis.getVoices();
  // voices = voices.filter(v => /^en-/.test(v.lang));
  voice = voices[0];
};

on(['click', 'touchstart'], 'tilt', function(e) {
  if(!voice) return;
  
  let target = e.target;
  let offsetX, offsetY;
  if(e.type === 'touchstart') {
    let touch = e.targetTouches[0];
    [offsetX, offsetY] = [touch.clientX - e.target.x, touch.clientY - e.target.y];
  } else {
    [offsetX, offsetY] = [e.offsetX, e.offsetY];
  }
  let [rate, pitch] = [
    offsetX / target.clientWidth,
    (1 - offsetY / target.clientHeight) * 2];
  let utterance = new SpeechSynthesisUtterance(this.dataset['msg']);
  // utterance.lang = 'en-US';
  utterance.voice = voices[Math.floor(Math.random() * voices.length)];
  utterance.rate = Math.max(0.1, Math.min(rate * 2.4, 2.0));// between 0.1 (lowest) and 2 (highest)
  utterance.pitch = pitch;// between 0 (lowest) and 2 (highest)
  // console.log(utterance.pitch, utterance.rate);
  if (speechSynth.speaking === true) {
    speechSynth.cancel();
  }
  speechSynth.speak(utterance);
  
  document.getElementById('message').textContent = this.dataset['msg'];
  document.body.style.background = '#' + Math.floor(Math.random() * 16777215 ).toString(16);
});
