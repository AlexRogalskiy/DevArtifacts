module.exports = {
  "Test adding a product" : function (browser) {
    browser
      .url("http://localhost:8080")
      .waitForElementVisible('body', 1000)
      .click("#main ul li a:first-child")
      .pause(1000)
      .setValue('#product_name', 'Widget')
      .setValue('#product_price', '25')
      .setValue('#product_description', 'A simple widget')
      .click('input[type=submit]')
      .pause(1000)
      .assert.containsText('#notice', 'Created Widget')
      .assert.containsText('table tr:first-child td:first-child', 'Widget')
      .click('table tr:first-child input[value=Delete]')
      .pause(1000)
      .assert.containsText('#notice', 'Widget was deleted')
      .end();
  }
};

