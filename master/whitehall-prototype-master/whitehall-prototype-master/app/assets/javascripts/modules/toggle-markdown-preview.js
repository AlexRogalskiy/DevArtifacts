;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  GOVUK.Modules = GOVUK.Modules || {}

  GOVUK.Modules.ToggleMarkdownPreview = function () {
    this.start = function (element) {
      element.on('click', '.js-toggle-markdown-preview', togglePreview);

      function togglePreview(evt) {
        evt.preventDefault();
        element.find('.js-markdown-preview-target').toggle();
      }
    }
  }

  global.GOVUK = GOVUK
})(window)
