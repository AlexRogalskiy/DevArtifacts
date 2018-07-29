var renkVer = function (n, k, c) {

    $(k+'1').removeClass(c);
    $(k+'2').removeClass(c);
    $(k+'4').removeClass(c);
    $(k+'8').removeClass(c);

    if (n == 9) {
        $(k+'1').addClass(c);
        $(k+'8').addClass(c);
    } else if (n == 8) {
        $(k+'8').addClass(c);
    } else if (n == 7) {
        $(k+'1').addClass(c);
        $(k+'2').addClass(c);
        $(k+'4').addClass(c);
    } else if (n == 6) {
        $(k+'2').addClass(c);
        $(k+'4').addClass(c);
    } else if (n == 5) {
        $(k+'1').addClass(c);
        $(k+'4').addClass(c);
    } else if (n == 4) {
        $(k+'4').addClass(c);
    } else if (n == 3) {
       $(k+'1').addClass(c);
       $(k+'2').addClass(c);
   } else if (n == 2) {
    $(k+'2').addClass(c);
} else if (n == 1) {
    $(k+'1').addClass(c);
} 

else {
    $(k+'1').removeClass(c);
    $(k+'2').removeClass(c);
    $(k+'4').removeClass(c);
    $(k+'8').removeClass(c);
}
}


function setSaat() {
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();


    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    var saatK = hour % 10;
    renkVer(saatK, "#saatK", "red");
    var saatB = (hour - saatK) / 10;
    renkVer(saatB, "#saatB", "red");
    var dakikaK = minute % 10;
    renkVer(dakikaK, "#dakikaK", "red");
    var dakikaB = (minute - dakikaK) / 10;
    renkVer(dakikaB, "#dakikaB", "red");
    var saniyeK = second % 10;
    renkVer(saniyeK, "#saniyeK", "blue");
    var saniyeB = (second - saniyeK) / 10;
    renkVer(saniyeB, "#saniyeB", "blue");

    $('#saat').html(sifirEkle(hour) + ":" + sifirEkle(minute) + ":" + sifirEkle(second));            
}

function sifirEkle(number) {
    if (number < 10) {
        return "0" + number.toString();
    } else {
        return number.toString();
    }
}

window.setInterval(function(){setSaat();}, 1000);