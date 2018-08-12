var input = document.querySelector('input[type=text]')
var draw = SVG('drawing').viewbox(0, 0, 300, 140)
var text = draw.text(function(add) {
	add.tspan( input.value )
})

text
	.path('M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80')
	.animate(1000, '<>')
	.plot('M10 80 C 40 150, 65 150, 95 80 S 150 10, 180 80')
	.loop(true, true)

input.addEventListener('keyup', updateText(text))

function updateText(textPath) {
	return function() {
		textPath.tspan(this.value)
	}				
}