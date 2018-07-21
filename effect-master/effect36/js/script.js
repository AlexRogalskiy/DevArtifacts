// Below stores the colour for the cell
$("#pixel_canvas").on("click", "td", function() {
	let color = $("input[type='color']").val();
	$(this).css("background-color", color);
});

// Below generates the grid
$("#sizePicker").submit(function makeGrid() {
	let rows = $("#input_height").val();
	let columns = $("#input_width").val();
	const table = $("#pixel_canvas");

	for (x = 0; x < rows; x++) {
		let row = $("<tr></tr>").appendTo(table);

		for (y = 0; y < columns; y++) {
			let column = $("<td> </td>").appendTo(row);
		}
	}
	return false;
});

// Reset button
$("input[type='reset']").click(function() {
	$("#pixel_canvas").removeClass("after");
	$("tr td").remove();
	$("#sizePicker").trigger("reset");
});

// Below pauses the animation
$("#pixel_canvas").on("click", "td", function() {
	$(this).css("animation-play-state", "paused");
});

// Below resumes the animation

$("#pixel_canvas").on("dblclick", "td", function() {
	$(this).css("animation-play-state", "running");
});

$("#pixel_canvas").on("click", "td", function() {
	$(this).draggable();
});
