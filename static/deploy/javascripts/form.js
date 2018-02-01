(function() {
  $(function() {
    return $("form").submit(function(event) {
      var element;
      event.preventDefault();
      element = $("<p>You've been added to the list!</p>");
      element.insertAfter($(this));
      return $(this).hide();
    });
  });
})(this);
