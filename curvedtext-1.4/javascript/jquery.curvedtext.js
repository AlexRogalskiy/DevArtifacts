/**
 * jQuery Curved Text
 *
 * Align text on any curve.
 *
 * @author by Oliver Musebrink
 * @link http://www.olivermusebrink.de/
 * @copyright Dual licensed under the MIT or GPL Version 2 licenses
 * @version 1.4
 */
;(function ($)
{
    /**
     * Initializes the plugin.
     *
     * @param object opts The options
     *
     * @return object The object (to maintain chainability)
     */
    $.fn.curvedText = function (opts)
    {
        // Window
        var $window = $(window);

        // Default options
        var defaults = {
            curve:          function (t) { return { x: t, y: 0.5 }; },
            domain:         [0.0, 1.0],
            viewport:       { x: 0.0, y: 0.0, width: 1.0, height: 1.0 },
            subdivisions:   250,
            className:      'letter',
            spaceClassName: 'empty',
            baseline:       'above',
            scale:          true,
            rotate:         true,
            animate:        true,
            delay:          0,
            duration:       300,
            easing:         'linear',
            watchResize:    true,
            throttle:       200
        };

        // Extend options
        var options = $.extend(true, {}, defaults, opts);

        return this.each(function ()
        {
            /**
             * Returns a CSS-safe value.
             *
             * @param number x The number to make CSS-safe
             *
             * @return number The CSS-safe number
             */
            var cssSafeValue = function (x)
            {
                return Math.round(1000.0 * x) / 1000.0;
            };

            /**
             * Initializes the plugin.
             */
            var initialize = function ()
            {
                // Get text
                var text = container.text();

                // Empty container
                container.empty();

                // Add canvas
                var props = {
                    position:   'relative',
                    overflow:   'visible',
                    width:      '100%',
                    height:     '100%',
                    whiteSpace: 'nowrap'
                };

                canvas = $('<div />').css     (props)
                                     .text    (text)
                                     .appendTo(container);

                // Apply "typorize"
                canvas.typorize({
                    type:           'letter',
                    className:      options.className,
                    spaceClassName: options.spaceClassName
                });

                // Get letters
                letters = canvas.children('span');

                // Overwrite CSS properties for initial calculations
                letters.css({
                    display:  'inline-block',
                    position: 'relative'
                });

                // Initial calculations
                var offset = 0;

                letters.each(function ()
                {
                    // Letter
                    var letter   = $(this),
                        position = letter.position   (),
                        width    = letter.outerWidth (true),
                        height   = letter.outerHeight(true);

                    // Data
                    var data = {
                        x:        position.left,
                        y:        position.top,
                        width:    width,
                        height:   height
                    };

                    letter.data('curvedText', data);

                    // Update offset
                    offset += width;
                });

                textLength = offset;

                // Store text length
                var data = container.data('curvedText');

                data = $.extend(true, data, {}, { text: { length: textLength } });

                container.data('curvedText', data);

                // Overwrite CSS properties
                letters.css({
                    display:  'inline-block',
                    position: 'absolute'
                });
            };

            /**
             * Approximates the curve.
             */
            var approximate = function ()
            {
                // Number of line segments to approximate the curve
                var n = options.subdivisions;

                // Curve
                var curve = {
                    subdivisions:   n,
                    points:         new Array(n + 1),
                    partialLengths: new Array(n + 1),
                    length:         0.0,
                    viewport:       options.viewport
                };

                // Endpoints and step size
                var endpoints = options.domain,
                    stepSize  = (endpoints[1] - endpoints[0]) / n;

                // Approximate curve with n line segments, so get n + 1 points on the curve
                var dx,
                    dy,
                    t;

                for(var i = 0; i <= n; i++)
                {
                    // Point
                    t               = endpoints[0] + i * stepSize;
                    curve.points[i] = options.curve(t);
                }

                // Calculate partial lengths and curve length
                curve.partialLengths[0] = 0.0;

                for(var i = 1; i <= n; i++)
                {
                    dx                       = curve.points[i].x - curve.points[i - 1].x;
                    dy                       = curve.points[i].y - curve.points[i - 1].y;
                    curve.length            += Math.sqrt(dx * dx + dy * dy);
                    curve.partialLengths[i]  = curve.length;
                }

                // Store curve
                var data = container.data('curvedText');

                data = $.extend(true, data, {}, { curve: curve });

                container.data('curvedText', data);
            };

            /**
             * Sets the transformations.
             */
            var transform = function ()
            {
                // Calculate letter positions
                var letter,
                    data,
                    n,
                    points,
                    partialLengths,
                    curveLength,
                    textLength,
                    scalingFactor,
                    scaledOffset,
                    transition,
                    transformation,
                    transformationOrigin,
                    originX,
                    originY,
                    updateOrigin,
                    scale,
                    translateX,
                    translateY,
                    rotationAngle,
                    baseline,
                    baselineHeight,
                    px,
                    py,
                    tx,
                    ty,
                    s,
                    j;


                // Data
                data = container.data('curvedText');

                // Curve data
                n              = data.curve.subdivisions;
                points         = data.curve.points;
                partialLengths = data.curve.partialLengths;
                curveLength    = data.curve.length;

                // Text data
                textLength  = data.text.length;

                // Scaling factors
                scalingFactor = (options.scale ? (curveLength / textLength) : 1.0);
                scale         = cssSafeValue(scalingFactor);

                // Transition
                if(options.animate)
                {
                    transition = ['all', options.duration + 'ms', options.easing, options.delay + 'ms'].join(' ');
                }
                else
                {
                    transition = 'all 0ms linear 0ms';
                }

                // Baseline
                updateOrigin = (typeof(options.baseline) === 'number');

                if(updateOrigin)
                {
                    // Origin
                    originX = 0.5;

                    // Baseline
                    data     = $(letters[0]).data('curvedText');
                    baseline = data.y + parseFloat(options.baseline) * data.height;
                }
                else
                {
                    // Origin
                    switch(options.baseline)
                    {
                        case 'below':
                            originX = 0.5;
                            originY = 0.0;
                        break;

                        default:
                            originX = 0.5;
                            originY = 1.0;
                        break;
                    }
                }

                // Set minimum index
                j = 1;

                for(var i = 0; i < letters.length; i++)
                {
                    // Letter and data
                    letter = $(letters[i]);
                    data   = letter.data('curvedText');

                    // Find next line segment
                    scaledOffset = scalingFactor * (data.x + 0.5 * data.width);

                    while(partialLengths[j] < scaledOffset && j < n)
                    {
                        j++;
                    }

                    // Calculate point on the line segment (linear interpolation)
                    s   = (scaledOffset - partialLengths[j - 1]) / (partialLengths[j] - partialLengths[j - 1]);
                    px  = (1.0 - s) * points[j - 1].x + s * points[j].x;
                    py  = (1.0 - s) * points[j - 1].y + s * points[j].y;

                    // Approximate tangential vector
                    tx  = points[j].x - points[j - 1].x;
                    ty  = points[j].y - points[j - 1].y;

                    // Rotation angle
                    rotationAngle = (options.rotate ? (Math.atan2(ty, tx) * 180.0 / Math.PI) : 0.0);

                    // Origin
                    if(updateOrigin)
                    {
                        originY = (baseline - data.y) / data.height;
                    }

                    // Transformation
                    translateX = px - originX * data.width;
                    translateY = py - originY * data.height;

                    // CSS-safe values
                    originX       = cssSafeValue(originX      );
                    originY       = cssSafeValue(originY      );
                    translateX    = cssSafeValue(translateX   );
                    translateY    = cssSafeValue(translateY   );
                    rotationAngle = cssSafeValue(rotationAngle);

                    // Set CSS properties
                    transformationOrigin = (100.0 * originX) + '% ' + (100.0 * originY) + '%';
                    transformation       = 'translateX(' + translateX + 'px) translateY(' + translateY + 'px) scaleX(' + scale + ') scaleY(' + scale + ') rotate(' + rotationAngle + 'deg)';

                    letter.css({
                        '-webkit-transform-origin': transformationOrigin,
                        '-moz-transform-origin':    transformationOrigin,
                        '-ms-transform-origin':     transformationOrigin,
                        '-o-transform-origin':      transformationOrigin,
                        'transform-origin':         transformationOrigin
                    }).css({
                        '-webkit-transform':        transformation,
                        '-moz-transform':           transformation,
                        '-ms-transform':            transformation,
                        '-o-transform':             transformation,
                        'transform':                transformation
                    }).css({
                        '-webkit-transition':       transition,
                        '-moz-transition':          transition,
                        '-ms-transition':           transition,
                        '-o-transition':            transition,
                        'transition':               transition
                    });
                }
            };

            /**
             * Callback for "resize".
             */
            var resize = function ()
            {
                // Container dimensions
                var containerWidth  = container.width (),
                    containerHeight = container.height();

                // Data
                var data = container.data('curvedText');

                // Viewport
                var viewport = data.curve.viewport;

                // Scaling factor
                var scalingFactor = containerWidth / viewport.width;

                // Transition
                var transition = 'all 0ms linear 0ms';

                // Transformation
                var scale                = cssSafeValue(scalingFactor),
                    translateX           = cssSafeValue(scalingFactor * -viewport.x),
                    translateY           = cssSafeValue(scalingFactor * -viewport.y),
                    transformation       = 'translateX(' + translateX + 'px) translateY(' + translateY + 'px) scaleX(' + scale + ') scaleY(' + scale + ') rotate(0.0deg)',
                    transformationOrigin = '0% 0%';

                // Adjust container height
                var h = cssSafeValue(scalingFactor * viewport.height) + 'px';

                container.css('height', h);

                // Set canvas' CSS properties
                canvas.css({
                    '-webkit-transform-origin': transformationOrigin,
                    '-moz-transform-origin':    transformationOrigin,
                    '-ms-transform-origin':     transformationOrigin,
                    '-o-transform-origin':      transformationOrigin,
                    'transform-origin':         transformationOrigin
                }).css({
                    '-webkit-transform':        transformation,
                    '-moz-transform':           transformation,
                    '-ms-transform':            transformation,
                    '-o-transform':             transformation,
                    'transform':                transformation
                }).css({
                    '-webkit-transition':       transition,
                    '-moz-transition':          transition,
                    '-ms-transition':           transition,
                    '-o-transition':            transition,
                    'transition':               transition
                });
            };

            // Container, canvas, letters and curve
            var container = $(this),
                canvas,
                letters,
                curve;

            // Get text
            var text = container.text();

            if(!text || text.length == 0)
            {
                return;
            }

            // Data
            var data = container.data('curvedText');

            if(!data)
            {
                // Initialization
                initialize();

                // Add events
                if(options.watchResize)
                {
                    // Add throttled events
                    $window.on('resize.curvedText orientationchange.curvedText', (typeof($.throttle) !== 'undefined' ? $.throttle(resize, options.throttle, true) : resize));
                }
            }
            else
            {
                // Get canvas
                canvas = container.children('div');

                // Get letters
                letters = canvas.children('span');
            }

            // Approximate curve, transform letters and do initial resize
            approximate();
            transform  ();
            resize     ();

            // Return container for chaining
            return container;
        });
    };
})(jQuery);