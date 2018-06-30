
$(document).ready () ->
  box = $ '.skill-box'
  boxHTML = box.html()
  parsedHTML = boxHTML.replace /\{\{(.+)\}\}/g, (match, stars) ->
    "<span class=\"stars\">#{generateStars stars}</span>"
  box.html parsedHTML

starHtml = (str) ->
  "<i class=\"fa fa-star#{\
  if str? then str else ''}\"></i>"

generateStars = (stars) ->
  args = stars.split '/'
  totalStars = args[1] ? 5
  # nstars = parseFloat args[0]
  nstars = parseInt args[0]
  fullStars = Math.floor nstars               # int num of full stars
  hstar = 2 * (nstars - fullStars)            # 0 or 1 half star
  ostars = totalStars - fullStars - hstar     # int empty stars
  res = ""
  _.times fullStars, -> res += starHtml()
  # res += starHtml('half-empty') if hstar == 1
  _.times ostars, -> res += starHtml(' white')
  return res
