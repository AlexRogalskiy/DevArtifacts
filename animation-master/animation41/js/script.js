// 
// Takes in a path and renders the path with given config
const render = (path) => {    
    const pathString = path.coords.reduce((prev, curr, idx) => {
        const control = idx === 0 ? 'M' : 'L';
        return `${prev} ${control}${curr.x} ${curr.y}`
    }, '').concat('z');
    
    path.el.setAttribute('d', pathString);
}

const removeNode = (path) => {
    console.log(path);
    path.remove();    
};

//
// Shape Definition
const shape1 = {
    el: document.querySelector('.shape'),
    coords: [
        {x: 261, y: 261},
        {x: 339, y: 261},
        {x: 339, y: 339},
        {x: 261, y: 339},
    ],
};

const mask1 = {
    el: document.querySelector('.mask1'),
    coords: [
        {x: 242.8, y: 147},
        {x: 410, y: 199.4},
        {x: 410, y: 147},
    ],
};

const mask2 = {
    el: document.querySelector('.mask2'),
    coords: [
        {x: 190, y: 453},
        {x: 318.37, y: 453},
        {x: 190, y: 412.79},
    ],
};

const mask3 = {
    el: document.querySelector('.mask3'),
    coords: [  
        {x: 242.8, y: 147},
        {x: 190, y: 147},
        {x: 190, y: 199.78},
        {x: 296.89, y: 163.93},
    ],
};

const mask4 = {
    el: document.querySelector('.mask4'),
    coords: [  
        {x: 410, y: 453},
        {x: 410, y: 407.95},
        {x: 296.28, y: 446.08},
        {x: 318.37, y: 453},
    ],
};

const mask5 = {
    el: document.querySelector('.mask5'),
    coords: [  
        {x: 190, y: 199.8},
        {x: 212.58, y: 192.2},
        {x: 206.3, y: 417.9},
        {x: 190, y: 412.79},
    ],
};

const mask6 = {
    el: document.querySelector('.mask6'),
    coords: [  
        {x: 410, y: 199.4},
        {x: 387.67, y: 192.36},
        {x: 381.65, y: 417.45},
        {x: 410, y: 407.95},
    ],
};

const linemask = {
    el: document.querySelector('.linemask'),
};

const accentmask = {
    el: document.querySelector('.accentmask'),
    coords: [  
        {x: 225, y: 161},
        {x: 376, y: 161},
        {x: 376, y: 446},
        {x: 225, y: 446},
    ],
};

//
// Sequence Definition
const sequence1 = [
    TweenMax.to(shape1.coords[0], 1, {x: 190, y: 190, onUpdate: render, onUpdateParams: [shape1], ease: Elastic.easeOut.config(1, 0.5)}),
    TweenMax.to(shape1.coords[1], 1, {x: 410, y: 190, onUpdate: render, onUpdateParams: [shape1], ease: Elastic.easeOut.config(1, 0.5)}),
    TweenMax.to(shape1.coords[2], 1, {x: 410, y: 410, onUpdate: render, onUpdateParams: [shape1], ease: Elastic.easeOut.config(1, 0.5)}),
    TweenMax.to(shape1.coords[3], 1, {x: 190, y: 410, onUpdate: render, onUpdateParams: [shape1], ease: Elastic.easeOut.config(1, 0.5)}),    
];

const sequence2 = [
    TweenMax.to(shape1.coords[0], 1, {x: 190, y: 147, onUpdate: render, onUpdateParams: [shape1], ease: Elastic.easeOut.config(1, 0.5)}),
    TweenMax.to(shape1.coords[1], 1, {x: 410, y: 147, onUpdate: render, onUpdateParams: [shape1], ease: Elastic.easeOut.config(1, 0.5)}),
    TweenMax.to(shape1.coords[2], 1, {x: 410, y: 453, onUpdate: render, onUpdateParams: [shape1], ease: Elastic.easeOut.config(1, 0.5)}),
    TweenMax.to(shape1.coords[3], 1, {x: 190, y: 453, onUpdate: render, onUpdateParams: [shape1], ease: Elastic.easeOut.config(1, 0.5)}),
];

const applyMask = () => {
    shape1.el.setAttribute('clip-path', 'url(#cp1)');
};

const sequence4 = [
    TweenMax.to(mask1.coords[1], 0.25, {x: 230, onUpdate: render, onUpdateParams: [mask1], ease: Expo.easeIn}),
    TweenMax.to(mask1.coords[2], 0.25, {x: 230, onUpdate: render, onUpdateParams: [mask1], ease: Expo.easeIn}),
    TweenMax.to(mask2.coords[0], 0.25, {x: 320, onUpdate: render, onUpdateParams: [mask2], ease: Expo.easeIn}),
    TweenMax.to(mask2.coords[2], 0.25, {x: 320, onUpdate: render, onUpdateParams: [mask2], ease: Expo.easeIn}),
];

