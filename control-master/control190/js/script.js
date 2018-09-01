$(document).ready(function (){
	$('#myInput').keyup( function() {
		var $this = $(this);
		if($this.val().length > 20)
			$this.val($this.val().substr(0, 20));			
	});
});