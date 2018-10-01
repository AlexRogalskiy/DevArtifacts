/**
 * demo1.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2017, Codrops
 * http://www.codrops.com
 */
/* bike coming to center adjustment */

/* start at page load */
const entranceAnimationDuration = 1.5;//def(2) duration in seconds for the bike to get to the page center
exitAnimationDuration = 0.7;//def(2) duration in seconds for the bike to get out of the page center
exitAnimationDelay = 0.5;//def(1) delay before the bike start leaving screen when timelineExit.play() is called
exitFrontWheelAnimationDelay = exitAnimationDelay;//def(exitAnimationDelay) Delay before front wheel start rotating
wheelRotationSpeed = 0.5;//def(1) time for a full wheel rotation in seconds
exitWheelRotationSpeed = 0.5;//def(0.5) time for a full wheel rotation in seconds during exit
strokeAnimationSpeed = 0.5;//def(2) delay in second for a stroke to go from 0 40% of his lenth to 60% 100%
fillAnimationSpeed = 2;//def(2) delay in second for the fill property to go from opacity 1 to 0 ( not really opacity but that's the effect we see )
fillAnimationDelay = 0.5;//def(0.5) delay in second before the fill start to fill again ( stays transparent in the mean time )
/* note that only half of the path fill get animated ("#mainpaths path:nth-child(odd)"), other half is always transparent */

/* when entranceAnimationDuration is over , the bike "landed" at page center and we start the shaking with timelineShacking.play(); */
delayBeforeAnimationSlow = 2000;//def(2000) delay in ms before we kill the main animation and we freeze / fill everything

/* after delayBeforeAnimationSlow is over we stop the main animation with timelineMainAnimation.kill(); and we start the last timelines */
// timelineToFullStrokes.play() the
staggerStrokesDelay = 0.005; // this allow us to make the strokes start / end with a short delay between each of them
speedStrokesToFull = .5;// def(1) How long in seconds does a stroke takes to go to 100% of his total length

//below is the time it takes for all strokes to be fully drawed def (385 paths * 0.005 + 1 ) =  2.925 seconds
timeForStrokesToBeFull = document.querySelectorAll('#mainpaths path').length * staggerStrokesDelay + speedStrokesToFull;
//we start to fill everything when all strokes are drawed , you can use below var to start before it ends or a bit after
delayBeforeFillPaths = 0.5; //def (0) seconds minus x to start sooner
//we start to fill everything
timeForPathToFill = 1;//def (1) amount in seconds for a path to be filled ( colored and not transparent )  again
staggerFillDelay = 0.04; //def(0.04) s this allow us to make the fill start / end with a short delay between each of them

/* NOTE : we consider the animation to be over after all path are filled so */
timeUntilAnimationOver = timeForStrokesToBeFull + (document.querySelectorAll('#mainpaths path:nth-child(8n+1)').length * staggerFillDelay + timeForPathToFill); //in seconds
// we use timeUntilAnimationOver to know when the wheels / shaking should stop

/* additionnal params */
shakingRepetition = 3;//def (3) amount of time we want the shaking animation to repeat ( doesn't affect the duration of the whole animation, it'll just shake more frequently )
slowShakingOverTime = false; //def (true) weither or not we want the shaking animation to slow down like the wheels
/* */

var previousClass;
const bike = document.getElementById("bike");

const timelineEntrance = new TimelineMax({
    paused: true,
    onComplete: triggerAfterEntrance//callback
});

timelineEntrance.fromTo("#bike", entranceAnimationDuration, {
    rotation: -50, left: "0%", top: "0%", xPercent: -100, yPercent: -100
},
    { rotation: 0, left: "50%", top: "50%", xPercent: -50, yPercent: -50, ease: Back.easeOut.config(1) });


/* wheels animation value */
const timelineWheels = new TimelineMax({
    paused: true,
    repeat: -1
});

timelineWheels.to("#bike #wheelb,#bike #wheelf", wheelRotationSpeed,
    { ease: Power0.easeNone, rotation: "+=360", transformOrigin: "50% 50%", yoyo: false }, "0");

/* shacking animation value */
const timelineShacking = new TimelineMax({
    paused: true,
    repeat: shakingRepetition,
    repeatDelay: 0
});

