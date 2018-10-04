document.addEventListener "DOMContentLoaded", ->
  document.body.classList.add('loaded-document')

for block in document.querySelectorAll('.block')
  img = new Image()
  img.block = block
  img.onload = ->
    @block.classList.add('loaded-image')
  img.src = getComputedStyle(block).backgroundImage.slice(4, -1).replace(/"/g, "")
  
  block.addEventListener 'click', ->
    @classList.add 'clicked'
    @classList.toggle 'loaded-image'
