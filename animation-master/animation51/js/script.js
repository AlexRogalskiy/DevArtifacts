
var data = [
  {"id": 0, "name": "project1", "r": 50, "type": "project" },
  {"id": 0, "name": "project2", "r": 40, "type": "project"},
  {"id": 0, "name": "project3", "r": 30, "type": "project" },
  {"id": 0, "name": "project4", "r": 30, "type": "project" },
  {"id": 0, "name": "project5", "r": 40, "type": "project" },
  {"id": 1, "name": "domain1", "r": 50, "type": "domain" },
  {"id": 1, "name": "domain1", "r": 32, "type": "domain" },
  {"id": 1, "name": "domain1", "r": 50, "type": "domain" },
  {"id": 1, "name": "domain1", "r": 40, "type": "domain" },
  {"id": 1, "name": "domain1", "r": 30, "type": "domain" },

  {"id": 2, "name": "constrain1", "r": 40, "type": "constrain" },
  {"id": 2, "name": "constrain2", "r": 30, "type": "constrain" },
  {"id": 2, "name": "constrain3", "r": 45, "type": "constrain" },
    {"id": 2, "name": "constrain4", "r": 45, "type": "constrain" },
    {"id": 2, "name": "constrain5", "r": 45, "type": "constrain" },
  
  {"id": 3, "name": "source1", "r": 40, "type": "source" },
  {"id": 3, "name": "source2", "r": 30, "type": "source" },
  {"id": 3, "name": "source3", "r": 45, "type": "source" },
    {"id": 3, "name": "source4", "r": 45, "type": "source" },
    {"id": 3, "name": "source5", "r": 45, "type": "source" },
  
  {"id": 4, "name": "bu1", "r": 50, "type": "bu" },
  {"id": 4, "name": "bu2", "r": 32, "type": "bu" },
  {"id": 4, "name": "bu3", "r": 50, "type": "bu" },
  {"id": 4, "name": "bu4", "r": 40, "type": "bu" },
  {"id": 4, "name": "bu5", "r": 30, "type": "bu" }
];

var width = 700,
    height = 700;

var fill = d3.scale.category10();

var nodes = [], labels = [],
    foci = [{x: 0, y: 0}, {x: 0, y: 350}, {x: 175, y : 175},{x: 350, y: 0},{x: 350, y : 350}];

var svg = d3.select("body").append("svg")
    .attr("width", "100%")
    .attr("height", height)
    //.attr("domflag", '');

var force = d3.layout.force()
    .nodes(nodes)
    .links([])
    .charge(-400)
    //.chargeDistance(200)
    .gravity(0.1)
    .friction(0.8)
    .size([width, height])
    .on("tick", tick);

//var node = svg.selectAll("circle");
var node = svg.selectAll("g");

var counter = 0;

function tick(e) {
  var k = .1 * e.alpha;

  // Push nodes toward their designated focus.
  nodes.forEach(function(o, i) {
    o.y += (foci[o.id].y - o.y) * k;
    o.x += (foci[o.id].x - o.x) * k;
  });

  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

}


var timer = setInterval(function(){

  if (nodes.length > data.length-1) { clearInterval(timer); return;}

  var item = data[counter];
  nodes.push({id: item.id, r: item.r, name: item.name, type: item.type});
  force.start();

  node = node.data(nodes);
var n;
  if(item.type == "project") {
    n = node.enter().append("g")
        .attr("class", "project")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .style('cursor', 'pointer')
        .on('mousedown', function() {
           var sel = d3.select(this);
           sel.moveToFront();
        });

    n.append("circle")
      .attr("r",  function(d) { return d.r; });
     n.append("text")
      .text(function(d){
          return d.name;
      })
      .style("font-size", function(d) {
          return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 16) + "px"; 
       })
      .attr("dy", ".35em");
  } else if(item.type == "domain") {
    n = node.enter().append("g")
        .attr("class", "domain")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .style('cursor', 'pointer')
        .on('mousedown', function() {
           var sel = d3.select(this);
           sel.moveToFront();
        });

    n.append("circle")
      .attr("r",  function(d) { return d.r; });
     n.append("text")
      .text(function(d){
          return d.name;
      })
      .style("font-size", function(d) {
          return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 16) + "px"; 
       })
      .attr("dy", ".35em");
    
  } else if(item.type == "source") {
    n = node.enter().append("g")
        .attr("class", "source")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .style('cursor', 'pointer')
        .on('mousedown', function() {
           var sel = d3.select(this);
           sel.moveToFront();
        });

    n.append("circle")
      .attr("r",  function(d) { return d.r; });
     n.append("text")
      .text(function(d){
          return d.name;
      })
      .style("font-size", function(d) {
          return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 16) + "px"; 
       })
      .attr("dy", ".35em");
    
  } else if(item.type == "bu") {
    n = node.enter().append("g")
        .attr("class", "bu")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .style('cursor', 'pointer')
        .on('mousedown', function() {
           var sel = d3.select(this);
           sel.moveToFront();
        });

    n.append("circle")
      .attr("r",  function(d) { return d.r; });
     n.append("text")
      .text(function(d){
          return d.name;
      })
      .style("font-size", function(d) {
          return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 16) + "px"; 
       })
      .attr("dy", ".35em");
    
  } else if(item.type == "constrain") {
    n = node.enter().append("g")
        .attr("class", "constrain")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .style('cursor', 'pointer')
        .on('mousedown', function() {
           var sel = d3.select(this);
           sel.moveToFront();
        });

    n.append("circle")
      .attr("r",  function(d) { return d.r; });
     n.append("text")
      .text(function(d){
          return d.name;
      })
      .style("font-size", function(d) {
          return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 16) + "px"; 
       })
      .attr("dy", ".35em");
    
  }
 

  counter++;
}, 100);


d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

function resize() {
  width = window.innerWidth;
  force.size([width, height]);
  force.start();
}

d3.select(window).on('resize', resize);