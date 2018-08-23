/*
 * OKVideo by OKFocus v2.2.0
 * http://okfoc.us
 *
 * Copyright 2012, OKFocus
 * Licensed under the MIT license.
 *
 */

var player, OKEvents, options;

(function ($) {

  "use strict";

  $.okvideo = function (options) {

    // if the option var was just a string, turn it into an object
    if (typeof options !== 'object') options = { 'video' : options };

    var base = this;

    // kick things off
    base.init = function () {
      base.options = $.extend({}, $.okvideo.options, options);

      // support older versions of okvideo
      if (base.options.video === null) base.options.video = base.options.source; 

      if (OKEvents.utils.isMobile()) {
        $('body').append('<div id="okplayer" style="position:fixed;left:0;top:0;overflow:hidden;z-index:-999;height:100%;width:100%;"></div>');
      } else if (base.options.adproof) {
        $('body').append('<div style="position:fixed;left:0;top:0;overflow:hidden;z-index:-998;height:100%;width:100%;" id="okplayer-mask"></div><div id="okplayer" style="position:fixed;left:0;top:0;overflow:hidden;z-index:-999;height:110%;width:110%;"></div>');
      } else {
        $('body').append('<div style="position:fixed;left:0;top:0;overflow:hidden;z-index:-998;height:100%;width:100%;" id="okplayer-mask"></div><div id="okplayer" style="position:fixed;left:0;top:0;overflow:hidden;z-index:-999;height:100%;width:100%;"></div>');
      }

      base.setOptions();


      if (base.options.playlist.list === null) { 
        if (base.options.video.provider === 'youtube') {
          base.loadYouTubeAPI();
        } else if (base.options.video.provider === 'vimeo') {
          base.options.volume /= 100;
          base.loadVimeoAPI();
        }
      } else {
        base.loadYouTubeAPI();
      }
    };

    // clean the options
    base.setOptions = function () {
      // exchange 'true' for '1' and 'false' for 3
      for (var key in this.options){
        if (this.options[key] == true) this.options[key] = 1;
        if (this.options[key] == false) this.options[key] = 3;
      }

      if (base.options.playlist.list === null) { 
        base.options.video = base.determineProvider();
      }

      // pass options to the window
      $(window).data('okoptions', base.options);
    };

    // load the youtube api
    base.loadYouTubeAPI = function (callback) {      
      base.insertJS('http://www.youtube.com/player_api');
    };

    base.loadYouTubePlaylist = function() {
      player.loadPlaylist(base.options.playlist.list, base.options.playlist.index, base.options.playlist.startSeconds, base.options.playlist.suggestedQuality);
    };

    // load the vimeo api by replacing the div with an iframe and loading js
    base.loadVimeoAPI = function() {
      $('#okplayer').replaceWith(function() {
        return '<iframe src="http://player.vimeo.com/video/' + base.options.video.id + '?api=1&js_api=1&title=0&byline=0&portrait=0&playbar=0&loop=' + base.options.loop + '&player_id=okplayer" frameborder="0" style="' + $(this).attr('style') + 'visibility:hidden;background-color:black;" id="' + $(this).attr('id') + '"></iframe>';
      });

      base.insertJS('http://a.vimeocdn.com/js/froogaloop2.min.js', function(){
        vimeoPlayerReady();
      });
    };

    // insert js into the head and exectue a callback function
    base.insertJS = function(src, callback){
      var tag = document.createElement('script');

      if (callback){
        if (tag.readyState){  //IE
          tag.onreadystatechange = function(){
            if (tag.readyState === "loaded" ||
                tag.readyState === "complete"){
              tag.onreadystatechange = null;
              callback();
            }
          };
        } else {
          tag.onload = function() {
            callback();
          };
        }
      }
      tag.src = src;
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    };

    // is it from youtube or vimeo?
    base.determineProvider = function () {
      var a = document.createElement('a');
      a.href = base.options.video;

      if (/youtube.com/.test(base.options.video)){
        return { "provider" : "youtube", "id" : a.href.slice(a.href.indexOf('v=') + 2).toString() };
      } else if (/vimeo.com/.test(base.options.video)) {
        return { "provider" : "vimeo", "id" : a.href.split('/')[3].toString() };
      } else if (/[A-Za-z0-9_]+/.test(base.options.video)) {
        var id = new String(base.options.video.match(/[A-Za-z0-9_]+/));
        if (id.length == 11) {
          return { "provider" : "youtube", "id" : id.toString() };
        } else {
          for (var i = 0; i < base.options.video.length; i++) {
            if (typeof parseInt(base.options.video[i]) !== "number") {
              throw 'not vimeo but thought it was for a sec';
            }
          }
          return { "provider" : "vimeo", "id" : base.options.video };
        }
      } else {
        throw "OKVideo: Invalid video source";
      }
    };

    base.init();
  };

  $.okvideo.options = {
    source: null, // Deprecate dis l8r
    video: null,
    playlist: { // eat ur heart out @brokyo
      list: null,
      index: 0,
      startSeconds: 0,
      suggestedQuality: "default" // options: small, medium, large, hd720, hd1080, highres, default
    },
    disableKeyControl: 1,
    captions: 0,
    loop: 1,
    hd: 1,
    volume: 0,
    adproof: false,
    unstarted: null,
    onFinished: null,
    onPlay: null,
    onPause: null,
    buffering: null,
    annotations: true,
    cued: null
  };

  $.fn.okvideo = function (options) {
    return this.each(function () {
      (new $.okvideo(options));
    });
  };

})(jQuery);

