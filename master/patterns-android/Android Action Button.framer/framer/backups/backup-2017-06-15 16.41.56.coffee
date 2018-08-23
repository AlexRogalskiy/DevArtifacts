# Set initial state for media and camera icon
media.opacity = 0
camera.opacity = 0

# Add states and animation option to media icon
media.states.expand = 
	y: fab.y + -80
	rotation: 0
	opacity: 1

media.animationOptions =
	curve: Spring(0.6)
	time: 0.8

# Add states and animation option to camera icon
camera.states.expand = 
	y: fab.y + -160
	rotation: 0
	opacity: 1

camera.animationOptions =
	curve: Spring(0.6)
	time: 0.8

# Add states and animation option to plus icon
add.states.rotate = 
	rotation: 45

add.animationOptions =
	curve: Spring(0.9)
	time: 0.5

# Cycle states on click
fab.onClick (event, layer) ->
	media.stateCycle()

fab.onClick (event, layer) ->
	camera.stateCycle()
	
fab.onClick (event, layer) ->
	add.stateCycle()