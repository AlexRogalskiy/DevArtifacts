function add_element() {
    var d = document.getElementById('second');
    var p = document.createElement('p');
    var t = document.createTextNode('Paragraph in the second div');
    p.appendChild(t);
    d.appendChild(p);   
}
function go() {
    var b = document.createElement('button');
    var t = document.createTextNode('Click me');
    b.appendChild(t);
    b.addEventListener('click', add_element);
    var d = document.getElementById('second');
    d.appendChild(b);
}
window.addEventListener('load', go);