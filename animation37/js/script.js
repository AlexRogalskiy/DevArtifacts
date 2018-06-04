removeSuccess = ->
	$('.button').removeClass 'success'

$(document).ready ->
	$('.button').click ->
		$(@).addClass 'success'
		setTimeout removeSuccess, 3000