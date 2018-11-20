let currentIndex, prevIndex, currentAnimation;
let isAnimating = false;
const sequences = [];
const planets = Array.prototype.slice.call(document.querySelectorAll(".planet"));
const range = document.getElementById("range");
const label = document.getElementById("label-curr");
const labelPrev = document.getElementById("label-prev");
const planetNames = [
  "Uranus",
  "Mars",
  "Earth",
  "Moon"
];
const planetColors = [
  '#3FB4C0',
  '#FF5B25',
  '#7DCCF3',
  '#EBF3FF'
];

// timings for the different planet parts
const timings = {
  background: {
    fill: "forwards",
    duration: 800,
    direction: "normal",
    easing: "cubic-bezier(0.2, 0, .3, 1.5)"
  },
  planet: {
    fill: "none",
    duration: 800,
    direction: "normal",
    easing: "cubic-bezier(.5, 0, .3, 1)"
  },
  particles: {
    fill: "forwards",
    duration: 250,
    direction: "normal",
    easing: "cubic-bezier(.5, 0, .5, 2)"
  },
  radius: {
    fill: "forwards",
    duration: 500,
    direction: "normal",
  }
};

// different effects to use for the planets
const effects = {
  scale: [
    { transform: "scale(0.74)", opacity: 0 },
    { transform: "scale(1)", opacity: 1 }
  ],
  scaleTop: [
    { transform: "translate(-50%, -100%) scale(0.6)", opacity: 0 },
    { transform: "translate(-50%, -50%)  scale(1)", opacity: 1 }
  ],
  fadeInLeft: [
    { transform: "translate(-100%, 0%) scale(0.6)", opacity: 0 },
    { transform: "translate(0, 0)  scale(1)", opacity: 1 }
  ],
  fadeInRight: [
    { transform: "translate(100%, 0%) scale(0.6)", opacity: 0 },
    { transform: "translate(0, 0)  scale(1)", opacity: 1 }
  ],
  fadeOutLeft: [
    { transform: "translate(0, 0)  scale(1)", opacity: 1 },
    { transform: "translate(-100%, 0%) scale(0.6)", opacity: 0 }
  ],
  fadeOutRight: [
    { transform: "translate(0, 0)  scale(1)", opacity: 1 },
    { transform: "translate(100%, 0%) scale(0.6)", opacity: 0 }
  ],
  opacity: [{ opacity: 0 }, { opacity: 1 }]
};

// create the fadeIn effect for the planet
function createFadeInEffect({ el, direction }) {
  const fadeIn = direction === "left"
    ? effects.fadeInLeft
    : effects.fadeInRight;
  const bg = el.querySelector(".background");
  const radius = Array.prototype.slice.call(el.querySelectorAll(".radius"));
  const particles = Array.prototype.slice.call(
    el.querySelectorAll(".particle")
  );
  const particleEffects = [];
  const radiusEffects = [];

  particles.map(el => {
    const effect = new KeyframeEffect(el, effects.scale, timings.particles);
    particleEffects.push(effect);
  });

  radius.map(el => {
    const effect = new KeyframeEffect(el, effects.opacity, timings.radius);
    radiusEffects.push(effect);
  });

  const sequence = new SequenceEffect([
    new KeyframeEffect(bg, fadeIn, timings.background),
    ...particleEffects,
    ...radiusEffects
  ]);

  return sequence;
}

// create the fade out effect for the planet
function createFadeOutEffect({ el, direction }) {
  const fadeOut = direction === "left"
    ? effects.fadeOutLeft
    : effects.fadeOutRight;
  const effect = new KeyframeEffect(el, fadeOut, timings.planet);
  return effect;
}

// create all the effects for the planets
planets.map(planet => {
  const inLeft = createFadeInEffect({ el: planet, direction: "left" });
  const inRight = createFadeInEffect({ el: planet, direction: "right" });
  const outLeft = createFadeOutEffect({ el: planet, direction: "left" });
  const outRight = createFadeOutEffect({ el: planet, direction: "right" });
  sequences.push({ inLeft, inRight, outLeft, outRight });
});

// timings for the label of the range element
const timingsLabel = {
  in: {
    fill: "forwards",
    duration: 1000,
    direction: "normal",
    easing: "cubic-bezier(.5, 0, .5, 1)"
  },
  out: {
    fill: "forwards",
    duration: 900,
    direction: "normal",
    easing: "cubic-bezier(.5, 0, .5, 1)"
  }
};

// effect for the label of the range element
const effectsLabel = {
  fadeInLeft: [
    { transform: "translate(-150%, -50%) scale(0.5)", opacity: 0 },
    { transform: "translate(-50%, -50%) scale(1)", opacity: 1 }
  ],
  fadeInRight: [
    { transform: "translate(50%, -50%) scale(0.5)", opacity: 0 },
    { transform: "translate(-50%, -50%) scale(1)", opacity: 1 }
  ],
  fadeOutLeft: [
    { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
    { transform: "translate(-150%, -50%) scale(0.5)", opacity: 0 }
  ],
  fadeOutRight: [
    { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
    { transform: "translate(50%, -50%) scale(0.5)", opacity: 0 }
  ]
};

// animation to play when range is updated
const labelAnimations = {
  inLeft: new GroupEffect([
    new KeyframeEffect(labelPrev, effectsLabel.fadeOutRight, timingsLabel.out),
    new KeyframeEffect(label, effectsLabel.fadeInLeft,  timingsLabel.in)
  ]),
  inRight: new GroupEffect([
    new KeyframeEffect(labelPrev, effectsLabel.fadeOutLeft,  timingsLabel.out),
    new KeyframeEffect(label, effectsLabel.fadeInRight,  timingsLabel.in)
  ])
};

// main function calling all the things on update
function updateSlider(index) {
  // only animate if no animation is running
  if (!isAnimating) {
    const prevLabel = label.getAttribute("data-planet");
    const direction = index > prevIndex ? 1 : 0;
    prevIndex = index;
    
    label.setAttribute("data-planet", planetNames[index]);
    label.setAttribute("data-prev", index);
    labelPrev.setAttribute("data-planet", prevLabel);
    playAnimation(index, direction);
  } else {
    setTimeout(() => updateSlider(index), 800)
  }
}

// playing the right animation depending on the update direction
function playAnimation(index, direction) {
  const label = direction ? labelAnimations.inLeft : labelAnimations.inRight;
  const sequence = direction ? sequences[index].inLeft : sequences[index].inRight;

  // play the label animation
  isAnimating = true;
  document.timeline.play(label);

  // get the planet animation and pause until fade out complete
  let planetAnim = document.timeline.play(sequence);
  setAnimation(planetAnim, index);
  
  // update range thumb color
  range.style.setProperty(`--planet-color`, planetColors[index]);
  
  // if another planet is already visible
  if (currentIndex) {
    // play the fade out animation
    const outSequence = direction ? sequences[currentIndex].outRight : sequences[currentIndex].outLeft;
    let outAnim = document.timeline.play(outSequence);

    // play the current animation, when the out animation is finished
    outAnim.onfinish = () => {
      currentAnimation.cancel();
      planetAnim.play()
    };
  } else {
    planetAnim.play()
  }
}

function setAnimation(animation, index) {
  animation.currentTime = 0;
  animation.pause();
  animation.onfinish = () => {
    currentIndex = index;
    currentAnimation = animation;
    isAnimating = false;
  };
}


// add eventListener with lodash debounce
range.addEventListener(
  "input",
  _.debounce(e => updateSlider(e.target.value), 300)
);

updateSlider('0');