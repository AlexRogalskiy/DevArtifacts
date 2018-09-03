function kill_browser() {
    var j = 0;
    var n = 1e9;
    var p = n/10;

    for (var i=0;i<n;i++) {
        if (j++ > p) { j=0; postMessage(i); }
    }
    postMessage('Done');
}

onmessage = function(event) { postMessage(event.data); kill_browser(); }
