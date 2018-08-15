// This is used only for the mute button and 
// restarting the animation.
const audio = document.querySelector('audio')
const wrapper = document.querySelector('#root')
const btnAudio = document.querySelector('#btn-audio')
const btnRestart = document.querySelector('#btn-restart')

btnRestart.addEventListener('click', () => {
  wrapper.style.display = 'none'
  setTimeout(() => {
    wrapper.style.display = 'block'
    audio.currentTime = 0
    audio.play()
  }, 10)
})

btnAudio.addEventListener('click', () => {
  const elClass = 'controls__btn--toggled'
  btnAudio.classList.remove(elClass)
  audio.muted = !audio.muted

  if (audio.muted) {
    btnAudio.classList.add(elClass)
  }
})
