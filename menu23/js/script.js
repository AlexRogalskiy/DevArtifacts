$('#burger').mousedown(function() {
    $('.bun').velocity({
        scaleY: 0.85,
        translateY: 5
    }, {
        duration: 50
    })
});

$('#burger').mouseup(function() {
    $('.bun').velocity({
        scaleY: 1,
        translateY: 0
    }, {
        duration: 50
    });
    $('#burger').velocity({
        opacity: 0,
        translateY: -400,
        scale: 1.5
    }, {
        duration: 100
    }, [50, 5]);
  	$('#chip-no-sauce, #chip-with-sauce').delay(150);
    $('#chip-no-sauce').velocity({
        rotateZ: "-45deg",
        transformOriginX: 35,
        transformOriginY: 26
    }, {
        duration: 100
    }, [250, 15]);
    $('#chip-with-sauce').velocity({
        rotateZ: "45deg",
        transformOriginX: 38,
        transformOriginY: 26
    }, {
        duration: 100
    }, [250, 15]);
});

$('#chips').mousedown(function() {
    $('#chip-no-sauce').velocity({
        rotateZ: "0",
        transformOriginX: 35,
        transformOriginY: 28
    }, {
        duration: 100
    }, [250, 15]);
    $('#chip-with-sauce').velocity({
        rotateZ: "0",
        transformOriginX: 35,
        transformOriginY: 28
    }, {
        duration: 100
    }, [250, 15]);
});

$('#chips').mouseup(function() {
    $('#burger').velocity({
        opacity: 1,
        translateY: 0
    }, [50, 8]);
});