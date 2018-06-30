$(document).ready ->
  console.log "current document is locked and loaded"
  $("img[alt='support']").click (event) ->
    console.log event
    objectId = $(this).parent().parent().attr("id")
    vote = $(this).attr("class")
    console.log vote
    $.ajax(
      type: "POST"
      url: "/legislation_voices/up/" + objectId
      dataType: "json"
    ).done(->
      console.log "done"
      return
    ).success(->
      console.log "success"
      console.log "You support this legislation"
      return
    ).fail ->
      console.log "fail"
      return

    $("img[class=" + vote + "").fadeOut()
    return

  $("img[alt='oppose']").click (event) ->
    console.log event
    objectId = $(this).parent().parent().attr("id")
    vote = $(this).attr("class")
    console.log vote
    $.ajax(
      type: "POST"
      url: "/legislation_voices/down/" + objectId
      dataType: "json"
    ).done(->
      console.log "done"
      return
    ).success(->
      console.log "success"
      console.log "You oppose this legislation"
      return
    ).fail ->
      console.log "fail"
      return

    $("img[class=" + vote + "").fadeOut()
    return

  return