timelineShacking
    .fromTo("#bike", 0.02, { x: 0, y: 0 }, { x: 5, y: -5, repeat: 3, repeatDelay: 0.1, yoyo: true, rotation: -1 }, 0)
    .to("#bike", (timeUntilAnimationOver - timeUntilAnimationOver / 4) / shakingRepetition, { rotation: 2 });

function getCurrentDemoColor(cssvar) {
    var demo1customStyles = window.getComputedStyle(bike);
    return demo1customStyles.getPropertyValue(cssvar);
}

/* main animation */

const timelineMainAnimation = new TimelineLite({
    paused: true
});

timelineMainAnimation.set("#bike", { opacity: 0.7 }, 0)
    .set("#mainpaths path:nth-child(even)", { fill: "none" }, "0")
    .staggerFromTo("#mainpaths path", strokeAnimationSpeed, { drawSVG: "0 40%" }, { drawSVG: "60% 100%", yoyo: true, repeat: -1 }, 1.2, "0");

const timelineMainFillAnimation = new TimelineLite({
    paused: true
});

timelineMainFillAnimation
    .staggerFromTo("#mainpaths path:nth-child(odd)", fillAnimationSpeed, { clearProps: "all" }, { fill: "none", yoyo: true, repeat: -1, repeatDelay: fillAnimationDelay, ease: Power4.easeOut }, 1.2, "0");

function startAnimation(currentdemo) {
    if (currentdemo === previousClass)
        return false;
    resetAllTimelines(function () {
        var target = document.querySelectorAll('#mainpaths path');
        Array.prototype.forEach.call(target, function (element) {
            element.removeAttribute('style');
        });
        bike.classList.remove(previousClass);
        previousClass = currentdemo;
        bike.classList.add(currentdemo);
        timelineMainAnimation.play(9245);
        timelineMainFillAnimation.play(9245);
        timelineWheels.play(0);
        timelineWheels.timeScale(1);
        timelineEntrance.play(0);
        timelineEntrance.timeScale(1);
    });
}

function endAnimation(callback) {
    timelineMainAnimation.pause();
    timelineMainFillAnimation.pause();
    timelineExit.play(0);
    timelineEntrance.kill();
    if (callback) {
        timelineExit.addCallback(callback);
    }
}

var pausetimeout;
var slowingtimeout;
var preslowingtimeout;
var timescale = { value: 1 }; //1 = normal speed 0 = stop -1 reverse
var singleTweens = [];

