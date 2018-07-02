var currentPage = 1;

function search() {
  $("#results").html("");
  var toSearch = $("#search-form").val();

  $.getJSON("https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=" + toSearch + "&sroffset=" + ((currentPage - 1) * 10) + "&callback=?", function(json) {
    if(json.query) {
      var suggestion = json.query.searchinfo.suggestion;
      var hits = json.query.searchinfo.totalhits;

      if(suggestion) {
        $("#suggestion").html("Did you mean <a href='javascript:void(0)' onclick='suggestSearch(\"" + suggestion + "\")'>" + suggestion + "</a>?");
      } else {
        $("#suggestion").html("");
      }

      if(hits) {
        $("#hits").html(hits + " results");
      } else {
        $("#results").html("<h1>No results found</h1>");
        $("#hits").html("");
      }

      json.query.search.forEach(function(x) {
        $("#results").append("\
          <div class='result'>\
            <a href='https://en.wikipedia.org/wiki/" + x.title + "'>" + x.title + "</a>\
            <p>" + x.snippet + "</p>\
          </div>\
        ");
      });

      var paginationString = "";
      for(var i = Math.max(1, currentPage - 5); i < Math.min(currentPage + 5, Math.ceil(hits / 10) + 1); i++) {
        if(i === currentPage) {
          paginationString += "<span>" + currentPage + "</span>";
        } else {
          paginationString += "<a href=\"javascript:void(0)\" onclick=\"searchPage(" + i + ")\">" + i + "</a>";
        }
      }
      $("#pagination").html(paginationString);
    } else {
      $("#hits").html("");
      $("#results").html("<h1>No results found</h1>");
    }
  });
}

function searchPage(page) {
  currentPage = page;
  search();
}

function suggestSearch(suggestion) {
  $("#search-form").val(suggestion);
  search();
}

$(document).ready(function() {
  $("#button-search").click(function() {
    currentPage = 1;
    search();
  });
});
