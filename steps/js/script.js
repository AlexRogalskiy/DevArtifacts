var stepsContainer = '.js-drawing-steps-container',
    resizeTimer,
		config = {
      	w: 0,  //width
		    h: 40, //height and circle's diameter
		    m: 30, //margin
      	n: 6,  //numbers
      	d: 500 //delay
		};

var Steps = {

    init: function () {
      	this.plot();
        window.onresize = this.resize.bind(this);
    },
  
  	resize: function () {
	      clearTimeout(resizeTimer);
      	d3.select(stepsContainer).selectAll("*").remove();
  	    resizeTimer = setTimeout(this.plot.bind(this), 500);
    },

  	plot: function () {
    	config.w = d3.select(stepsContainer).node().getBoundingClientRect().width;
      var svg = d3.select(stepsContainer).append('svg')
            .attr({
              	class: "drawing-steps__svg",
                width: config.w,
                height: config.h + (config.m * 2),
                viewBox: [0, 0, config.w, config.h + (config.m * 2)].join(' ')
            })
            .append('g')
            .attr('transform', ['translate(', 0, ', ', config.m, ')'].join(''));
      
        var d = null,
            arc = null,
            path = null,
            totalLength = null,
            angle = {
                start: null,
                end: null
            },
            columnFactor = null,
            xPos = null, x2Pos;

        for (var i = 0; i < config.n * 2; i++) {

            angle.start = i % 2 ? -90 : 90;
            angle.end = i % 2 ? 90 : -90;
            columnFactor = i % 2 === 0 ? (i / 2) + 1 : ((i - 1) / 2) + 1;
						xPos = (config.w / config.n) * columnFactor - (config.w / (2 * config.n));
          	x2Pos = ((config.w / config.n) * (columnFactor + 1)) - (config.w / (2 * config.n));

          	d = this.describeArc(
                xPos,
                config.h / 2,
                config.h / 2,
                angle.start,
                angle.end
            );

              arc = svg.append('path')
                .attr({
                    d: d,
                    stroke: '#27bdbe',
              			'stroke-width': 2,
                    fill: 'none'
                });
              totalLength = arc.node().getTotalLength();

              arc.attr({
                'stroke-dasharray': [totalLength, totalLength].join(' '),
                'stroke-dashoffset': (i % 2 ? -totalLength : totalLength)
              })
              .transition()
              .ease('ease-in')
              .delay((config.d * columnFactor) + 100)
              .duration(config.d)
              .attr('stroke-dashoffset', 0);


            if (columnFactor < config.n) {

                var points = [{
                    x: xPos + config.h / 2,
                    y: config.h / 2
                }, {
                  	x: x2Pos - config.h / 2,
                    y: config.h / 2
                }];

                path = svg.append('path')
                    .datum(points)
                    .attr({
                        d: this.drawLine(points),
                        stroke: '#27bdbe'
                    });

                totalLength = path.node().getTotalLength();

                path.attr({
                  'stroke-dasharray': [totalLength, totalLength].join(' '),
                  'stroke-dashoffset': totalLength
                })
                .transition()
                .ease('ease-out')
                .delay(config.d * (1 + columnFactor))
                .duration(config.d)
                .attr('stroke-dashoffset', 0);
            }

            var numbers = svg.append('text')
                .attr({
                    class: 'drawing-steps__numbers',
                    x: xPos - 4.5,
                    y: (config.h / 2) + 5,
                    'fill-opacity': 0
                })
                .transition()
                .delay(config.d * columnFactor)
            		.duration(config.d * 3)
                .attr('fill-opacity', 1)
                .text(columnFactor);
        }

    },
  
    drawLine: function (x1, x2) {
        return d3.svg.line()
            .x(function (d) { return d.x; })
            .y(function (d) { return d.y; });
    },

    polarToCartesian: function (cX, cY, r, deg) {
        var rad =  ((deg - 90) * Math.PI / 180.0);

        return {
          x: cX + (r * Math.cos(rad)),
          y: cY + (r * Math.sin(rad))
        };
    },

    describeArc: function (x, y, r, startAngle, endAngle) {
        var start = this.polarToCartesian(x, y, r, endAngle);
        var end = this.polarToCartesian(x, y, r, startAngle);
        var arcSweep = endAngle - startAngle <= 180 ? '0' : '1';
        var d = [
            'M', start.x, start.y,
            'A', r, r, 0, arcSweep, 0, end.x, end.y
        ].join(' ');
	      console.log('---');
				console.log(x, y, r, startAngle, endAngle,
                    start, end, 0);
        return d;
    }
};

Steps.init();