function init() {
    
}

function load_bio(bio_name) {
    document.getElementById('the_image').src='headshots/headshot_' + bio_name + '.gif';
    var populate_bio = function (rdoc) {
        document.getElementById('the_bio').innerHTML = rdoc.getElementsByTagName("p")[0].innerHTML;
        document.getElementById('the_name').innerHTML = rdoc.getElementsByTagName("h1")[0].innerHTML;
    }
    fetch('bios/bio_' + bio_name + '.html', populate_bio);
    //document.getElementById('the_bio').innerHTML = 'bios/bio_' + bio_name + '.html';
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
