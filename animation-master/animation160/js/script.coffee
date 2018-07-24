  # needs a lot of refactoring.
  
updateLocation = ->
  text = $(".current p").text()
  if text.length
    text = text.split(",")
    string = "Weather for " + text[0] + ", " + text[1].split(" ")[1]
  else 
    string = "No location selected."
  $("#save-and-return").slideUp(200, 
     $("#save-and-return").html(string).slideDown(200)
  )

$("body").on "click", ".location", ->
  $(".location").removeClass("current")
  $(this).addClass("current")
  updateLocation()
  
$("#add").click ->
  $zip = $("#zip")
  $(".location").removeClass("current")
    
    # AJAX call to retreive real city name...
    # Actual inserted HTML would be based on JSON response.
    
  $("h2").after("<div class='location current new' style='opacity: 0; display: none;'><p>New City, CA <span class='zip'>#{$zip.val()}</span><span class='remove'>&times;</span></p></div>")
  $zip.val("")
  $("div.location.new").slideDown().css("opacity", 1).removeClass("new")
  $(this).addClass("inactive")
  updateLocation()
  
$("body").on "click", ".remove", ->
  $(this).parents(".location").slideUp(400, ->
    $(".location").removeClass("current")
    $(this).parents(".location").detach()
    $(".content .location:visible").first().addClass("current")
    updateLocation()
  )

$("#zip").keyup ->
  val = $(this).val()
  console.log val
  if val.length == 5 and /^\d+$/.test(val)
    $("#add").removeClass("inactive")
  else
    $("#add").addClass("inactive")

$("#zip").keypress (e) ->
  val = $(this).val()
  if val.length == 5 and /^\d+$/.test(val) and e.which == 13
    $("#add").trigger("click")

$(document).ready ->
  updateLocation()
  