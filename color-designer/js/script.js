//-------------------------------------------- Colour Visualisation Tool

$(".swatches li button").on('click', function(event){
	event.preventDefault();
	// Get the target area from curret parent
	var target = $(this).closest('.swatches').attr('class').split(' ')[0];
	// Get the color currently assigned to current element
	var color = $(this).css('background-color');
	// Clear the in use indicator
	$(this).closest('.swatches').find('.in-use').toggleClass('in-use');
	// Show the user that this swatch is in use
	$(this).closest('li').toggleClass('in-use');
	// Apply the color to the target area
	$(".house ." + target + " *").attr('style', "fill:" + color);
});

//----------------------- Tabs

$(".colour-tool .sections > li").on('click keypress', function(){
	if(!$(this).is('.open')) {
		// Not currently open
		// Close others
		$(".colour-tool .open").toggleClass('open').find('.swatches').slideToggle();
		// Open the current option
		$(this).toggleClass('open').find('.swatches').slideToggle();			
	} 
});