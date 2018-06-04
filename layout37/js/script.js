toggleElement = ($el, type) ->

	if type?

		if type is  'open'
			$el.addClass 'panel-element-open'
			$el.siblings('.panel-element').removeClass 'panel-element-open'

		else if type is 'close'
			$el.removeClass 'panel-element-open'

	else

		if $el.hasClass 'panel-element-open'
			toggleElement $el, 'close'
		else
			toggleElement $el, 'open'

	return null

$(document).ready ->

	$('.btn').click ->

		$parent = $(@).parents '.panel-element'

		if $(@).hasClass 'btn-heart'
			
			if $parent.hasClass 'panel-element-hearted'
					$parent.removeClass 'panel-element-hearted'
				else
					$parent.addClass 'panel-element-hearted'
					toggleElement $parent, 'close'

		else if $(@).hasClass 'btn-hide'
			toggleElement $parent, 'close'
			$parent.delay(200).fadeOut(300)

		else if $(@).hasClass 'btn-more'
			if not hammertime
				toggleElement $parent

	if $(window).width() < 800

		# Mobile swiping with Hammer.js
		# https://hammerjs.github.io
		hammertime = $('.panel-element .element-content').hammer()

		hammertime.on 'swipeleft swiperight tap', (e) ->

			$parent = $(e.currentTarget).parent()

			if e.type is 'tap'
				toggleElement $parent

			else if e.type is 'swipeleft'

				if not $parent.hasClass 'panel-element-open'
					toggleElement $parent, 'open'
			else

				if $parent.hasClass 'panel-element-open'
					toggleElement $parent, 'close'