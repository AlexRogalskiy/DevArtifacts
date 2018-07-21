const EASING = 'easeInOutCubic'
const STAGE = document.querySelector('.stage')
const timeline = anime.timeline({
  loop: true,
  // toggles display of middle and small squares
  update (anim) {
    const CLASS_NAME = 'middle-moving'
    const hasClass = ~STAGE.className.indexOf(CLASS_NAME)
    const { currentTime } = anim

    if (currentTime < 1500 && !hasClass) {
      STAGE.classList.add(CLASS_NAME)
    } else if (currentTime > 1499 && hasClass) {
      STAGE.classList.remove(CLASS_NAME)
    }
  }
})

timeline
  // first movement
  .add({
    targets: STAGE,
    duration: 1000,
    easing: EASING,
    offset: 500,
    rotate: -90
  })
  .add({
    targets: '.middle-square',
    easing: EASING,
    offset: 500,
    translateX: ['-50%', '-50%'],
    translateY: ['-50%', '-50%'],
    rotate: {
      value: 180,
      duration: 1000
    }
  })
  // second movement
  .add({
    targets: STAGE,
    duration: 1000,
    easing: EASING,
    offset: 2000,
    rotate: 0
  })
  .add({
    targets: '.circle',
    duration: 1000,
    easing: EASING,
    offset: 2000,
    rotate (el, i) {
      let initial

      if (i === 0) initial = 180
      else if (i === 1) initial = 270
      else if (i === 2) initial = 90
      else if (i === 3) initial = 0

      return [initial, (initial - 360)]
    }
  })
