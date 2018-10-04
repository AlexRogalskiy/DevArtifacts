class magicLine
  
  constructor: (@menu) ->
    
    return unless @menu
        
    @menu.classList.add 'has-magic-line'
    @line = document.createElement 'li'
    @line.classList.add 'magic-line'
    @menu.appendChild @line

    @update()
    window.addEventListener 'resize', @update

  update: =>

    return unless el = @menu.querySelector '.active'
        
    @line.style.transform = "translateY( #{el.offsetTop||0}px )"
    @line.style.height = "#{el.offsetHeight||0}px"
    @line.style.backgroundColor = window.getComputedStyle(el).getPropertyValue('background-color')

# initialize
    
window.magicLine = new magicLine document.querySelector('.menu')

# click

for a in document.querySelectorAll('.menu-item a')
  a.addEventListener 'click', (e) ->
    e.preventDefault()
    document.querySelector('.menu-item.active')?.classList.remove 'active'
    this.parentNode.classList.add 'active'
    window.magicLine.update()