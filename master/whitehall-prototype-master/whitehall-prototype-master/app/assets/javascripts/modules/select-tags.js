;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  GOVUK.Modules = GOVUK.Modules || {}

  GOVUK.Modules.SelectTags = function () {
    this.start = function (element) {
      var $count = element.find('.js-tag-count');
      var prefix = element.data('prefix') || '';

      element.on('click', '.js-add-tag', addTag);
      element.on('click', '.js-remove-tag', removeTag);
      element.on('click', '.js-select-tag', selectTag);
      hideAlreadySelectedTags();

      function addTag(evt) {
        evt.preventDefault();
        var selected = $('#tag-search-select').val();
        addTagRow(selected);
        incrementTagCount();
      }

      function incrementTagCount() {
        $count.val(parseInt($count.val()) + 1);
      }

      function decrementTagCount() {
        $count.val(parseInt($count.val()) - 1);
      }

      function selectTag(evt) {
        evt.preventDefault();
        var tr = $(this).parents('tr');
        var newRow = tr.clone();
        var tag = newRow.find('.tag').text();
        tr.remove();


        newRow.find('.js-select-tag').removeClass('js-select-tag').addClass('js-remove-tag').text('Remove tag');
        $('<input type="hidden" value="'+tag+'">').insertAfter(newRow.find('.js-remove-tag'));

        $('.js-selected-tags-table').find('tbody').append(newRow);

        toggleTable();
        numberTagInputs();
        incrementTagCount();
      }

      function removeTag(evt) {
        evt.preventDefault();
        $(this).parents('tr').remove();
        toggleTable();
        numberTagInputs();
        decrementTagCount();
      }

      function addTagRow(value) {
        var newRow = $('.js-selected-tag-row').clone();
        newRow.find('.js-tag').text(value);
        newRow.removeClass('js-selected-tag-row');
        newRow.find('input').val(value);
        $('.js-selected-tags-table').find('tbody').append(newRow);
        newRow.show();
        toggleTable();
        numberTagInputs();
      }

      function numberTagInputs() {
        $('.js-selected-tags-table').find('tr:visible input').each(function(i) {
          $(this).attr('name', prefix + 'selected-tag-' + (i + 1));
        });
      }

      function toggleTable() {
        if ($('.js-selected-tags-table tr').length > 1) {
          $('.js-selected-tags-table').show();
          $('.js-none-selected').hide();
        } else {
          $('.js-selected-tags-table').hide();
          $('.js-none-selected').show();
        }

        if ($('.js-suggested-tags-table tr').length > 0) {
          $('.js-suggested-tags-table').show();
        } else {
          $('.js-suggested-tags-table').hide();
        }
      }

      function hideAlreadySelectedTags() {
        $('.js-suggested-tags-table').find('tr').each(function() {
          var text = $(this).find('.tag').text();
          if ($('input[type="hidden"][value="'+text+'"]').length > 0) {
            $(this).remove();
          }
        });

        toggleTable();
      }
    }
  }

  global.GOVUK = GOVUK
})(window)
