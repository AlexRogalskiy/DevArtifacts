const pulse = document.querySelector('.pulse');

const timeline = anime.timeline({
  loop: true
});

timeline.add({
  targets: pulse,
  scale: {
    value: [0, 1],
    duration: 1500
  },
  backgroundColor: {
    value: [
      '#fff',
      'rgba(255, 255, 255, 0)'
    ],
    delay: 100,
    duration: 1000
  },
  opacity: {
    value: [1, 0],
    delay: 300,
    duration: 800
  }
});