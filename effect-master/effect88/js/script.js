angular.module('app', []).controller('ctrl', ctrl);

function ctrl ($element) {
  this.msg = 'Hello, world!';
  this.click = function () {
    $element.find('input')[0].focus();
  };
  this.click();
}