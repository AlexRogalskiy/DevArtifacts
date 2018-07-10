$('#shake-type').change(function(){
	var newShake = $(this).val();
	var regex = /(\s)*(shake-.*?)(?=\s)/g; 
	$('.glass').removeClass('shake-hard shake-slow shake-little shake-horizontal shake-vertical shake-rotate shake-opacity shake-crazy').addClass(newShake);
})