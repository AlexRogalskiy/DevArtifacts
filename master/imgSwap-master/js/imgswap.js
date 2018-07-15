/*!
 *  imgSwap v0.2.0
 *  Responsive image solution
 *  Project: https://github.com/darbybrown/imgswap
 *  by Hugo Darby-Brown: http://darbybrown.com
 *  Copyright. MIT licensed.
 */

window.imgSwap = (function (window, document, undefined) {

    'use strict';

    var store = [],
        selector, medium, large, imageSuffix, sml, med, lrg, throttle, poll;


    // Checks to see if an image exists
    var _checkImage = function (url) {
        var img = new Image();
        img.src = url;
        return img.height !== 0;
    };
    


    var _changeSource = function () {
        for (var i = store.length; i--;) {
            var self = store[i];
            
            var windowWidth = window.innerWidth || document.documentElement.clientWidth;

            // Gets image format
            var imageFormat = "." + self.src.split('.').pop();

            // Splits the file name and removes everything after the '-' to get the base file name e.g "image-"
            var parts = self.src.split('-');
            parts.pop();
            var imageName = parts.join('-')  + "-";
            

            var test =  imageName + lrg +  imageFormat;

            // the image suffix is chosen depending on screen size or pixel ratio 
            if (window.devicePixelRatio > 1) {
                imageSuffix = windowWidth > medium && _checkImage(test) ? lrg : med;

            } else if (windowWidth > large && _checkImage(test)) {
                imageSuffix = lrg;

            } else if (windowWidth > medium) {
                imageSuffix = med;

            } else {
                imageSuffix = sml;
            }

            // adds it all back together 
            self.src = imageName + imageSuffix + imageFormat;
        }
    };


    // Limits the amount of times the _change source function is fired
    var _throttle = function () {
        clearTimeout(poll);
        poll = setTimeout(_changeSource, throttle);
    };



    var init = function (obj) {
        var opts = obj || {};
        selector = opts.selector || '[data-swap]';
        sml = opts.suffixes[0] || 'sml';
        med = opts.suffixes[1] || 'med';
        lrg = opts.suffixes[2] || 'lrg';
        medium = opts.breakpoints[0] || 480;
        large = opts.breakpoints[1] || 900;
        throttle = opts.throttle || 250;

        var images = document.querySelectorAll(selector);

        for (var i = 0; i < images.length; i++) {
            store.push(images[i]);
        }

        _changeSource();


        if (document.addEventListener) {
            window.addEventListener('resize', _throttle, false);
        } else {
            window.attachEvent('onresize', _throttle);
        }
    };


    return {
        init: init
    };


})(window, document);
