// This is only used for the mute button and restarting the animation.
// If you remove this code the animation should work as well.
const audio = document.querySelector('audio')
const wrapper = document.querySelector('.scene')
const btnAudio = document.querySelector('#btn-audio')
const btnRestart = document.querySelector('#btn-restart')

btnRestart.addEventListener('click', () => {
  wrapper.style.display = 'none'
  setTimeout(() => {
    wrapper.style.display = 'block'
    audio.currentTime = 0
    audio.play()
  }, 20)
})

btnAudio.addEventListener('click', () => {
  const elClass = 'controls__btn--toggled'
  btnAudio.classList.remove(elClass)
  audio.muted = !audio.muted

  if (audio.muted) {
    btnAudio.classList.add(elClass)
  }
})
