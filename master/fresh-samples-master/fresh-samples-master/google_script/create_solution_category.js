function testCreateCategory() {

  var API_KEY = 'YOUR_API_KEY';
  var ENDPOINT = 'http://YOUR_DOMAIN.freshdesk.com'; // change to https if SSL is configured.

  var headers = {
    'Content-type': 'application/json',
    'Authorization': 'Basic ' + Utilities.base64Encode(API_KEY + ':X')
  };
  
  var payload = '{"solution_category":{"name":"API test","description":"API related documents"},"tags":{"name":""}}';
  
  var url = ENDPOINT + '/solution/categories.json';
  var options = {
    'method': 'post',
    'headers': headers,
    'payload': payload,
    muteHttpExceptions: true
  };
  var response = UrlFetchApp.fetch(url, options);
  
  Logger.log("code: " + response.getResponseCode());
  Logger.log("text: " + response.getContentText());

}
