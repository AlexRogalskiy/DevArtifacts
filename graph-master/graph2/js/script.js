var data = {
  "name": "A1",
  "children": [
    {
      "name": "B1",
      "children": [
        {
          "name": "C1",
          "value": 100
        },
        {
          "name": "C2",
          "value": 300
        },
        {
          "name": "C3",
          "value": 200
        }
      ]
    },
    {
      "name": "B2",
      "value": 200
    }
  ]
};
var root = d3.hierarchy(data);

var handleEvents = function( selection ) {
  selection.on('mouseover', function() {
    let g = d3.select(this);
    let n = g.select('.the-node');

    if(n.classed('solid')) {
      n.transition().duration(400)
      .style('fill', "rgba(211,0,0,0.8)" )
      .attr('r', 18);
    } else {
      n.transition().duration(400)
      .style('fill', "rgba(211,0,0,0.8)" );
    }
    
    g.select('.label')
      .transition().duration(700)
      .style('fill', 'white')
    
  })
  .on('mouseout', function() {
    let g = d3.select(this);
    let n = g.select('.the-node');
 
    if(n.classed('solid')) {
      n.transition().duration(400)
      .style('fill', "#696969" )
      .attr('r',14);
    }  else {
     n.transition().duration(400)
      .style('fill', "rgba(255,255,255,0.2)" )
    }
    g.select('.label')
      .transition().duration(700)
      .style('fill', "black")
  });
}      

/* TREE LAYOUT */


var treeLayout = d3.tree()
treeLayout.size([400,200]);
treeLayout(root);

var tree = d3.select('#tree g.nodes')

var treeNodes = tree.selectAll('g.node')
  .data(root.descendants())
  .enter()
  .append('g')
  .classed('node', true)
  .call(handleEvents)
  

treeNodes.append('circle')
  .classed('the-node solid', true)
  .attr('cx', d=> d.x)
  .attr('cy', d=> d.y)
  .attr('r', d => 14)
  .style("fill", "#696969");


treeNodes.append('text')
  .attr('class', 'label')
  .attr('dx', d => d.x)
  .attr('dy', d => d.y+4)
  .text(d => d.data.name)

var treeLinks = d3.select('#tree g.links')
  .selectAll('line.link')
  .data(root.links())
  .enter()
  .append('line')
  .classed('link', true)
  .attr("x1", d => d.source.x)
  .attr("y1", d => d.source.y)
  .attr("x2", d => d.target.x)
  .attr("y2", d => d.target.y)
  .style("stroke", "#5f5f5f")



/* CLUSTER LAYOUT */



var clusterLayout = d3.cluster()
    .size([400,200])
    (root);

var cluster = d3.select('#cluster g.nodes')

var clusterNodes = cluster.selectAll('g.node')
  .data(root.descendants())
  .enter()
  .append('g')
  .classed('node', true)
  .call(handleEvents)

clusterNodes.append('circle')
  .classed('the-node solid', true)
  .attr('cx', d=> d.x)
  .attr('cy', d=> d.y)
  .attr('r', 14)
  .style("fill", "#696969");

clusterNodes.append('text')
  .attr('class', 'label')
  .attr('dx', d=> d.x)
  .attr('dy', d=> d.y+4)
  .text( d => d.data.name)

var clusterLinks = d3.select('#cluster g.links')
  .selectAll('line.link')
  .data(root.links())
  .enter()
  .append('line')
  .classed('link', true)
  .attr("x1", d => d.source.x)
  .attr("y1", d => d.source.y)
  .attr("x2", d => d.target.x)
  .attr("y2", d => d.target.y)
  .style("stroke", "#5f5f5f");
 


/* TREEMAP LAYOUT  */



var treemapLayout = d3.treemap(); 
treemapLayout.size([400,200]);
treemapLayout.paddingOuter(20);
// treemapLayout.paddingInner(4);
/* paddingTop, paddingRight, Left and Bottom available */
treemapLayout.tile(d3.treemapSquarify.ratio(2))
/* .tile allows different tiling strategies:
   - treemapSquarify.ratio(n) (default) - using rect aspect ratio 
   - treemapSlice - tile horizontally
   - treemapDice - tile vertically
   - treemapSliceDice - alter each layer horizontal/vertical
*/

