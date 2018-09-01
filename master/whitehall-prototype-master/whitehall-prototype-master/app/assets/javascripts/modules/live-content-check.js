;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  GOVUK.Modules = GOVUK.Modules || {}

  GOVUK.Modules.LiveContentCheck = function () {
    this.start = function (element) {
      var highlights = [];
      var $input = element.find('.js-check-content').first();

      element.on('keyup click paste change blur focus', '.js-check-content', $.debounce( 250, checkContent ));
      element.on('focus', '.js-check-content', focus);
      element.on('blur', '.js-check-content', unFocus);
      element.on('click', 'a[data-actual]', highlightSelected);

      $input.highlightWithinTextarea({ highlight: highlights });

      function focus() {
        $(this).parent('.hwt-container').addClass('is-focused');
        $('.js-contextual-guidance').hide();
        element.find('.js-contextual-guidance').show();
      }

      function unFocus() {
        $(this).parent('.hwt-container').removeClass('is-focused');
      }

      function highlightSelected(evt) {
        evt.preventDefault();
        highlights.length = 0
        highlights.push($(this).data('actual'))
        $input.highlightWithinTextarea('update');
      }

      function checkContent(evt) {
        var $el = $(this);
        var text = $(this).val();
        var previous = $(this).data('previous');

        if (text == previous) {
          return;
        } else {
          $(this).data('previous', text);
        }

        $.ajax({
          type: "POST",
          url: '/content-check',
          data: {
            text: text
          },
          success: reportContentChecks,
          dataType: 'json'
        });

        function reportContentChecks(data) {
          var $target = $('#' + $el.data('target'));
          var $h3 = $('<h3 class="govuk-heading-s govuk-!-mb-r1">Content issues</h3>');
          var $list = $('<ul class="govuk-list govuk-!-mb-r7">');
          var $div = $('<div>').append($h3).append($list);
          var messages = [];

          for (var i = 0, l = data.report.length; i < l; i++) {
            var report = data.report[i];
            var $li = $('<li>');

            $li.html('<a class="govuk-link" href="#'+ report.name +'" data-actual="'+ report.actual +'">' + report.message + '</a>')
            $list.append($li);
          }

          if (data.report.length > 0) {
            $target.html($div);
          } else {
            $target.html('');
          }
          console.log(data);
          highlightContent();
        }

        function highlightContent() {
          element.find('[data-actual]').each(function() {
            highlights.push($(this).data('actual'))
          });

          $input.highlightWithinTextarea('update');
        }
      }
    }
  }

  global.GOVUK = GOVUK
})(window)
