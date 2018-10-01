(function($){
	function floatLabel(inputType){
		$(inputType).each(function(){
			var input = $(this).find("input, select, textarea");
      var label = $(this).find("label");
			// on focus add cladd active to label
			input.focus(function(){
				input.next().addClass("active");
        console.log("focus");
			});
			//on blur check field and remove class if needed
			input.blur(function(){
				if(input.val() === '' || input.val() === 'blank'){
					label.removeClass();
				}
			});
		});
	}
	// just add a class of "floatLabel to any group you want to have the float label interactivity"
	floatLabel(".float-label");
  
  
//////  Just a bunch of fluff for other interactions  ////////////////////////////////////////////////////////  
  
  //for the pw field - toggle visibility
  $(".eye").on("click" , function(){
    var $this = $(this);
    if( !$this.is(".show") ){
      $this.addClass("show")
           .removeClass("fa-eye-slash")
           .addClass("fa-eye").next()
           .attr("type" , "text");
    }else{
      $this.removeClass("show")
           .addClass("fa-eye-slash")
           .removeClass("fa-eye")
           .next().attr("type" , "password");
    }
  });
  
  //modal close
  $(".close").on("click" , function(){
    $(this).parent().removeClass("show");
    $("#clear").click();
  })
  
  //submit button dirty validation ^-^
  $("button[type='submit']").on("click" , function(){
    if( !$("input, select, textarea").val() ){ 
      $(this).text("Please enter all Fields");
    }else{
      $(".confirm").addClass("show");
    }
    return false;
  })
  //just for reset button
  $("#clear").on("click" , function(){
    $(".active").removeClass("active");
  });
  
})(jQuery);