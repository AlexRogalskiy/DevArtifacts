$(function(){
  var button = $(".btn");
  button.on("click", function(){
    var $this = $(this);
    var progress = $this.find(".progress");
    var content = $this.find(".content")
    
		if( $("[type=checkbox]").is(':checked') ){
     console.log("error true")
      $this.addClass("error");
      content.animate({top : "-40px"}, 50);
      //content.text("Error, invalid file type");
    }else{
      content.text("Saving...");
      progress
    		.animate({width : "20%"})
    		.delay(100)
    		.animate({width : "60%"})
    		.delay(400)
    		.animate({width : "100%"}, 100, function(){
      		progress.fadeOut(function(){progress.css("width" , 0);
           content.animate({top : "40px"});
           $this.addClass("success");
           setTimeout(function(){
            content.text("Save & Apply");
            content.animate({top : "0px"});
             $this.removeClass("success");
            button.attr("disabled" , "disabled");
           }, 2000)                         
         })//callback
    	});   
    }//if
  });//button
  
  //RESET-------------------//
  $("a").on("click" , function(){
    button.removeAttr( "disabled" ).removeClass("success, error");
   $(".content").text("Save & Apply").animate({top : "0px"}, 50)
   $(".progress").css('display' , 'block');
   $("[type=checkbox]").attr('checked', false);
	return false;
  });
})//ready