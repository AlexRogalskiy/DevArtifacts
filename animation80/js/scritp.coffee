$("div").click ->
  if $("div").hasClass "loading-start"
    if $("div").hasClass "loading-end"
      $("div").attr("class", "")
  else
    setTimeout (-> $("div").addClass("loading-start"))   ,    0
    setTimeout (-> $("div").addClass("loading-progress")),  500
    setTimeout (-> $("div").addClass("loading-end"))     , 1500

resize = ->
  $("body").css
    "margin-top": ~~((window.innerHeight - 260) / 2) + "px"
    
$(window).resize resize
resize()
