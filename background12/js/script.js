// inspired by Lisi's pen codepen.io/lisilinhart/pen/PjJyRv

$(".svg-shapes svg").click(function() {
    this.classList.toggle("switch");
});

$('.parallax').parallaxify({
        horizontalParallax: true,
        verticalParallax: true,
        parallaxElements: true,
        positionProperty: 'transform',
        responsive: true,
        useMouseMove: true,
        useGyroscope: true,
        alphaFilter: 0.9,
        motionType: 'natural',
        mouseMotionType: 'gaussian',
        inputPriority: 'mouse',
        adjustBasePosition: true,
        alphaPosition: 0.05
    });