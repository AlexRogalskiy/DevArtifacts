class Calc

  @circle: Math.PI * 2
  @origin: -Math.PI / 2

  @getPointFromAngle = ( origin, angle = 0, distance = 0 ) ->
    x: distance * Math.cos( angle ) + origin.x
    y: distance * Math.sin( angle ) + origin.y

class Options

  lineColor:  '#000'
  fillColor:  '#fff'
  bgColor:    '#fff'

  constructor: ( options = {} ) ->
    # Set options
    for key, value of options when value? then @[ key ] = value
    # Calculate values
    @updateSize()
    @$canvas    = $( 'canvas' )
    @canvas     = @$canvas.get( 0 )
    @context    = @canvas.getContext( '2d' )

  updateSize: ->
    $window     = $( window )
    width       = Math.max( 800, $window.width() )
    height      = Math.max( 600, $window.height() )
    return false unless width isnt @width or height isnt @height
    @height     = height
    @width      = width
    @size       = Math.min( @width, @height )
    @part       = @size / 2 / 6.25
    @hourWidth  = @part * 3
    @center     = x: @width / 2, y: @height / 2
    return true

class Clock
  
  constructor: ( options ) ->
    @options  = new Options options
    @canvas   = @options.canvas
    @context  = @options.context
    @prepareCanvas()
    @createElements()
    setInterval @redraw, Math.round( 1000 / 20 )
    @redraw()
    $( window ).resize => if @options.updateSize() then @prepareCanvas()
    
  prepareCanvas: ->
    @options.$canvas
      .css(  width: @options.width, height: @options.height, background: @options.bgColor )
      .attr( width: @options.width, height: @options.height )

  createElements: ->
    $( document.body ).append(
      @$hours = $( '<div>' ).css( position: 'absolute', textAlign: 'center', color: @options.lineColor, fontFamily: 'Segoe UI Light, Helvetica Neue, sans-serif', fontWeight: 100 )
      @$mins  = $( '<div>' ).css( position: 'absolute', textAlign: 'center', color: @options.lineColor, fontFamily: 'Segoe UI Light, Helvetica Neue, sans-serif', fontWeight: 100 )
      @$secs  = $( '<div>' ).css( position: 'absolute', textAlign: 'center', color: @options.lineColor, fontFamily: 'Segoe UI Light, Helvetica Neue, sans-serif', fontWeight: 100 )
    )
    
  redraw: ( now = new Date ) =>
    msSec  = 1000
    msMin  = msSec * 60
    msHour = msMin * 60
    msHalf = msHour * 12
    msNow  = ( now.getHours() % 12 ) * msHour + now.getMinutes() * msMin + now.getSeconds() * msSec + now.getMilliseconds()

    @context.clearRect( 0, 0, @options.width, @options.height )

    # Render Hour Hand
    hourAngle = @getAngle( msHalf, msNow )
    hourSize  = @options.hourWidth
    @drawHand( @options.center, hourAngle, hourSize )
    @$hours.html( "#{ Math.floor( msNow / msHour ) or 12 }<sub>h</sub>" ).css(
      top:        @options.center.y - hourSize * 0.5
      left:       @options.center.x - hourSize * 0.5
      height:     hourSize
      width:      hourSize
      lineHeight: hourSize + 'px'
      fontSize:   hourSize * 0.3 + 'px'
    )

    # Render Minute Hand
    minuteAngle   = @getAngle( msHour, msNow % msHour )
    minuteCenter  = Calc.getPointFromAngle( @options.center, hourAngle, hourSize )
    minSize       = hourSize / 2
    @drawHand( minuteCenter, minuteAngle, minSize )
    @$mins.html( "#{ Math.floor( msNow % msHour / msMin ) }<sub>m</sub>" ).css(
      top:        minuteCenter.y - minSize * 0.5
      left:       minuteCenter.x - minSize * 0.5
      height:     minSize
      width:      minSize
      lineHeight: minSize + 'px'
      fontSize:   minSize * 0.3 + 'px'
    )

    # Render Second Hand
    secondAngle   = @getAngle( msMin, msNow % msMin )
    secondCenter  = Calc.getPointFromAngle( minuteCenter, minuteAngle, minSize )
    secSize       = minSize / 2
    @drawHand( secondCenter, secondAngle, secSize )
    @$secs.html( "#{ Math.floor( msNow % msMin / msSec ) }<sub>s</sub>" ).css(
      top:        secondCenter.y - secSize * 0.5
      left:       secondCenter.x - secSize * 0.5
      height:     secSize
      width:      secSize
      lineHeight: secSize + 'px'
      fontSize:   secSize * 0.3 + 'px'
    )

    # Render Millisecond Hand
    msAngle   = @getAngle( msSec, msNow % msSec )
    msCenter  = Calc.getPointFromAngle( secondCenter, secondAngle, secSize )
    msSize    = secSize / 2
    @drawHand( msCenter, msAngle, msSize, true )
    
  getAngle: ( total, parts ) ->
    angle = parts / total * Calc.circle + Calc.origin

  drawHand: ( center, angle, size, end ) ->
    radius    = size * 0.4
    endpoint  = Calc.getPointFromAngle( center, angle, size )

    @drawHandArc(  center, angle, size * 0.55 )
    @drawHandLine( center, Calc.getPointFromAngle( center, Calc.origin, size * 0.65 ) ) unless end
    @drawHandLine( center, endpoint ) unless end
    @drawHandTip(  center, radius )

  drawHandArc: ( center, angle, size ) ->
    @context.fillStyle    = @options.fillColor
    @context.strokeStyle  = @options.lineColor
    @context.lineWidth    = 1

    @begin()
    @move( center )
    @arc( center, size, Calc.origin, angle )
    @close()
    @fill()
    @stroke()

  drawHandLine: ( point1, point2 ) ->
    @context.strokeStyle  = @options.lineColor
    @context.lineWidth    = 2

    @begin()
    @move( point1 )
    @line( point2 )
    @stroke()

  drawHandTip: ( center, radius ) ->
    @context.fillStyle = @options.bgColor
    @context.strokeStyle = @options.lineColor
    @context.lineWidth = 2

    @begin()
    @arc( center, radius, 0, Calc.circle )
    @fill()
    @stroke()

  # Canvas Helpers
  begin:  -> @context.beginPath()
  close:  -> @context.closePath()
  fill:   -> @context.fill()
  stroke: -> @context.stroke()

  move: ( point ) -> @context.moveTo( point.x, point.y )
  line: ( point ) -> @context.lineTo( point.x, point.y )
  arc:  ( point, radius, angle1, angle2, counter ) -> @context.arc( point.x, point.y, radius, angle1, angle2, counter )

$ -> new Clock