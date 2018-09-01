;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  GOVUK.Modules = GOVUK.Modules || {}

  GOVUK.Modules.LivePreview = function () {
    this.start = function (element) {
      var highlights = [];
      var $input = element.find('.js-preview-input').first();

      element.on('keyup click paste change blur focus', '.js-preview-input', $.debounce( 250, showPreview ));
      element.find('.js-preview-input').trigger('click');

      function showPreview(evt) {
        var $el = $(this);
        var text = $(this).val() || '';
        var previous = $(this).data('previous');

        if (text == previous) {
          return;
        } else {
          $(this).data('previous', text);
        }

        $.ajax({
          type: "POST",
          url: '/live-preview',
          data: {
            text: text
          },
          success: renderPreview,
          dataType: 'json'
        });

        function renderPreview(data) {
          var $target = $('#' + element.data('target'));
          $target.html(data.body_html);

          console.log(data);
        }
      }
    }
  }

  global.GOVUK = GOVUK
})(window)
