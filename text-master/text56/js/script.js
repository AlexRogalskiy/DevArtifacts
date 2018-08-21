$(function() {
  $(".content").hoonSlide({
    eazing: "easeInOutExpo",
    scrollbar: false,
    speed: 600
  });
});

!(function(n) {
  n.fn.hoonSlide = function(i, e) {
    return n.isFunction(i) && ((e = i), (i = null)), (n.fn.hoonSlide.setting = {
      speed: 1e3,
      eazing: "linear",
      scrollbar: !0
    }), (i = n.extend(n.fn.hoonSlide.setting, i)), this.each(function() {
      var e = n(this), o = n(window).height();
      e.find("> div").css({
        height: o
      }), e.find("> div").each(function() {
        var i = n(this).offset().top, e = n(window).scrollTop();
        i != e ? n(this).removeClass("on") : n(this).addClass("on");
      }), 1 != i.scrollbar && n("body").css("overflow", "hidden"), n(
        window
      ).bind("mousewheel", function(o) {
        var t = e.find("> div").size(),
          s = e.find("> div").outerHeight(!0),
          d = n(window).scrollTop(),
          a = e.find("> div.on"),
          l = a.index();
        o.originalEvent.wheelDelta > 0 || o.originalEvent.detail < 0
          ? 0 != l &&
              n("html, body").not(":animated").animate({
                scrollTop: d - s
              }, i.speed, i.eazing, function() {
                a.removeClass("on"), a.prev().addClass("on");
              })
          : t > l + 1 &&
              n("html, body").not(":animated").animate({
                scrollTop: d + s
              }, i.speed, i.eazing, function() {
                a.removeClass("on"), a.next().addClass("on");
              });
      });
      var t = (function() {
        var n = {};
        return function(i, e, o) {
          n[o] && clearTimeout(n[o]), (n[o] = setTimeout(i, e));
        };
      })();
      n(window).bind("resize", function() {
        var o = n(window).height();
        e.find("> div").css({
          height: o
        }), t(function() {
          var o = (n(window).scrollTop(), e.find("> div.on")),
            t = o.offset().top;
          n("html, body").animate(
            {
              scrollTop: t
            },
            i.speed,
            i.eazing
          );
        }, 100);
      });
    });
  };
})(jQuery);