function triggerAfterEntrance() {
    timelineShacking.play(0);
    preslowingtimeout = window.setTimeout(function () {
        timelineMainAnimation.pause();
        timelineMainFillAnimation.pause();
        TweenLite.to(timescale, timeUntilAnimationOver, { value: 0, ease: Power4.easeInOut });
        for (var i = 0; i <= timeUntilAnimationOver; i += timeUntilAnimationOver / 10) {

            slowingtimeout = setTimeout(function () {
                timelineWheels.timeScale(timescale.value);//start at 1 then slow 10 times until it reach 0
                if (slowShakingOverTime) {
                    timelineShacking.timeScale(timescale.value);
                }
            }, i * 1000);
        }
        pausetimeout = setTimeout(function () {
            timelineWheels.pause();
            timelineShacking.pause();
        }, (timeUntilAnimationOver * 1000) + 1000);//kill all possible remaining animation after everything is over
        singleTweens[0] = TweenMax.staggerTo("#mainpaths path", speedStrokesToFull, { drawSVG: true }, staggerStrokesDelay);
        singleTweens[1] = TweenMax.staggerTo("#mainpaths path:nth-child(8n+1)", timeForPathToFill, { delay: timeForStrokesToBeFull - delayBeforeFillPaths, fill: getCurrentDemoColor("--animation-color-1"), clearProps: "all" }, staggerFillDelay);
        singleTweens[2] = TweenMax.staggerTo("#mainpaths path:nth-child(8n+2)", timeForPathToFill, { delay: timeForStrokesToBeFull - delayBeforeFillPaths, fill: getCurrentDemoColor("--animation-color-2"), clearProps: "all" }, staggerFillDelay);
        singleTweens[3] = TweenMax.staggerTo("#mainpaths path:nth-child(8n+3)", timeForPathToFill, { delay: timeForStrokesToBeFull - delayBeforeFillPaths, fill: getCurrentDemoColor("--animation-color-3"), clearProps: "all" }, staggerFillDelay);
        singleTweens[4] = TweenMax.staggerTo("#mainpaths path:nth-child(8n+4)", timeForPathToFill, { delay: timeForStrokesToBeFull - delayBeforeFillPaths, fill: getCurrentDemoColor("--animation-color-4"), clearProps: "all" }, staggerFillDelay);
        singleTweens[5] = TweenMax.staggerTo("#mainpaths path:nth-child(8n+5)", timeForPathToFill, { delay: timeForStrokesToBeFull - delayBeforeFillPaths, fill: getCurrentDemoColor("--animation-color-5"), clearProps: "all" }, staggerFillDelay);
        singleTweens[6] = TweenMax.staggerTo("#mainpaths path:nth-child(8n+6)", timeForPathToFill, { delay: timeForStrokesToBeFull - delayBeforeFillPaths, fill: getCurrentDemoColor("--animation-color-6"), clearProps: "all" }, staggerFillDelay);
        singleTweens[7] = TweenMax.staggerTo("#mainpaths path:nth-child(8n+7)", timeForPathToFill, { delay: timeForStrokesToBeFull - delayBeforeFillPaths, fill: getCurrentDemoColor("--animation-color-7"), clearProps: "all" }, staggerFillDelay);
        singleTweens[8] = TweenMax.staggerTo("#mainpaths path:nth-child(8n+8)", timeForPathToFill, { delay: timeForStrokesToBeFull - delayBeforeFillPaths, fill: getCurrentDemoColor("--animation-color-8"), clearProps: "all" }, staggerFillDelay);
    }, delayBeforeAnimationSlow);
}

/* shacking animation value */
const timelineExit = new TimelineMax({
    paused: true
});

timelineExit
    .to("#bike #wheelb", exitWheelRotationSpeed,
    { ease: Power0.easeNone, rotation: "+=360", transformOrigin: "50% 50%", repeat: (exitAnimationDuration) / exitWheelRotationSpeed, yoyo: false }, "0")
    .to("#bike", 0.4, { rotation: -5, transformOrigin: "30% 50%" }, "0")
    .to("#bike #wheelf", exitWheelRotationSpeed,
    { ease: Power0.easeNone, rotation: "+=360", transformOrigin: "50% 50%", repeat: (exitAnimationDuration - exitFrontWheelAnimationDelay) / exitWheelRotationSpeed, yoyo: false }, exitFrontWheelAnimationDelay)
    .to("#bike", 0.3, { rotation: 10 }, exitAnimationDelay)
    .to("#bike", exitAnimationDuration, { left: "120%", top: "130%" }, exitAnimationDelay);

function resetAllTimelines(callback) {
    timelineExit.kill();
    TweenMax.killTweensOf(timescale);
    Array.prototype.forEach.call(singleTweens, function (elements) {
        Array.prototype.forEach.call(elements, function (element) {
            element.pause();
        });
    });
    timescale = { value: 1 };
    clearTimeout(pausetimeout);
    clearTimeout(preslowingtimeout);
    clearTimeout(slowingtimeout);
    timelineShacking.kill();
    timelineWheels.kill();
    timelineMainFillAnimation.pause().invalidate().kill();
    timelineMainAnimation.pause().kill();
    callback();
}

class Slideshow {
    constructor(el) {
        this.items = Array.from(el.querySelectorAll('.bike-nav__item'));
        this.initEvents();
        this.current = 0;
        startAnimation(`bike-${this.current + 1}`);
    }
    initEvents() {
        this.items.forEach((item, pos) => item.addEventListener('click', () => this.navigate(pos)));
    }
    navigate(pos = 0) {
        if (this.isAnimating || pos === this.current) return false;
        this.isAnimating = true;
        this.items[this.current].classList.remove('bike-nav__item--current');
        this.current = pos;
        this.items[this.current].classList.add('bike-nav__item--current');
        endAnimation(() => {
            startAnimation(`bike-${this.current + 1}`);
            this.isAnimating = false;
        });
    }
};

new Slideshow(document.querySelector('.bike-nav'));
