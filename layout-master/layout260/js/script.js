$(document).ready(function() {
  //check if collapsible is shown
  $(".collapse").on("shown.bs.collapse", function() {
    //then check if there was a click
    $(document).click(function(event) {
      //exclude the click was on the form
      if (!$(event.target).hasClass("#")) {
        //then hide it
        $(".collapse").collapse("hide");
      }
    });
  });
});

// code from https://stackoverflow.com/a/43780197