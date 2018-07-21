var nodes = [
    {name: "JavaScript", expertise: .85, breadth: .03, category: 'tech'},
    {name: "CSS", expertise: .95, breadth: .02, category: 'tech'},
    {name: "UI Design", expertise: .9, breadth: -.0, category: 'design'},
    {name: "UX Research", expertise: .4, breadth: .12, category: 'design'},
    {name: "UX Design", expertise: .75, breadth: .0, category: 'design'},
    {name: "IA", expertise: .8, breadth: -.05, category: 'design'},
    {name: "Python", expertise: .15, breadth: .2, category: 'tech'},
    {name: "PHP", expertise: .8, breadth: .05, category: 'tech'},
    {name: "Raspberry Pi", expertise: .2, breadth: .6, category: 'tech'},
    {name: "Arduino", expertise: .22, breadth: .42, category: 'tech'},
    {name: "Objective-C", expertise: .15, breadth: .5, category: 'tech'},
    {name: "SQL", expertise: .75, breadth: -.1, category: 'tech'},
    {name: "MongoDB", expertise: .3, breadth: -.1, category: 'tech'},
    {name: "Robotics", expertise: .15, breadth: -.2, category: 'tech'},
    {name: "3D design", expertise: .6, breadth: .1, category: 'design'},
    {name: "Typography", expertise: .7, breadth: -.05, category: 'design'},
    {name: "Redis", expertise: .45, breadth: -.1, category: 'tech'},
    {name: "Music Production", expertise: .15, breadth: -.9, category: 'other'},
    {name: "Industrial Design", expertise: .2, breadth: -.5, category: 'design'},
    {name: "Beer", expertise: .1, breadth: .8, category: 'other'},
    {name: "Gaming", expertise: .1, breadth: -.8, category: 'other'},
    {name: "Architecture", expertise: .1, breadth: -.7, category: 'design'},
    {name: "Economics", expertise: .05, breadth: -1, category: 'other'},
    {name: "Branding", expertise: .1, breadth: .3, category: 'design'},
    {name: "Animation", expertise: .55, breadth: -.05, category: 'tech'},
    {name: "Film", expertise: .1, breadth: -.3, category: 'other'},
    {name: "3D Printing", expertise: .1, breadth: .6, category: 'tech'},
    {name: "Fighter Jets", expertise: .05, breadth: -.45, category: 'other'},
    {name: "Home Audio", expertise: .1, breadth: .45, category: 'other'},
  ],
  nodeContainer = document.querySelector('.nodes');


createNodes();


function createNodes() {
  var i, l = nodes.length, n, nElem, nElemShape;

  for  (i = 0; i < l; i++) {
    n = nodes[i];
    nElem = document.createElement('div');
    nElem.className = 'node';
    nElem.style.opacity = 0;

    nElemShape = document.createElement('div');
    nElemShape.innerHTML = '&nbsp; &nbsp; &nbsp; &nbsp; ' + n.name;
    nElemShape.className = 'node-shape category-' + n.category;


    nElem.appendChild(nElemShape);
    nodeContainer.appendChild(nElem);
    nodes[i].elem = nElem;
  }

}


function animate() {
  var i, l = nodes.length, n, nElem, x, y, trans;

  for (i = 0; i < l; i++) {
    n = nodes[i];
    x = Math.round(n.breadth * nodeContainer.offsetWidth / 2);
    y = - Math.round(.025 + n.expertise * nodeContainer.offsetHeight * .95);    
    transform(n.elem, 'translate(' + x + 'px, ' + y + 'px)');
    
    n.elem.style.transitionDelay = i/16 + 's';
    n.elem.style.opacity = 1; 
  }
}

$(window).resize(function () {
  animate();
});

animate();


function transform (elem, trans) {
    var style = elem.style;
    style.webkitTransform = trans;
    style.MozTransform = trans;
    style.OTransform = trans;
    style.msTransform = trans;
    style.transform = trans;
    return elem;
};
 