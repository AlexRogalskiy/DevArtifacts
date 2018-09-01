;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  GOVUK.Modules = GOVUK.Modules || {}

  GOVUK.Modules.FakeFilenameFromTitle = function () {
    this.start = function (element) {
      element.on('change keyup click paste', '#attachment-title', updateFilename);
      $('#title').trigger('keyup');

      function updateFilename(evt) {
        var title = $(this).val(),
            filename = title.replace(/ +/g, '-').toLowerCase().replace(/[^a-z0-9]+/g, '-');

        element.find('.js-dynamic-filename').val(filename + '.pdf');
      }
    }
  }

  global.GOVUK = GOVUK
})(window)
