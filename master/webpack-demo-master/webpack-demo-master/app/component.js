module.exports = function() {
	var div = document.createElement('div');
	var h1 = document.createElement('h1');
	var p = document.createElement('p');
	var button = document.createElement('button');
	button.innerHTML = 'Click Me! But I do nothing :(';
	p.innerHTML = "this is awesome";
	h1.innerHTML = "Hello World";

	// styles
	div.style.textAlign = 'center';
	div.style.width = '50vw';
	div.style.margin= '0px auto';
	div.style.color = '#31abde';
	button.style.width = button.style.height;
	button.style.backgroundColor = 'white';
	

	elements = [h1, p, button];

	function build(elems) {
		for (i = 0; i < elems.length; i++) {
			div.appendChild(elems[i]);
		}
	}
	build(elements);
	return div;
};