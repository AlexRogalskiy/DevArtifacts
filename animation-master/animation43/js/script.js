var birdBezier = [{x:0, y:0},{x:24, y:69},{x:105, y:73},{x:210, y:16},{x:303, y:22},{x:356, y:69},{x:378, y:-3},{x:493, y:68},{x:638, y:57},{x:-71, y:26},{x:313, y:150},{x:319, y:341}];

var NarrativeView = function() {
    this._scrollMax = 400;
    this._pos = 0;
    this.init();
};

var proto = NarrativeView.prototype;

proto.init = function() {
    this._setupHandlers();
    this._createChildren();    
    this._layout();
    this.enable();
    this._setupAnimation();
};

proto._setupHandlers = function() {
    this._onScrollHandler = this._onScroll.bind(this);
};

proto._createChildren = function() {
    this._$window = $(window);
};

proto._layout = function() {
    var $scrollTrack = $('<div>');
    $scrollTrack.css('height', '500vh');
    $scrollTrack.attr('class', 'scrollPillar');
    
    $('body').prepend($scrollTrack);
};

proto.enable = function() {
    this._$window.on('scroll', this._onScrollHandler);
};

proto._setupAnimation = function() {
    this._tl = new TimelineLite({ paused: true });
    
    this._tl.staggerFrom($('.logo path'), 1, {
        y: '-=100px',
        opacity: 0
    }, 0.2);
    
    this._tl.to($('.obj'), 3, {
        bezier: { 
            autoRotate: true, 
            timeResolution: 12, 
            curviness: 1, 
            type:"thru", 
            values: birdBezier
        }
    }, '-=' + this._tl.totalDuration());
    
    this._tl.staggerTo($('.logo path'), 1, {
        y: '-100px',
        opacity: 0
    }, 0.2);
    
    this._tl.to($('.obj'), 0.25, {
        opacity: 0
    }, '-=0.75');
    
    this._tl.to($('.part'), 1, {
        opacity: 1,
        y: '-=100px'
    }, '-=1');
    
    var totalDur = this._tl.totalDuration();
    
    this._tl.to($('.loader-prog'), totalDur, {
        width: '100%'
    }, '-=' + totalDur);
};

proto._onScroll = function(event) {    
    var windowHeight = this._$window.outerHeight();
    var pillarHeight = $('.scrollPillar').outerHeight();
    var windowPos = this._$window.scrollTop();
    var scrollPos = windowPos / (pillarHeight - windowHeight);
    this._tl.progress(scrollPos);
};

new NarrativeView();

















