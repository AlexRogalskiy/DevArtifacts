Available options:

Name              Default value                                Description

curve             function (t) { return { x: t, y: 0.5 }; }    2D curve t -> { x: ..., y: ... }
domain            [0.0, 1.0]                                   Curve's domain
viewport          { x: 0.0, y: 0.0, width: 1.0, height: 1.0 }  Viewport
subdivision       250                                          Number of subdivision = number of line segments to approximate the curve

className         'letter'                                     Span class name as used by "typorize"
spaceClassName    'empty'                                      Span class name as used by "typorize"

baseline          'above'                                      Can be 'above', 'below' or a number (baseline position relative to the first letter, try something like "1.0 / line-height")

scale             true                                         Scale the text to fit on the curve?
rotate            true                                         Rotate letters?
animate           true                                         Animate letters?

delay             0                                            Transition delay
duration          300                                          Transition duration
easing            'linear'                                     Transition easing

watchResize       true                                         Watch resize and orientation change events?
throttle          200                                          Throttled events?


Additional files:

typorize.min.js
Just a more advanced lettering.js plugin.

throttle.min.js
A plugin that creates throttled functions.
