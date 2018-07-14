/**
 * Wait for the document to be ready
 */
$(document).ready(function()
{
    /**
     * Demo 1
     */
    var arc = function (t)
    {
        return {
            x: 500.0 + 300.0 * Math.cos(2.0 * Math.PI * t - 0.5 * Math.PI),
            y: 400.0 + 300.0 * Math.sin(2.0 * Math.PI * t - 0.5 * Math.PI)
        };
    };

    $('#text1').curvedText({
        curve:    arc,
        domain:   [-0.2, 0.2],
        viewport: { x: 0.0, y: 0.0, width: 1000.0, height: 400.0 }
    });


    /**
     * Demo 2
     */
    var circle = function (t)
    {
        return {
            x: 500.0 + 300.0 * Math.cos(2.0 * Math.PI * -t + 0.5 * Math.PI),
            y: 500.0 + 300.0 * Math.sin(2.0 * Math.PI * -t + 0.5 * Math.PI)
        };
    };

    $('#text2').curvedText({
        curve:    circle,
        domain:   [0.0, 1.0],
        viewport: { x: 0.0, y: 0.0, width: 1000.0, height: 1000.0 }
    });


    /**
     * Demo 3
     */
    var bezier = function (t)
    {
        var px = [100.0, 350.0, 500.0, 900.0],
            py = [400.0,  50.0, 500.0, 200.0],
            ax = [px[0], 3.0 * (px[1] - px[0]), 3.0 * (px[2] - 2.0 * px[1] + px[0]), px[3] - 3.0 * px[2] + 3.0 * px[1] - px[0]],
            ay = [py[0], 3.0 * (py[1] - py[0]), 3.0 * (py[2] - 2.0 * py[1] + py[0]), py[3] - 3.0 * py[2] + 3.0 * py[1] - py[0]],
            cx = ax[0] + ax[1] * t + ax[2] * t * t + ax[3] * t * t * t,
            cy = ay[0] + ay[1] * t + ay[2] * t * t + ay[3] * t * t * t;

        return {
            x: cx,
            y: cy
        };
    };

    $('#text3').curvedText({
        curve:    bezier,
        domain:   [0.0, 1.0],
        viewport: { x: 0.0, y: 0.0, width: 1000.0, height: 500.0 }
    });


    /**
     * Demo 4
     */
    var spiral = function (t)
    {
        var s = t + 1.0;

        return {
            x: 300.0 + 50.0 * s * Math.cos(2.0 * Math.PI * s - 0.5 * Math.PI),
            y: 300.0 + 50.0 * s * Math.sin(2.0 * Math.PI * s - 0.5 * Math.PI)
        };
    };

    $('#text4').curvedText({
        curve:    spiral,
        domain:   [0.0, 3.0],
        viewport: { x: 0.0, y: 0.0, width: 600.0, height: 600.0 }
    });


    /**
     * Demo 5
     */
    var line = function (t)
    {
        return {
            x: (1.0 - t) * 0.0 + t * 1000,
            y: 250.0
        };
    };

    var ellipse = function (t)
    {
        return {
            x: 500.0 + 200.0 * Math.cos(2.0 * Math.PI * t - 0.5 * Math.PI),
            y: 250.0 + 150.0 * Math.sin(2.0 * Math.PI * t - 0.5 * Math.PI)
        };
    };

    var sine = function (t)
    {
        return {
            x:   0.0 + 1000.0 * t,
            y: 250.0 +  100.0 * Math.sin(3.0 * Math.PI * t)
        };
    };

    var dampedSine = function (t)
    {
        return {
            x:  25.0 + 950.0 * t,
            y: 250.0 + 200.0 * Math.exp(-2.0 * t) * Math.sin(3.0 * Math.PI * t)
        };
    };

    var powerSpiral = function (t)
    {
        var s = t + 1.0;

        return {
            x: 500.0 + 50.0 * Math.pow(s, 3.0) * Math.cos(6.0 * Math.PI * s - 0.5 * Math.PI),
            y: 250.0 + 50.0 * Math.pow(s, 3.0) * Math.sin(6.0 * Math.PI * s - 0.5 * Math.PI)
        };
    };

    var domain   = [0.0, 1.0],
        viewport = { x: 0.0, y: 0.0, width: 1000.0, height: 500.0 };

    $('#text5').curvedText({
        curve:    line,
        domain:   domain,
        viewport: viewport,
        animate:  false
    });

    $('#line').click(function (e)
    {
        e.preventDefault();

        $('#text5').curvedText({
            curve:    line,
            domain:   domain,
            viewport: viewport,
            animate:  false
        });
    });

    $('#line-custom').click(function (e)
    {
        e.preventDefault();

        $('#text5').curvedText({
            curve:    line,
            domain:   domain,
            viewport: viewport,
            baseline: 0.8,
            animate:  false
        });
    });

    $('#line-no-scale').click(function (e)
    {
        e.preventDefault();

        $('#text5').curvedText({
            curve:    line,
            domain:   domain,
            viewport: viewport,
            scale:    false,
            animate:  false
        });
    });

    $('#ellipse-above').click(function (e)
    {
        e.preventDefault();

        $('#text5').curvedText({
            curve:    ellipse,
            domain:   domain,
            viewport: viewport,
            baseline: 'above'
        });
    });

    $('#ellipse-below').click(function (e)
    {
        e.preventDefault();

        $('#text5').curvedText({
            curve:    ellipse,
            domain:   domain,
            viewport: viewport,
            baseline: 'below'
        });
    });

    $('#ellipse-custom').click(function (e)
    {
        e.preventDefault();

        $('#text5').curvedText({
            curve:    ellipse,
            domain:   domain,
            viewport: viewport,
            baseline: 0.8
        });
    });

    $('#sine').click(function (e)
    {
        e.preventDefault();

        $('#text5').curvedText({
            curve:    sine,
            domain:   domain,
            viewport: viewport,
            duration: 2000
        });
    });

    $('#sine-no-rotation').click(function (e)
    {
        e.preventDefault();

        $('#text5').curvedText({
            curve:    sine,
            domain:   domain,
            viewport: viewport,
            rotate:   false,
            duration: 500
        });
    });

    $('#damped-sine').click(function (e)
    {
        e.preventDefault();

        $('#text5').curvedText({
            curve:    dampedSine,
            domain:   domain,
            viewport: viewport,
            baseline: 0.8,
            duration: 1000
        });
    });

    $('#damped-sine-no-scale').click(function (e)
    {
        e.preventDefault();

        $('#text5').curvedText({
            curve:    dampedSine,
            domain:   domain,
            viewport: viewport,
            baseline: 0.8,
            scale:    false,
            duration: 1000
        });
    });

    $('#power-spiral').click(function (e)
    {
        e.preventDefault();

        $('#text5').curvedText({
            curve:    powerSpiral,
            domain:   domain,
            viewport: viewport,
            baseline: 0.8,
            scale:    false,
            duration: 2000
        });
    });
});