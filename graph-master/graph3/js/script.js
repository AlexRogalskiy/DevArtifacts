/**
 * A D3 Scatter Plot chart with interactive nodes, 
 * crosshair and custom axis grid.
 */


var totalWidth = window.innerWidth;
var totalHeight = window.innerHeight;

var margin = {
  top: 20,
  left: 50,
  bottom: 30,
  right: 30
}

var width = totalWidth - margin.left - margin.right;
var height = totalHeight - margin.top - margin.bottom;

var formatDecimal = d3.format(',.0f');

// DATA STUFF

var theData = [];

for (var i = 0; i < 50; i++) {
  var item = {
    radius: Math.random() * 0.20,
    cx: Math.random() * 100000,
    cy: Math.random() * 1000
  }
  theData.push(item);
}
// special cases 
// theData.push( { radius : Math.random() * 0.20, cx : 100000, cy : 1000} );
// theData.push( { radius : Math.random() * 0.20, cx : 0, cy : 0} );
// theData.push( { radius : Math.random() * 0.20, cx : 100000, cy : 0} );
// theData.push( { radius : Math.random() * 0.20, cx : 0, cy : 1000} );

// SIZE SCALE
var sizeDomain = d3.extent(theData, function(d) {
  return d.radius;
});

var sizeRange = [4, 16];

var sizeScale = d3.scaleLinear().domain(sizeDomain).range(sizeRange);

// X SCALE
var xDomain = d3.extent(theData, function(d) {
  return d.cx;
});

var xRange = [0, width];
var xPadding = d3.mean(theData, function(d) {
  return d.cx
});
var xScale = d3.scaleLinear().domain(xDomain).range(xRange).nice(10);

// Y SCALE 
var yDomain = d3.extent(theData, function(d) {
  return d.cy;
});
var yRange = [height, 0];
var yScale = d3.scaleLinear().domain(yDomain).range(yRange).nice(5);

// COLOR SCALE 
var colorDomain = d3.extent(theData, function(d) {
  return d.radius
});

var colorize = d3.scaleSequential(d3.interpolateRdPu);

var colorScale = d3.scaleLinear()
  .domain(colorDomain)
  .range([0, 1]);

var xAxis = d3.axisBottom(xScale)
  //.ticks(10)
  .tickSize(6)
  .tickSizeInner(-height)
  //.tickSizeOuter(7);

var yAxis = d3.axisLeft(yScale).ticks(5)
  .tickSizeInner(-width)
  //.tickSizeOuter(7);

// SVG GROUP HIERARCHY 

var svg = d3.select('body').append('svg')
  .attr("id", "scatterplot")
  .attr("width", totalWidth)
  .attr("height", totalHeight)
  //.style( "background-color", "hsl(0, 0%, 100%)" )
  //.style( "border", "dashed 1px gray" );

var mainGroup = svg.append("g")
  .attr("id", "mainGroup")
  .attr("transform", "translate( " + margin.left + ", " + margin.top + ")");

var xAxisGroup = mainGroup.append("g")
  .attr("id", "xaxis")
  .attr("class", "axis")
  .attr("transform", "translate( 0," + height + ")")
  .call(function customXAxis(g) {
    g.call(xAxis);
    //g.select(".domain").remove();
    //g.selectAll(".tick:not(:first-of-type) line"). // selects all tick lines except first
    g.selectAll(".tick:not(:first-of-type) line")
      .attr("stroke", "#777")
      .attr("stroke-dasharray", "3,2");

    g.selectAll(".tick text")
      .attr("y", 9);
  });

var yAxisGroup = mainGroup.append("g")
  .attr("id", "yaxis")
  .attr("class", "axis")
  .call(function customYAxis(g) {
    g.call(yAxis);
    //g.select(".domain").remove();
    g.selectAll(".tick:not(:first-of-type) line")
      .attr("stroke", "#777")
      .attr("stroke-dasharray", "3,2");
    g.selectAll(".tick text")
      .attr("x", -9);
  });

var eventGroup = mainGroup.append("g")
  .attr('id', 'event-overlay');

var crosshair = eventGroup.append("g")
  .attr("id", "crosshair");

var eventRect = eventGroup.append('rect');

var canvasGroup = eventGroup.append("g")
  .attr("id", "circleGroup");

// CHART ASSEMBLY

var crosshairSettings = {

  xLabelTextOffset: height + 12,
  yLabelTextOffset: -9,
  labelWidth: 38,
  labelHeight: 14,
  labelColor: "#aaa",
  labelStrokeColor: "none",
  labelStrokeWidth: "0.5px"

}

