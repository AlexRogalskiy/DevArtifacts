class Particle  
  constructor: ( @x, @y ) ->
    @radius = 5
    @decayRate = .07
  update: ( ctx, index ) ->
      if @radius > @decayRate
        @radius -= @decayRate
      else
        ctx.particles.splice( index, 1 )
  draw: ( ctx, index ) ->
    ctx.beginPath()
    ctx.arc( @x, @y, @radius, 0, TWO_PI )
    ctx.fillStyle = 'hsla(' + ctx.hue + ', 100%, ' + ( index / ctx.particles.length ) * 90 + '%, ' + ( index / ctx.particles.length ) + ')'
    ctx.fill()
Sketch.create
  setup: ->
    @tick = 0
    @particles = []
    @hue = 120
    @anchor = 
      x: @width / 2
      y: @height / 2
      radius: 40
      angle: 0
      speed: 0.07
  update: ->
    @anchor.angle += @anchor.speed
    @particles.push( new Particle( @anchor.x + cos( @anchor.angle ) * @anchor.radius, @anchor.y + sin( @anchor.angle ) * @anchor.radius ) )
    @hue += 1
    i = @particles.length
    while i--
      @particles[ i ].update( @, i )  
  draw: ->
    i = @particles.length
    while i--
      @particles[ i ].draw( @, i )