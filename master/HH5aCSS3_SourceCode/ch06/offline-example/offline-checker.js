function check_online(online_fn, offline_fn) {
    var currentTime = new Date()
    req = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("MSXML2.XMLHTTP.3.0");
    var freshUrl = 'online.txt?brk=' + currentTime.getTime();
    req.open("GET", freshUrl, true);
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            if (req.status == 200) {
                if (req.responseText.indexOf('OFFLINE') > -1) {
                    offline_fn();
                } else {
                    online_fn();
                }
            } else {
                offline_fn();
            }
        }
    }
    req.send(null);
}