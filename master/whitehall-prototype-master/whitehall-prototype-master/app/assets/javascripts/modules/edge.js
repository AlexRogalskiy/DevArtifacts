;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  GOVUK.Modules = GOVUK.Modules || {}

  GOVUK.Modules.Edge = function () {
    this.start = function (element) {
      element.on('click', 'a[href="#"], .js-edge', alertUser);

      function alertUser(evt) {
        evt.preventDefault();
        alert('Sorry, this hasn’t been built yet')
      }
    }
  }

  global.GOVUK = GOVUK
})(window)