// vimeo player ready
function vimeoPlayerReady() {
  options = $(window).data('okoptions');

  var iframe = $('#okplayer')[0];
  player = $f(iframe);

  // hide player until Vimeo hides controls...
  window.setTimeout($('#okplayer').css('visibility', 'visible'), 2000);

  player.addEvent('ready', function () {
    player.api('play');
    if (OKEvents.utils.isMobile()) {
      // mobile devices cannot listen for play event
      OKEvents.v.onPlay();
    } else {
      player.addEvent('play', OKEvents.v.onPlay());
      player.addEvent('pause', OKEvents.v.onPause());
      player.addEvent('finish', OKEvents.v.onFinish());
    }
  });
}

// youtube player ready
function onYouTubePlayerAPIReady() {
  options = $(window).data('okoptions');
  player = new YT.Player('okplayer', {
    videoId: options.video ? options.video.id : null,
    playerVars: {
      'autohide': 1,
      'autoplay': 1,
      'disablekb': options.keyControls,
      'cc_load_policy': options.captions,
      'controls': 0,
      'enablejsapi': 1,
      'fs': 0,
      'modestbranding': 1,
      'iv_load_policy': options.annotations,
      'loop': options.loop,
      'showinfo': 0,
      'rel': 0,
      'wmode': 'opaque',
      'hd': options.hd
    },
    events: {
      'onReady': OKEvents.yt.ready,
      'onStateChange': OKEvents.yt.onStateChange,
      'onError': OKEvents.yt.error
    }
  });

}

OKEvents = {
  yt: {
    ready: function(event){
      event.target.setVolume(options.volume);
      if (options.playlist.list) {
        player.loadPlaylist(options.playlist.list, options.playlist.index, options.playlist.startSeconds, options.playlist.suggestedQuality);
      } else {
        event.target.playVideo();
      }
    },
    onStateChange: function(event){
      switch(event.data){
      case -1:
        OKEvents.utils.isFunction(options.unstarted) && options.unstarted();
        break;
      case 0:
        OKEvents.utils.isFunction(options.onFinished) && options.onFinished();
        options.loop && event.target.playVideo();
        break;
      case 1:
        OKEvents.utils.isFunction(options.onPlay) && options.onPlay();
        break;
      case 2:
        OKEvents.utils.isFunction(options.onPause) && options.onPause();
        break;
      case 3:
        OKEvents.utils.isFunction(options.buffering) && options.buffering();
        break;
      case 5:
        OKEvents.utils.isFunction(options.cued) && options.cued();
        break;
      default:
        throw "OKVideo: received invalid data from YT player.";
      }
    },
    error: function(event){
      throw event;
    }
  },
  v: {
    onPlay: function(){
      if (!OKEvents.utils.isMobile()) player.api('api_setVolume', options.volume);
      OKEvents.utils.isFunction(options.onPlay) && options.onPlay();
    },
    onPause: function(){
      OKEvents.utils.isFunction(options.onPlay) && options.onPause();
    },
    onFinish: function(){
      OKEvents.utils.isFunction(options.onPlay) && options.onFinish();
    }
  },
  utils: {
    isFunction: function(func){
      if (typeof func === 'function'){
        return true;
      } else {
        if (func === 1) func = true;
        return false;
      }
    },
    isMobile: function() {
      if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
        return true;
      } else {
        return false;
      }
    }
  }
};