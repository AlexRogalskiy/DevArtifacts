class floatingLabel
  
  constructor: (form,options={}) ->
    
    return unless form
    
    options.focusClass ||= "focus"
    options.activeClass ||= "active"
    options.errorClass ||= "error"
    
    form.classList.add 'has-floated-label'
    
    for label in form.querySelectorAll('label')
      return unless input = document.querySelector("##{label.getAttribute('for')}")
                  
      for event in ['keyup','input', 'change']
        input.addEventListener event, ->
          @parentNode.classList.remove options.errorClass
          @parentNode.classList.toggle options.activeClass, !!@value
      input.addEventListener 'focus', ->
        @parentNode.classList.add options.focusClass
      input.addEventListener 'blur', ->
        @parentNode.classList.remove options.focusClass
      input.parentNode.classList.toggle options.activeClass, !!input.value

# initialize
    
window.floatingLabel = new floatingLabel document.querySelector('.form')