class App
  
  spawning: true
  particles: []
  lastX: window.innerWidth / 2
  lastY: window.innerHeight / 2
  scale: 1
  
  constructor: ->
    
    @.build()
    @.addListeners()
    @.loop()
    
    @.tuttimer = setTimeout =>
      @.spawning = false
    , 3000
    
  build: ->
    
    @.canvas = document.createElement "canvas"
    document.body.appendChild @.canvas
    @.c = @.canvas.getContext "2d"
    @.x = window.innerWidth / 2
    @.y = window.innerHeight / 2
    
  addListeners: ->
    
    window.addEventListener "mousemove" , @.onMouseMove
    window.addEventListener "touchmove" , @.onTouchMove
    window.addEventListener "mousedown" , @.onDown
    window.addEventListener "touchstart" , @.onDown
    window.addEventListener "touchstart" , @.isTouch
    window.addEventListener "mouseup" , @.onUp
    window.addEventListener "touchend" , @.onUp
    window.addEventListener "resize" , @.onResize
    @.onResize()
    
  isTouch: =>
    
    @.canvas.setAttribute "class" , "is-touch"
    @.scale = 2
    @.onResize()
    
  onResize: =>
    
    width =  window.innerWidth * @.scale
    height =  window.innerHeight * @.scale
    
    if @.width isnt width or @.height isnt height
    
      @.width = width
      @.height = height

      @.canvas.setAttribute "width" , @.width
      @.canvas.setAttribute "height" , @.height
    
  onMouseMove: ( e ) =>
    
    @.lastX = @.x
    @.lastY = @.y
    @.x = e.clientX
    @.y = e.clientY
    
  onTouchMove: ( e ) =>
    
    @.lastX = @.x
    @.lastY = @.y
    @.x = e.touches[0].clientX * @.scale
    @.y = e.touches[0].clientY * @.scale
    
  onDown: ( e ) =>
    
    e.preventDefault()
    clearTimeout @.tuttimer
    @.spawning = true
    
  onUp: =>
    
    @.spawning = false
    
  loop: =>
      
      requestAnimationFrame @.loop
      
      @.make()
      @.update()
      @.draw()
      
  make: ->
    
    if @.spawning and @.particles.length < 250
      
      angle = Math.random() * 360
      d = angle * ( Math.PI / 180 )
      v = 3 + Math.random() * 10
      
      xv = Math.sin( d ) * v + (( @.x - @.lastX ) * 1 )
      yv = Math.cos( d ) * v + (( @.y - @.lastY ) * 1 )
      
      color = Math.atan2( @.y - ( @.y + yv) , @.x - ( @.x + xv )) * 180 / Math.PI
      
      @.particles.push
        color: color
        life: 1500 + Math.random() * 7000
        position:
          x: @.x
          y: @.y
          s: 0
        velocity:
          x: xv
          y: yv
          s: 0
    
  update: ->
    
    for particle in @.particles
      
      vertices = [ "x" , "y" , "s" ]
      for vertex in vertices
        particle.position[ vertex ] += particle.velocity[ vertex ]
        
      particle.velocity.x *= 0.977
      particle.velocity.y *= 0.977
      particle.velocity.s = ( particle.position.s - ( particle.life / 250 ))
      particle.position.s += particle.velocity.s
      particle.life *= 0.995
      particle.life -= 1000/60
      
    i = @.particles.length - 1
    while i >= 0
      particle = @.particles[i]
      if particle.life <= 0 then @.particles.splice  i , 1
      i--
      
  draw: ->
    
    for particle in @.particles
      
      x = particle.position.x
      y = particle.position.y
      r = particle.life / 150
      
      @.c.fillStyle = "hsl( #{ Math.round( particle.color )} , 45% , 80% )"
      @.c.beginPath()
      @.c.arc x , y , r , 0 , 2 * Math.PI
      @.c.fill()
      @.c.closePath()
  
new App()