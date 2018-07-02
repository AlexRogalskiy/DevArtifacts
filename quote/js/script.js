$(document).ready(function() {
  var tweetUrl;

  function getQuote() {
    $.ajax({
      method: "GET",
      jsonp: "jsonp",
      dataType: "jsonp",
      url: "https://api.forismatic.com/api/1.0/",
      data: {
        method: "getQuote",
        format: "jsonp",
        lang: "en"
      },
      success: function(data) {
        $("#quote-text").html(data.quoteText);
        tweetUrl = encodeURI("https://twitter.com/intent/tweet?text=" + data.quoteText + "\n- " + data.quoteAuthor);
        if(!data.quoteAuthor) {
          data.quoteAuthor = "Unknown";
        }
        $("#quote-author").html("- " + data.quoteAuthor);
        enableButton();
      },
      error: function() {
        getQuote();
      },
      cache: false
    });
  }

  getQuote();

  $("#get-new-quote").click(function() {
    disableButton();
    getQuote();
  });

  $("#tweet").click(function() {
    window.open(tweetUrl, "_blank");
  });

  function disableButton() {
    $("#get-new-quote").html("Loading Quote...");
    $("#get-new-quote").attr("disabled", "true");
  }

  function enableButton() {
    $("#get-new-quote").html("New Quote");
    $("#get-new-quote").removeAttr("disabled");
  }
});
