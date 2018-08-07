let currentLength = -4.86

$('.spin').click(() => {
  currentLength += 1080 + (getRandomInt(0, 37) * 9.729)
  $('.wheel img').css('transform', 'rotate(-'+currentLength+'deg)')
})

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