// const sequence5 = [
//     TweenMax.to(mask2.coords[0], 0.25, {x: 320, onUpdate: render, onUpdateParams: [mask2], ease: Expo.easeIn}),
//     TweenMax.to(mask2.coords[2], 0.25, {x: 320, onUpdate: render, onUpdateParams: [mask2], ease: Expo.easeIn}),
// ];

const sequence6 = [
    TweenMax.to(mask3.coords[0], 0.25, {x: 300, onUpdate: render, onUpdateParams: [mask3], ease: Expo.easeIn}),
    TweenMax.to(mask3.coords[1], 0.25, {x: 300, onUpdate: render, onUpdateParams: [mask3], ease: Expo.easeIn}),
    TweenMax.to(mask3.coords[2], 0.25, {x: 300, onUpdate: render, onUpdateParams: [mask3], ease: Expo.easeIn}),
    TweenMax.to(mask4.coords[2], 0.25, {x: 412, onUpdate: render, onUpdateParams: [mask4], ease: Expo.easeIn}),
    TweenMax.to(mask4.coords[3], 0.25, {x: 412, onUpdate: render, onUpdateParams: [mask4], ease: Expo.easeIn}),
];

// const sequence7 = [
//     TweenMax.to(mask4.coords[2], 0.25, {x: 412, onUpdate: render, onUpdateParams: [mask4], ease: Expo.easeIn}),
//     TweenMax.to(mask4.coords[3], 0.25, {x: 412, onUpdate: render, onUpdateParams: [mask4], ease: Expo.easeIn}),
// ];

const sequence8 = [
    TweenMax.to(mask5.coords[2], 0.25, {y: 190, onUpdate: render, onUpdateParams: [mask5], ease: Expo.easeIn}),
    TweenMax.to(mask5.coords[3], 0.25, {y: 190, onUpdate: render, onUpdateParams: [mask5], ease: Expo.easeIn}),
    TweenMax.to(mask6.coords[0], 0.25, {y: 420, onUpdate: render, onUpdateParams: [mask6], ease: Expo.easeIn}),
    TweenMax.to(mask6.coords[1], 0.25, {y: 420, onUpdate: render, onUpdateParams: [mask6], ease: Expo.easeIn}),
];

// const sequence9 = [
//     TweenMax.to(mask6.coords[0], 0.25, {y: 420, onUpdate: render, onUpdateParams: [mask6], ease: Expo.easeIn}),
//     TweenMax.to(mask6.coords[1], 0.25, {y: 420, onUpdate: render, onUpdateParams: [mask6], ease: Expo.easeIn}),
// ];

const sequence10 = [
    TweenMax.from(linemask.el, 0.25, {y: '-420', ease: Expo.easeIn}),
];

const sequence11 = [
    TweenMax.to('.canvas', 0.75, {rotation: '-30', ease: Bounce.easeOut}),
    TweenMax.to(accentmask.coords[1], 0.15, {x: 450, onUpdate: render, onUpdateParams: [accentmask], ease: Bounce.easeOut}),
    TweenMax.to(accentmask.coords[2], 0.15, {x: 450, onUpdate: render, onUpdateParams: [accentmask], ease: Bounce.easeOut}),
    TweenMax.to(accentmask.coords[0], 0.15, {x: 160, onUpdate: render, onUpdateParams: [accentmask], ease: Bounce.easeOut}),
    TweenMax.to(accentmask.coords[3], 0.15, {x: 160, onUpdate: render, onUpdateParams: [accentmask], ease: Bounce.easeOut}),
];

const sequence12 = [
    TweenMax.to('.drawing', 0.5, {opacity: '0', ease: Power4.easeInOut}),    
    TweenMax.from('#logo', 0.5, {opacity: '0', ease: Power4.easeInOut}),   
    // TweenMax.from('body', 0.5, {'background-color': '#1c2b35', ease: Power4.easeInOut}),   
];

const TL_MASTER = new TimelineMax({paused: true, delay: 0.5});

TL_MASTER
    .add(sequence1)
    .add(sequence2)
    .addCallback(applyMask)
    .add(sequence4)    
    .addCallback(() => mask1.el.remove())
    // .add(sequence5)
    .addCallback(() => mask2.el.remove())
    .add(TweenMax.to('.canvas', 0.5, {rotation: '-=90', ease: Expo.easeOut, delay: 0.25}),)
    .add(sequence6)
    .addCallback(() => mask3.el.remove())
    // .add(sequence7)
    .addCallback(() => mask4.el.remove())
    .add(TweenMax.to('.canvas', 0.5, {rotation: '+=90', ease: Expo.easeOut, delay: 0.25}),)
    .add(sequence8)
    .addCallback(() => mask5.el.remove())
    // .add(sequence9)
    .addCallback(() => mask6.el.remove())
    .add(sequence10)
    .add(sequence11)
    .add(sequence12);
TL_MASTER.timeScale(1).play();