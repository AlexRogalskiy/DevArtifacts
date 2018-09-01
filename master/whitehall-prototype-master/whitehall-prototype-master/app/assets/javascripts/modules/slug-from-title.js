;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  GOVUK.Modules = GOVUK.Modules || {}

  GOVUK.Modules.SlugFromTitle = function () {
    this.start = function (element) {
      var prefix = element.data('prefix') || 'government';

      element.on('change keyup click paste', '#title', updateSlug);
      $('#title').trigger('keyup');

      function updateSlug(evt) {
        var title = $(this).val(),
            slug = title.replace(/ +/g, '-').toLowerCase().replace(/[^a-z0-9]+/g, '-');

        element.find('.js-dynamic-slug').text(prefix + '/' + slug);

        if (slug.length > 0) {
          element.find('.js-slug-parent').show();
          element.find('.empty').hide();
        } else {
          element.find('.js-slug-parent').hide();
          element.find('.empty').show();
        }
      }
    }
  }

  global.GOVUK = GOVUK
})(window)
