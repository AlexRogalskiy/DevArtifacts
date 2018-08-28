# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/
jQuery ->
  $('#event_city_id').parent().hide()
  cities = $('#event_city_id').html()
  $('#event_state_id').change ->
    state = $('#event_state_id :selected').text()
    escaped_state = state.replace(/([ #;&,.+*~\':"!^$[\]()=>|\/@])/g, '\\$1')
    options = $(cities).filter("optgroup[label='#{escaped_state}']").html()
    if options
      $('#event_city_id').html(options)
      $('#event_city_id').parent().show()
    else
      $('#event_city_id').empty()
      $('#event_city_id').parent().hide()

  $('form').on 'click', '.remove_fields', (event) ->
    $(this).prev('input[type=hidden]').val('1')
    $(this).closest('fieldset').slideUp()
    event.preventDefault()

  $('form').on 'click', '.add_fields', (event) ->
    time = new Date().getTime()
    regexp = new RegExp($(this).data('id'),'g')
    $(this).before($(this).data('fields').replace(regexp, time))
    event.preventDefault()