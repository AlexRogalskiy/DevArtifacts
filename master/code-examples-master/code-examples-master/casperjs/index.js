casper.test.begin('Google search retrieves 10 or more results', 4, function suite (test) {
  casper.start('http://www.google.de/', function () {
    test.assertTitle('Google', 'google homepage title is the one expected');
    test.assertExists('form[action="/search"]', 'main form is found');

    this.fill('form[action="/search"]', {
      q: 'casperjs'
    }, true);
  });

  casper.then(function() {
      test.assertUrlMatch(/q=casperjs/, "search term has been submitted");
      test.assertEval(function() {
          return __utils__.findAll("h3.r").length >= 10;
      }, "google search for \"casperjs\" retrieves 10 or more results");
  });

  casper.run(function () {
    test.done();
  });
});
