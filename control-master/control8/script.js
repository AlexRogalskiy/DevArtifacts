function $$(expr, con) { return [].slice.call((con || document).querySelectorAll(expr)); }

function testProperty(props) {
	var root = document.getElement;
	if(props in root.style) {
		root.classList.add(props.toLowerCase());
		return true;
	}
	root.classList.add('no-' + props.toLowerCase());
	return false;
}

function testValue(props, value) {
	var root = document.createElement('p');
	root.style[props] = value;
	if(root.style[props]) {
		root.classList.add(props.toLowerCase());
		return true;
	}
	root.classList.add('no-' + props.toLowerCase());
	return false;
}



var colors = [
	'#D6E055', // Agave
	'#082323', '#E6E2AF', '#A7A37E', '#EFECCA', '#046380', // Sandy stone beach
   	'#1C171D', '#FEE169', '#CDD452', '#F9722E', '#C9313D', // Sushi Maki
   	'#2E95A3', '#50B8B4', '#C6FFFA', '#E2FFA8'  // Agave
   ],
   palette = document.querySelector('.palette'),
   template = palette.firstElementChild;
   
function addColor(template) {
	var li = template.cloneNode(true);
	var color = colors.pop();
	colors.unshift(color);
	li.style.background = color;
	palette.insertBefore(li, template.nextSibling);
}

palette.onclick = function(evt) {
	var button = evt.target;
	
	if (button.className == 'add') {
		addColor(button.parentNode.parentNode);
	}
	else if (button.className == 'delete') {
		var li = button.parentNode.parentNode;
		li.parentNode.removeChild(li);
	}
}
