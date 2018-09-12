var phantomcss = require('node_modules/phantomcss/phantomcss.js');

casper

  // Open google
  .start('https://google.de/search?q=phantomcss')

  .then(function () {
    // Take screenshots
    phantomcss.screenshot('#resultStats', 'result stats');
    phantomcss.screenshot('#akp_target .g:first-child', 'first result');
  })
  .run(function () {
    phantom.exit(phantomcss.getExitStatus());
  });
