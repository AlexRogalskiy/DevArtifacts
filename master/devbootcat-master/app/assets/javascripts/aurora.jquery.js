(function ($) {

    $.fn.aurora = function (options) {

        var target = this;
        var ranNum;
        var link;
        var title;
        var author;
        var url;
        var preloader;
        var credits;
        var settings = $.extend({
            tags: "default",
            showCredits: true,
            complete: null
        }, options);

        // $("html").css({
        //     "margin": "0",
        //     "padding": "0",
        //     "height": "100%",
        //     "width": "100%"
        // });

        $("body").css({
            "margin": "0",
            "padding": "0",
            "height": "100%",
            "width": "100%",
            "min-height": "900px",
            "z-index": "-9999",
            "background-repeat": "no-repeat",
            "background-position": "bottom",
            "-webkit-background-size": "cover",
            "-moz-background-size": "cover",
            "-o-background-size": "cover",
            "background-size": "cover"
        });

        return this.each(function () {
            $.getJSON('http://api.flickr.com/services/feeds/photos_public.gne?tags=' + settings.tags + '&size=b&format=json&jsoncallback=?', function (data) {
                $.each(data.items, function (i, item) {
                    ranNum = Math.floor(Math.random() * ($(data.items).size()));
                    link = data.items[ranNum].link;
                    title = data.items[ranNum].title;
                    author = data.items[ranNum].author;
                    url = data.items[ranNum].media.m.split('m.jpg')[0] + 'b.jpg';

                    preloader = document.createElement("div");
                    preloader.id = "preloader";
                    preloader.style.position = "absolute";
                    preloader.style.width = "100%";
                    preloader.style.height = "100%";
                    preloader.style.top = "0";
                    preloader.style.left = "0";
                    preloader.style.background = "#000000";
                    preloader.style.zIndex = "999";
                    document.body.appendChild(preloader);

                    if (settings.showCredits == true) {
                        credits = document.createElement("div");
                        credits.id = "credits";
                        credits.style.position = "absolute";
                        credits.style.bottom = "10px";
                        credits.style.right = "10px";
                        credits.style.opacity = "0.5";
                        document.body.appendChild(credits);
                        $("#" + credits.id).append($('<a href="' + link + '" target="_blank" style="color: #ffffff; text-decoration: none;">' + title + ' &copy; by ' + author + '.</a>'));
                    }

                    $('<img/>').attr('src', url).load(function() {
                       $(this).remove();
                       $(target).css('background-image', 'url(' + url + ')');
                       $("#preloader").fadeOut(500);
                       settings.complete.call(this);
                    });

                    if (i == 0) return false;

                });
            });
        });
    };
}(jQuery));