root.sum(d => d.value);
treemapLayout(root);

var treemapNodes = d3.select("#treemap g")
.selectAll("g")
.data(root.descendants())
.enter()
.append('g').attr('class', 'node')
.attr('transform', d => 'translate('+[d.x0, d.y0]+')')
.call(handleEvents)

treemapNodes
.append('rect')
.classed('the-node', true)
.attr("width", d => d.x1 - d.x0)
.attr("height", d => d.y1 - d.y0)
.style("fill", "rgba(255,255,255,0.2)")
.style('stroke', "#2f2f2f")

treemapNodes
.append('text')
.attr('class', 'label')
.attr('dx', d => 12)
.attr('dy', d => 14)
.text( d => d.data.name);



/* PACK LAYOUT */



var packLayout = d3.pack();
packLayout.size([400,200]);
packLayout.padding(10);

root.sum(d => d.value);
packLayout(root);

var packNodes = d3.select('#pack g')
.selectAll('g')
.data(root.descendants())
.enter()
.append('g').attr('class', 'node')
.attr('transform', d => 'translate('+[d.x, d.y]+')')
.call(handleEvents)
packNodes
.append('circle')
.classed('the-node', true)
.attr('r', d => d.r)
.style('fill', "rgba(255,255,255,0.2)")
.style('stroke', '#2f2f2f')

packNodes
  .append('text')
  .attr('class', 'label')
  .attr('dy', 4 )
  .attr('dx', 0 )
  .text( d => d.children === undefined ? d.data.name : '');



/* PARTITION LAYOUT */



var partitionLayout = d3.partition();
partitionLayout.size([400,200]);
partitionLayout.padding(2);
root.sum(d  => d.value);
partitionLayout(root);

var partitionNodes = d3.select('#partition g') 
.selectAll("g")
.data(root.descendants())
.enter()
.append('g').attr('class', 'node')
.attr('transform', d => 'translate('+[d.x0, d.y0]+')')
.call(handleEvents);

partitionNodes
.append('rect')
.classed('the-node', true)
.attr('width', d => d.x1 - d.x0)
.attr('height', d => d.y1 - d.y0)
.style('fill', 'rgba(255,255,255,0.2)')
.style('stroke', '#2f2f2f')

partitionNodes
.append('text')
  .attr('class', 'label')
  .attr('dx', 12)
  .attr('dy', 14)
  .text( d =>  d.data.name )



/* SUNBURST LAYOUT */



var sunburstLayout = d3.partition();

var radius = 100;
sunburstLayout.size([2*Math.PI, radius]);
// sunburstLayout.padding(2);

var arc= d3.arc()
.startAngle( function(d) { return d.x0 })
.endAngle(   function(d) { return d.x1 })
.innerRadius(function(d) { return d.y0 })
.outerRadius(function(d) { return d.y1 })

root.sum(d  => d.value);

sunburstLayout(root);

var main = d3.select('#partition-sunburst g')

var sunburstNodes = main.selectAll('g')
    .data(root.descendants())
    .enter()
    .append('g').attr("class", "node")
    .call(handleEvents)
var paths = sunburstNodes.append('path')
    .attr('d', arc)
    .classed('the-node', true)
    .style('fill', 'rgba(255,255,255,0.2)')
    .style('stroke', '#2f2f2f')

var labels = sunburstNodes.append("text") 
    .attr('class', 'label')
    .attr("transform", function(d) {
          return "translate(" + arc.centroid(d) 
          /*+ ") rotate(" + computeTextRotation(d) */+ ")"; }) 
    .attr("dx", "-4")  
    .attr("dy", ".5em") 
    .text(function(d) { return d.parent ? d.data.name : "" }); 

// https://bl.ocks.org/denjn5/f059c1f78f9c39d922b1c208815d18af
function computeTextRotation(d) {
    var angle = (d.x0 + d.x1) / Math.PI * 90; 
    return (angle < 180) ? angle - 90 : angle + 90;  
}
