class Easing

  @curve: ( t, b, c, d ) ->
    if ( t /= d / 2 ) < 1 then c / 2 * Math.pow( t, 2 ) + b
    else -c / 2 * ( ( t - 1 ) * ( t - 3 ) - 1 ) + b
  
  @linear: ( t, b, c, d ) ->
    c * t / d + b 

class Trig

  @rad: ( deg ) ->
    deg * Math.PI / 180

  @deg: ( rad ) ->
    rad * 180 / Math.PI

  @getBaseAngleFromPoints: ( dx, dy ) ->
    angle = Math.atan( dy / dx )
    return Math.abs( angle )

  @getQuadrant: ( dx, dy ) ->
    if dy >= 0
      if dx >= 0 then 1
      else 2
    else
      if dx < 0 then 3
      else 4

  @getAngleFromPoints: ( p1, p2 ) ->
    dx          = p2.x - p1.x
    dy          = p2.y - p1.y
    baseAngle   = @getBaseAngleFromPoints( dx, dy )

    switch @getQuadrant( dx, dy )
      when 1 then baseAngle
      when 2 then Math.PI - baseAngle
      when 3 then Math.PI + baseAngle
      when 4 then 2 * Math.PI - baseAngle

  @getDistanceBetweenPoints: ( p1, p2 ) ->
    dx = p2.x - p1.x
    dy = p2.y - p1.y
    distance = Math.sqrt( dx * dx + dy * dy )

  @getPointFromAngle: ( origin, angle, distance ) ->
    { x, y } = origin
    if angle is Math.PI
      { x: x - distance, y: y }
    else if angle is Math.PI / 2
      { x: x, y: y + distance }
    else if angle is Math.PI * 1.5
      { x: x, y: y - distance }
    else if angle is 0
      { x: x + distance, y: y }
    else
      {
        x: Math.cos( angle ) * distance + x,
        y: Math.sin( angle ) * distance + y
      }

class Point
  
  constructor: (@ctx, @x, @y, @size = 20) ->
    @draw()
    
  draw: (x = @x, y = @y) ->
    @ctx.moveTo(x, y)
    @ctx.beginPath()
    @ctx.arc(x, y, @size / 2, 0, Math.PI * 2)
    @ctx.fillStyle = 'white'
    @ctx.fill()
    
  update: (mouse) =>
    range  = 125
    dist   = Trig.getDistanceBetweenPoints(mouse, this)
    if dist > range then return @draw() or true
    angle  = Trig.getAngleFromPoints(mouse, this)
    offset = Easing.curve(dist, range, -range, range)
    point  = Trig.getPointFromAngle(this, angle, offset)
    @draw(point.x, point.y)
    
class Pen
  
  constructor: ->
    @$canvas = $('canvas')
    @ctx = @$canvas.get(0).getContext('2d')
    @$canvas.attr height: @$canvas.height(), width: @$canvas.width()
    @$canvas.css  height: @$canvas.height(), width: @$canvas.width()
    @points = @getPoints()
    $(document).on('mousemove', @handleMouse)
    
  getPoints: ->
    origin = { x: @$canvas.width() / 2, y: @$canvas.height() / 2 }
    for i in [1..65]
      angle = Math.PI * 0.2 * i
      dist = i * 4
      point = Trig.getPointFromAngle(origin, angle, dist)
      new Point(@ctx, point.x, point.y, i)
    
  handleMouse: (event) =>
    mouse = { x: event.pageX, y: event.pageY }
    @ctx.clearRect(0, 0, @$canvas.width(), @$canvas.height())
    for point in @points or []
      point.update(mouse)
    
 new Pen