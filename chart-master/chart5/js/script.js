// Parse Numbers to Float - https://prcweb.co.uk/lab/what-makes-us-happy/
function parseData(d) {
  'use strict';
  var keys = _.keys(d[0]);
  return _.map(d, function(d) {
    var o = {};
    _.each(keys, function(k) {
      if( k == 'Pais' || k == 'Codigo') // Prevent Strings Being Parsed
        o[k] = d[k];
      else
        o[k] = parseFloat(d[k]);
    });
    return o;
  });
}

// Find min and maxes (for the scales)
function getBounds(d, paddingFactor) {
  paddingFactor = typeof paddingFactor !== 'undefined' ? paddingFactor : 1;

  var keys = _.keys(d[0]), b = {};
  _.each(keys, function(k) {
    b[k] = {};
    _.each(d, function(d) {
      if(isNaN(d[k]))
        return;
      if(b[k].min === undefined || d[k] < b[k].min)
        b[k].min = d[k];
      if(b[k].max === undefined || d[k] > b[k].max)
        b[k].max = d[k];
    });
    b[k].max > 0 ? b[k].max *= paddingFactor : b[k].max /= paddingFactor;
    b[k].min > 0 ? b[k].min /= paddingFactor : b[k].min *= paddingFactor;
  });
  return b;
}