crosshair.append("line")
  .attrs({
    "id": "focusLineX",
    "class": "focusLine",
    //"stroke" : "black",
    //"stroke-width" : 1,
    //"stroke-linecap" : "butt"
  });
crosshair.append("line")
  .attrs({
    "id": "focusLineY",
    "class": "focusLine",
    //"stroke" : "black",
    //"stroke-width" : 1,
    //"stroke-linecap" : "butt"
  })

crosshair.append("rect") // x label bg
  .attrs({
    "id": "focusLineXLabelBackground",
    "class": "focusLineLabelBackground",
    "fill": crosshairSettings.labelColor,
    "stroke": crosshairSettings.labelStrokeColor,
    "stroke-width": crosshairSettings.labelStrokeWidth,
    "width": crosshairSettings.labelWidth, // should be a size of corresponding txt!
    "height": crosshairSettings.labelHeight,
  });

crosshair.append("text")
  .attrs({
    "id": "focusLineXLabel",
    "class": "label",
    "text-anchor": "middle",
    "alignment-baseline": "central"
  });

var ylabel = crosshair.append("g").attr("id", "yLabelGroup");
ylabel.append("rect") // y label bg
  .attrs({
    "id": "focusLineYLabelBackground",
    "class": "focusLineLabelBackground",
    "fill": crosshairSettings.labelColor,
    "stroke": crosshairSettings.labelStrokeColor,
    "stroke-width": crosshairSettings.labelStrokeWidth,
    "width": crosshairSettings.labelWidth,
    "height": crosshairSettings.labelHeight,
  });
ylabel.append("text")
  .attrs({
    "id": "focusLineYLabel",
    "class": "label",
    "text-anchor": "end",
    "alignment-baseline": "central"
  });

canvasGroup.selectAll("circle")
  .data(theData)
  .enter()
  .append('circle')
  .attr("cx", function(d) {
    return xScale(d.cx)
  })
  .attr("cy", function(d) {
    return yScale(d.cy)
  })
  .attr("r", function(d) {
    return sizeScale(sizeDomain[0]);
  })
  .style("fill", function(d) {
    return colorize(colorScale(d.radius));
  })
  .style("opacity", 1)
  .on("mouseover", function(d, i) {

    d3.select(this)
      .attrs({ // this == circle
        "stroke": "#000000",
        "stroke-width": "1.5px",
        "cursor": "pointer",
      })
      .styles({
        "fill": "darkorange",
      });
    crosshair.style('display', null); // enable crosshair visibility 
    setCrosshair(xScale(d.cx), yScale(d.cy));

  })
  .on("mouseout", function(d, i) {

    d3.select(this).attrs({
        "stroke": "none"
      })
      .style("fill", function(d) {
        return colorize(colorScale(d.radius));
      });
  })
  //      if enabled will not snap to element
  //            .on('mousemove', function() {

//              var mouse = d3.mouse(this);
//              setCrosshair( mouse[0] ,  mouse[1] );
//            })
.transition()
  .attr("r", function(d) {
    return sizeScale(d.radius);
  });

eventRect.attrs({
    'width': width,
    'height': height
  })
  .styles({
    'opacity': 0.0,
    'display': null // not eligible for events
  })
  .on('mouseover', function() {
    // crosshair.attr("cursor", "crosshair");
    crosshair.style('display', null);

  })
  .on('mouseout', function() {
    crosshair.style('display', 'none');

  })
  .on('mousemove', function handleMouseMove() {

    var mouse = d3.mouse(this); // this == eventrect

    var x = mouse[0];
    var y = mouse[1];

    setCrosshair(x, y);

  });

function setCrosshair(x, y) {

  d3.select('#focusLineX')
    .attr('x1', x)
    .attr('y1', 0)
    .attr('x2', x)
    .attr('y2', height + 6);

  d3.select('#focusLineY')
    .attr('x1', -6)
    .attr('y1', y)
    .attr('x2', width)
    .attr('y2', y);

  d3.select("#focusLineXLabel")
    .attr("x", x)
    .attr("y", height + 12)
    .text(formatDecimal(xScale.invert(x)));
  d3.select("#focusLineXLabelBackground")
    .attr("transform", "translate( " + (x - crosshairSettings.labelWidth * 0.5) + " , " + (height + 5) + " )")
    .text(formatDecimal(xScale.invert(x)));

  d3.select("#focusLineYLabel")
    .attr("transform", "translate( -9, " + y + ")")
    .text(formatDecimal(yScale.invert(y)));
  d3.select("#focusLineYLabelBackground")
    .attr("transform", "translate( " + -crosshairSettings.labelWidth + ", " + (y - 8) + ")")

}