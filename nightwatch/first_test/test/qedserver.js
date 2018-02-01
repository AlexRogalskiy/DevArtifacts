module.exports = {
  "Test QEDServer title" : function (browser) {
    browser
      .url("http://localhost:8080")
      .waitForElementVisible('body', 1000)
      .assert.containsText('h1', 'QEDServer')
      .end();
  }
};

