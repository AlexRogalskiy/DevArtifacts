const btnFlip = document.getElementById('btnFlip')
const btnFlipAround = document.getElementById('btnFlipAround')
const zoomBack = document.getElementById('zoomBack')
const zoomFront = document.getElementById('zoomFront')
const btnJump = document.getElementById('btnJump')
const rotate = document.getElementById('rotate')
const removeAll = document.getElementById('removeAll')
const newCard = document.getElementById('newCard')
const OldCard = document.getElementById('OldCard')

const elements = document.getElementsByClassName("btn")

const card = document.getElementById('card')

const cardColor = document.getElementById('front')
const backColor = document.getElementById('back')

btnFlip.addEventListener('click', function start() {
    card.classList.remove('flip-card-around')
    card.classList.remove('zoom-back')
    card.classList.remove('zoom-front')
    card.classList.remove('jump')
    card.classList.remove('rotate')
    card.classList.toggle('flip-card')
})

btnFlipAround.addEventListener('click', function start() {
    card.classList.remove('flip-card')
    card.classList.remove('zoom-back')
    card.classList.remove('zoom-front')
    card.classList.remove('jump')
    card.classList.remove('rotate')
    card.classList.toggle('flip-card-around')
})

zoomBack.addEventListener('click', function start() {
    card.classList.remove('flip-card')
    card.classList.remove('flip-card-around')
    card.classList.remove('zoom-front')
    card.classList.remove('jump')
    card.classList.remove('rotate')
    card.classList.toggle('zoom-back')
})
zoomFront.addEventListener('click', function start() {
    card.classList.remove('flip-card')
    card.classList.remove('flip-card-around')
    card.classList.remove('zoom-back')
    card.classList.remove('jump')
    card.classList.remove('rotate')
    card.classList.toggle('zoom-front')
})
btnJump.addEventListener('click', function start() {
    card.classList.remove('flip-card')
    card.classList.remove('flip-card-around')
    card.classList.remove('zoom-back')
    card.classList.remove('zoom-front')
    card.classList.remove('rotatet')
    card.classList.toggle('jump')

    setTimeout(function() {
        card.classList.remove('jump')
    }, 1000);

})

function remove() {
    card.classList.remove('flip-card')
    card.classList.remove('flip-card-around')
    card.classList.remove('zoom-back')
    card.classList.remove('zoom-front')
    card.classList.remove('jump')
    card.classList.remove('rotate')

    for (var i = elements.length - 1; i >= 0; --i) {
        elements[i].classList.remove('clicked')
    }
}

removeAll.addEventListener('click', function start() {
    remove()
})

card.addEventListener('click', function start() {
    remove()
})

rotate.addEventListener('click', function start() {
    card.classList.remove('flip-card')
    card.classList.remove('flip-card-around')
    card.classList.remove('zoom-back')
    card.classList.remove('zoom-front')
    card.classList.remove('jump')
    card.classList.toggle('rotate')
})

newCard.addEventListener('click', function start() {
    cardColor.classList.add('new-color')
    backColor.classList.add('new-color')
})

oldCard.addEventListener('click', function start() {
    cardColor.classList.remove('new-color')
    backColor.classList.remove('new-color')
})

const inputs = [].slice.call(document.querySelectorAll('.controls input'))

inputs.forEach(input => input.addEventListener('change', handleUpdate))
inputs.forEach(input => input.addEventListener('mousemove', handleUpdate))

function handleUpdate(e) {
  const suffix = (this.id === 'base' ? '' : 'px')
  var property = `--${this.id}`
  document.documentElement.style.removeProperty(property)
  document.documentElement.style.setProperty(property, this.value + 'deg')
}