console.clear();

var doc = document;
var rangeInput = doc.querySelector('.range-input');
var rangeWrapper = doc.querySelector('.range-wrapper');

var rectFill = doc.querySelector('.rect--fill');

var colorizeSet = [
    {
        list: doc.querySelectorAll('.stop-1'),
        colorFunc: increaseHue
    },
    {
        list: doc.querySelectorAll('.stop-2'),
        colorFunc: decreaseHue
    },
    {
        list: doc.querySelectorAll('.stop-3'),
        colorFunc: increaseHueLarge
    },
    {
        list: doc.querySelectorAll('.stop-4'),
        colorFunc: decreaseHueLarge
    },
    {
        list: doc.querySelectorAll('.stop-transp')
    }
];

var colorHue = 180;
var step = 120;
var stepSmall = 30;
var stepLarge = 150;

var direction = 'forward';
var autoScroll = true;
var changeColorFunc = increaseHue;

var myInt;

function setInt () {
    myInt = window.setInterval(changeColor, 30);
}

rangeWrapper.onmouseover = function () {
    autoScroll = false;
    window.clearInterval( myInt );
}

rangeWrapper.onmouseout = function () {
    autoScroll = true;
    setInt();
}

function changeColor () {
    
    if ( autoScroll ) {
        
        if ( colorHue > 355 ) {
            changeColorFunc = decreaseHue;
        }
        else if ( colorHue < 5 ) {
            changeColorFunc = increaseHue;
        }
    } 
    
    colorHue = changeColorFunc(1);
    rangeInput.value = colorHue;
    
    setFill();
    setGradients();
}

rangeInput.oninput = function () {
    colorHue = +this.value;
    setFill();
    setGradients();
};

function setFill() {
    var color = 'hsl(' + colorHue + ', 100%, 50%)';
    rectFill.setAttribute('fill', color);
}

function increaseHue ( newStep ) {
    var colorStep = newStep || step;
    
    /*console.log('colorStep ' + colorStep);
    console.log('newStep ' + newStep);*/
    
    var color = colorHue + colorStep;
    
    if ( color > 360 ) {
        color = color - 360;
    }
    
    return color;
}

function increaseHueSmall () {
    return increaseHue( stepSmall );
}

function increaseHueLarge () {
    return increaseHue( stepLarge );
}

function decreaseHue ( newStep ) {
    var colorStep = newStep || step;
    
    var color = colorHue - colorStep;
    
    if ( color < 0) {
        color = color + 360;
    }
    
    return color;
};

function decreaseHueSmall () {
    return decreaseHue( stepSmall );
}

function decreaseHueLarge () {
    return decreaseHue( stepLarge );
}

function setStops ( list, colorFunc ) {
    var newColorHue = colorFunc ? colorFunc() : colorHue;    
    var color = 'hsl(' + newColorHue + ', 100%, 50%)';
    
    for ( var i = 0; i < list.length; i++) {
        list[ i ].setAttribute('stop-color', color);
    }
}

var setGradients = function () {
    for ( var i = 0; i < colorizeSet.length; i++ ) {
        var item = colorizeSet[i];
        setStops( item.list, item.colorFunc );
    }   
}

setInt ();
setFill ();
setGradients ();
