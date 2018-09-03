var current_bio = '';

function init() {
    current_bio = ''
}
function load_bio(bio_name) {
    //are we online?
    //update backing store
    //var update_from_server =  function () {window.alert('Update!')};
    //var bio = {};    
    if (current_bio.length > 0) {
        save_bio(current_bio);
    }
    var stored_bio = window.localStorage.getItem(bio_name);
    if (stored_bio) {
        var bio = JSON.parse(stored_bio);
        document.getElementById('the_bio').innerHTML = bio.the_bio;
        document.getElementById('the_name').innerHTML = bio.the_name;
        document.getElementById('the_image').src = bio.the_image;
    } else {
        document.getElementById('the_image').src='headshots/headshot_' + bio_name + '.gif';
        var populate_bio = function (rdoc) {
            document.getElementById('the_bio').innerHTML = rdoc.getElementsByTagName("p")[0].innerHTML;
            document.getElementById('the_name').innerHTML = rdoc.getElementsByTagName("h1")[0].innerHTML;
        }
        fetch('bios/bio_' + bio_name + '.html', populate_bio);
    }
    current_bio = bio_name;
}
function save_bio(bio_name) {
    bio.the_bio = document.getElementById('the_bio').innerHTML;
    bio.the_name = document.getElementById('the_name').innerHTML;
    bio.the_image = document.getElementById('the_image').src;
    //set dirty flag
    bio.dirty = true;
    window.localStorage.setItem(bio_name, JSON.stringify(bio));
    //are we online?
    //save changes to server
    var update_server = function () {window.alert('Update!')};
    check_online('online-check.html', update_server);
}
function fetch(URL, pop1) {
    var ret;
    var req = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("MSXML2.XMLHTTP.3.0");

    req.open("GET", URL, true);
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            var responseDoc = document.createElement("div");
            responseDoc.innerHTML = req.responseText;
            pop1(responseDoc);
        } else {
            ret = null;
        }
    }
    req.send(null);
}
function check_online(URL, f) {
    var currentTime = new Date();
    var req = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("MSXML2.XMLHTTP.3.0");
    req.open("GET", URL + '?' + currentTime.getTime(), true);
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            if (req.status == 200) {
                if (req.responseText.indexOf('OFFLINE') > -1) {
                    //window.alert('OFFLINE');
                } else {
                    //window.alert('ONLINE');
                    f();
                }
            } else {
                //window.alert('OFFLINE');
            }
        }
    }
    req.send(null);
}