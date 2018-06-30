// # Place all the behaviors and hooks related to the matching controller here.
// # All this logic will automatically be available in application.js.
// # You can use CoffeeScript in this file: http://coffeescript.org/


  $(".fold-table tr.view").on("click", function() {
      if ($(this).hasClass("open")) {
          $(this).removeClass("open").next(".fold").removeClass("open");
      } else {
          $(".fold-table tr.view").removeClass("open").next(".fold").removeClass("open");
          $(this).addClass("open").next(".fold").addClass("open");
      }
  });
