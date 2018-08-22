//Full screen navigation w/ scrolling
//created by http://8bit-code.com
//tutorial at http://www.8bit-code.com/tutorials/full-screen-navigation-with-scrolling
//photo by marcoita78 from http://pixabay.com/en/mercedes-one-thousand-miles-auto-406290/
$(function() {

    $("html").addClass("js");

    var timeout = null;
    var nav = $("nav");
    var navLiEven = nav.find("li:even a");
    var navLiOdd = nav.find("li:odd a");

    navLiEven.addClass("animated");
    navLiOdd.addClass("animatedOdd");

    $(document).on('mousemove', function(event) {
        if (timeout !== null) {
            nav.addClass("focus");
            navLiEven.removeClass("fadeInDownBig").addClass("fadeInUpBig");
            navLiOdd.removeClass("fadeInDownBig").addClass("fadeInUpBig");

            clearTimeout(timeout);
        }

        timeout = setTimeout(function() {
            nav.removeClass("focus");
            navLiEven.removeClass("fadeInUpBig").addClass("fadeInDownBig");
            navLiOdd.removeClass("fadeInUpBig").addClass("fadeInDownBig");
        }, 2000);
    });


    $("body").mouseleave(function() {
        nav.removeClass("focus");
        navLiEven.removeClass("fadeInUpBig").addClass("fadeInDownBig");
        navLiOdd.removeClass("fadeInUpBig").addClass("fadeInDownBig");
    });

    var $bl = $(".main-nav"),
        $th = $(".main-nav ul"),
        blW = $bl.outerWidth(),
        blSW = $bl[0].scrollWidth,
        wDiff = (blSW / blW) - 1,
        mPadd = 200,
        damp = 20,
        mX = 0,
        mX2 = 0,
        posX = 0,
        mmAA = blW - (mPadd * 2),
        mmAAr = (blW / mmAA);

    $bl.mousemove(function(e) {
        mX = e.pageX - this.offsetLeft;
        mX2 = Math.min(Math.max(0, mX - mPadd), mmAA) * mmAAr;
    });

    setInterval(function() {
        posX += (mX2 - posX) / damp;
        $th.css({
            marginLeft: -posX * wDiff
        });
    }, 10);

});