const control = document.getElementById('control'),
	  controlP = document.getElementById('controlPoint'),
	  output = document.getElementById('output'),
	  path = document.getElementById('curve'),
	  indicator = document.getElementById('indicator'),
	  d = 640;

let value;
function handleChange(e) {
	value = (e.target.valueAsNumber*d) / 100;
	path.setAttribute('d', `M0 ${d*.5} Q ${d*.5} ${value}, ${d} ${d*.5}`);
	output.innerText = `M0 ${d*.5} Q ${d*.5} ${value}, ${d} ${d*.5}`;
	controlP.setAttribute('cy', value);
	indicator.setAttribute('d', `M0 ${d*.5} L ${d*.5} ${value} L ${d} ${d*.5}`);
}

control.addEventListener('input', handleChange);