// Force-Directed Scatterplot
// Source: https://bl.ocks.org/rpgove/10603627
var data = d3.csv.parse( d3.select("pre#data").text() );
'use strict';
// Resolve collisions between nodes.
function collide(alpha) {
  var quadtree = d3.geom.quadtree(data);
  return function (d) {
    var r = d.radius + radius + 5,
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
    quadtree.visit(function (quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var qx = d.x - quad.point.x,
            qy = d.y - quad.point.y,
            l = Math.sqrt(qx * qx + qy * qy),
            qr = d.radius + quad.point.radius + (d.color !== quad.point.color);
        if (l < qr) {
          l = (l - qr) / l * alpha;
          qx = qx * l;
          qy = qy * l;
          d.x = d.x - qx;
          d.y = d.y - qy;
          quad.point.x += qx;
          quad.point.y += qy;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}

function moveTowardDataPosition(alpha) {
  return function (d) {
    d.x += (xScale(d[xVar]) - d.x) * 0.1 * alpha;
    d.y += (y(d[yVar]) - d.y) * 0.1 * alpha;
  };
}

function tick(e) {
  node.each(moveTowardDataPosition(e.alpha));
  node.each(collide(e.alpha, false));
  node
  .attr("cx", function (d) { return d.x; })
  .attr("cy", function (d) { return d.y; });
  flags
  .attr('style', function (d) {
    var styleString;
    styleString = 'top:';
    styleString += d.y + 88;
    styleString += 'px; left: ';
    styleString += d.x + 25;
    styleString += 'px;';
    return styleString;
  });

}



data = parseData(data);// Parse numbers to Float

var xVar = "Participações",
    yVar = "Melhor Posição",
    xVarOptions = [
      "Sede", 
      "Participações", 
      "PIB", 
      "População", 
      "IDH"
    ],
    descriptions = { 
      "População" : "População", 
      "Host" : "Quantas vezes sediou uma copa do mundo", 
      "PIB" : "PIB", 
      "Participações" : "Número de participações em copas",
      "IDH": "IDH" 
    },
    //empty for changing xScale
    xScale,
    // Gets max and min
    bounds = getBounds(data, 1),
    formatValue = d3.format(".2s"),
    // Change tick format value
    thisTickFormat = function (d) {
      return formatValue(d).replace('G', 'B');
    },
    margin = {top: 20, right: 20, bottom: 20, left: 20},
    padding = margin,
    outerWidth = $('.wrapper').width(),
    outerHeight = 400,
    innerWidth = outerWidth - margin.left - margin.right,
    innerHeight = outerHeight - margin.top - margin.bottom,
    width = innerWidth - padding.left - padding.right,
    height = innerHeight - padding.top - padding.bottom,
    radius = 10,
    //x axis scale
    x = d3.scale.log().base(2).range([0, width]),
    // y axis scale
    y = d3.scale.log().base(2).range([0, height]),
    // Declare Axis
    xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(thisTickFormat),
          yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format("d")),
    force,
    node,
    flags,
    // Dom Elements
    container,
    circles,
    svg,
    dl, span;

// THE CREATION
// Create the Container
container = d3.select(".g-container");
// Create the SVG
svg = container
  .append("svg")
  .attr("width", outerWidth)
  .attr("height", outerHeight);


svg.append("g").attr("class", "g-circles")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

circles = svg.select("g").append("g");

// Create the nodes
node = circles.selectAll(".dot")
  .data(data)
  .enter()
  .append("circle")
  .attr("class", "dot")
  .attr("r", radius)
  .attr("cx", function (d) { return x(d[xVar]); })
  .attr("cy", function (d) { return y(d[yVar]); })
  .style("fill", function (d) { return 'transparent'; });

// Create the viz.
var viz = container
  .insert("div", ':first-child')
  .attr("class", "g-dados");

var flagName = viz.append('div')
  .attr("class", "f32 flag-name");

var allData = viz.append('div')
  .attr("class", "all-data");


// Create THE FORCE
force = d3.layout.force()
  .nodes(data)
  // .links(data)
  .size([innerWidth, innerHeight])
  .on("tick", tick)
  .charge(20)
  .gravity(0)
  .chargeDistance(20);

// Create the Visualization
flagName.append("span").attr("class", "flag br");
flagName.append("span").text("Brasil");


var dataMelhorPosicao = allData.append('div').attr('data-type', 'Melhor Posição');
dataMelhorPosicao.append('span').text("Melhor Posição");;
dataMelhorPosicao.append('span').attr("class", "first-dado").text("1º Lugar");

var dataSede = allData.append('div').attr('data-type', 'Sede');
dataSede.append('span').text("Melhor Posição");;
dataSede.append('span').text("1 vez");

var dataParticipacoes = allData.append('div').attr('data-type', 'Participações');
dataParticipacoes.append('span').text("Participações");;
dataParticipacoes.append('span').text("19");

var dataPIB = allData.append('div').attr('data-type', 'PIB');
dataPIB.append('span').text("PIB (US$)");;
dataPIB.append('span').text("2.2B");

var dataPopulacao = allData.append('div').attr('data-type', 'População');
dataPopulacao.append('span').text("População");;
dataPopulacao.append('span').text("200M");

var dataIDH = allData.append('div').attr('data-type', 'IDH');
dataIDH.append('span').text("IDH");;
dataIDH.append('span').text("0.730");


// Create the Flags
flags = container.append('div')
  .attr("class", "g-flags")
  .append("ul")
  .attr('class',  'f32')
  .selectAll("li")
  .data(force.nodes())
  .enter().append('li')
  .attr('class',  function (d) {
    return 'flag ' + d.Codigo;
  })
  .on("mouseover", function (d) {
    d3.select('.flag-name span:last-child')
    .html(d.Pais);
    d3.select('.flag-name .flag')
    .attr('class', 'flag ' + d.Codigo);
    d3.select(".all-data div[data-type='Melhor Posição'] span:last-child")
    .html(d["Melhor Posição"] + "º Lugar");
    d3.select(".all-data div[data-type='Sede'] span:last-child")
    .html(d.Sede === 1 ? d.Sede + " vez" : (d.Sede < 2 ? "Nunca" : d.Sede + " vezes"));
    d3.select(".all-data div[data-type='Participações'] span:last-child")
    .html(d["Participações"]);
    formatValue = d3.format(".2s");
    var thisFormatValue = function (d) {
      return formatValue(d).replace('G', 'B');
    };
    d3.select(".all-data div[data-type='PIB'] span:last-child")
    .html(thisFormatValue(d.PIB));
    d3.select(".all-data div[data-type='População'] span:last-child")
    .html(thisFormatValue(d["População"]));
    formatValue = d3.format(".3f");
    d3.select(".all-data div[data-type='IDH'] span:last-child")
    .html(formatValue(d.IDH));
  });

// Set scale domain
x.domain(d3.extent(data, function (d) { return d[xVar]; })).nice();
y.domain(d3.extent(data, function (d) { return d[yVar]; })).nice();

// Set initial positions
data.forEach(function (d) {
  d.x = x(d[xVar]);
  d.y = y(d[yVar]);
  d.radius = radius;
});
// Create the x Axis Menu
d3.select('#x-axis-menu')
  .selectAll('label')
  .on('click', function (d) {
    force.stop();
    xVar = d3.select(this).attr('for');
    updateChart();
    updateMenus();
});

// Render axes
svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(40," + (height + 28) +  ")")
  .call(xAxis);

svg.append("g")
  .attr("class", "y axis")
  .attr('transform', 'translate(40, 20)')
  .call(yAxis)
  .append("text");


function makeXAxis(s) {
  s.call(d3.svg.axis()
         .scale(xScale)
         .orient("bottom")
         .tickSize(-height - 7, 0, 0)
         .tickFormat(thisTickFormat));
}

function makeYAxis(s) {
  s.call(d3.svg.axis()
         .scale(y)
         .orient("left")
         .tickSize(-width, 0, 0)
         .tickFormat(function (d) { return d + "º"; }));
}

function updateScales() {
  switch (xVar) {
    case "População":  //Country population
      formatValue = d3.format(".2s");
      thisTickFormat = function (d) {
        return formatValue(d).replace('G', 'B');
      };
      xScale = d3.scale.log().base(2)
      .range([0, width])
      .domain(d3.extent(data, function (d) { return d[xVar]; })).nice();
      break;
    case "Sede":  //How many times this country hosted a world cup
      formatValue = d3.format("d");
      xScale = d3.scale.linear()
      .range([0, width])
      .domain([bounds[xVar].min, bounds[xVar].max]);
      break;
    case "PIB":   // GDP - Gross Domestic Product
      formatValue = d3.format(".2s");
      xScale = d3.scale.log().base(2)
      .range([0, width])
      .domain([bounds[xVar].min, bounds[xVar].max]);
      break;
    case "Participações": // How many times this country went to a world cup
      formatValue = d3.format("d");
      xScale = d3.scale.linear()
      .range([0, width])
      .domain([bounds[xVar].min, bounds[xVar].max]);
      break;
    case "IDH":
      formatValue = d3.format(".2f");
      xScale = d3.scale.linear()
      .range([0, width])
      .domain([bounds[xVar].min, bounds[xVar].max]);
      break;
  }
}
function updateChart() {
  updateScales();
  d3.selectAll('.dot')
  .transition()
  .duration(1000)
  .ease('quad-out')
  .attr('cx', function (d) { return xScale(d[xVar]); })
  .attr('cy', function (d) { return y(d[yVar]); });

  //Also update the axes
  d3.select('.x')
  .transition()
  .call(makeXAxis);
  d3.select('.y')
  .transition()
  .call(makeYAxis);
  // Update axis labels
  d3.select('.label')
  .text(descriptions[xVar]);
  // Start THE FORCE
  force.start();
}

function updateMenus() {
  d3.select('#x-axis-menu')
  .selectAll('a')
  .classed('active', function (d) {
    return d === xVar;
  });
}

updateChart();
updateMenus();