$('#pixel_canvas').on("click", "td", function() {
																				$(this).css("background-color", $("input[type='color']").val());
																				});

$('#sizePicker').submit(function makeGrid(){
let rows = $("#input_height").val();
let columns = $("#input_width").val();
var table = $('#pixel_canvas');

for(x = 0; x <= rows; x++) {
	var row = $('<tr></tr>').appendTo(table);

  for(y = 0; y <= columns; y++) {
  var column = $('<td> </td>').appendTo(row);
  }
}
return false;
});


$("input[type='reset']").click(function(){
	
	$('tr td').remove();
	$("#sizePicker").trigger("reset");
})



// $( 'td' ).on( 'mouseover', function() {
//     $( 'table' ).addClass( '.after ' );   
// });

$( '#pixel_canvas' ).on( 'click', 'td', function() { 
 $( '#pixel_canvas' ).addClass( 'after ' );   
});

