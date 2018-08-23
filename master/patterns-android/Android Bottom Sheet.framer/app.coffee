# Add show state to bottom sheet
bottomSheet.states.show = 
	height: 300

# Set animation options for bottom sheet
bottomSheet.animationOptions =
	curve: Spring(0.85)
	time: 0.8

# Add flipped state to arrow icon
arrow.states.flip = 
	rotation: -180

# Set animation options for arrow icon
arrow.animationOptions = 
	curve: Spring(0.85)
	time: 0.8

# Add click event to FAB and trigger bottom sheet
fab.onClick (event, layer) ->
	bottomSheet.stateCycle()

# Add click event to FAB and trigger arrow icon
fab.onClick (event, layer) -> 
	arrow.stateCycle()
