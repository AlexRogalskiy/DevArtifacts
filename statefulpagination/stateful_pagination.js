(function($) {
  function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)')
      .exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  var currentPage = 0;
  var startPage = 0;

  function readParameters() {
    startPage = parseInt(getParameterByName('start_page'));
    if (isNaN(startPage)) {
      startPage = parseInt(getParameterByName('page'));
    }
    if (isNaN(startPage)) {
      startPage = 1;
    }
    currentPage = startPage - 1;

    if (getParameterByName('page')) {
      endPage = parseInt(getParameterByName('page'));
      for (i = currentPage; i < endPage; i++) {
        getNextPage(true);
      }
    }

    observeScroll();
  }
  var currentPage = 0;

  function loadData(data) {
    $('#content').append(Handlebars.compile("{{#products}} \
      <div class='product'> \
        <a href='/products/{{id}}'>{{name}}</a> \
        <br> \
        <span class='description'>{{description}}</span> \
        </div>{{/products}}")({ products: data }));
    if (data.length == 0) $('#next_page_spinner').hide();
  }

  function nextPageWithJSON() {
    currentPage += 1;
    var newURL = '/products.json?page=' + currentPage;

    var splitHref = document.URL.split('?');
    var parameters = splitHref[1];
    if (parameters) {
      parameters = parameters.replace(/[?&]page=[^&]*/, '');
      newURL += '&' + parameters;
    }
    return newURL;
  }

  function updateBrowserUrl() {
    if (window.history.pushState == undefined) return;

    var newURL = '?start_page=' + startPage + '&page=' + currentPage;
    window.history.pushState({}, '', newURL);
  }

  var loadingPage = 0;
  function getNextPage(ignoreMutexBlocking) {
    if (!ignoreMutexBlocking && loadingPage != 0) return;

    loadingPage++;
    $.getJSON(nextPageWithJSON(), {}, updateContent).
      complete(function() { loadingPage-- });
  }

  function updateContent(response) {
    loadData(response);
    updateBrowserUrl();
  }

  function readyForNextPage() {
    if (!$('#next_page_spinner').is(':visible')) return;

    var threshold = 200;
    var bottomPosition = $(window).scrollTop() + $(window).height();
    var distanceFromBottom = $(document).height() - bottomPosition;

    return distanceFromBottom <= threshold;
  }

  function observeScroll(event) {
    if (readyForNextPage()) getNextPage();
  }

  $(document).scroll(observeScroll);
  readParameters();
})(jQuery);

