/*inspiration/rebound of Scott Garner's awesome p5js starbusrh https://codepen.io/scottgarner/pen/ltImK*/

var codePenLogo,
    radiusX,
    radiusY,
    magnets = [],
    triesForTarget;

function preload() {
      codePenLogo = loadImage(setImageSize());
}

function setImageSize() {
    //load small image if device width is less than 500 OR it's mobile AND it's not portrait
    if (windowHeight <= 500 || (isMobile() && (window.orientation !== 0))) {
        triesForTarget = 20;
        return "//s3-us-west-2.amazonaws.com/s.cdpn.io/97151/codepen-hint-300.jpg"; // 300x300
    } else {
      	triesForTarget = 15;
        return "//s3-us-west-2.amazonaws.com/s.cdpn.io/97151/codepen-hint-500.jpg"; // 500x500
    }
}

//setup() runs once. define canvas, settings for first frame of animation
function setup() {
    isMobile() ? createCanvas(350, windowHeight) : createCanvas(windowWidth, windowHeight);
    
    // I'm declaring HSB color mode with alpha
    // with maxium ranges for values at 100 (i.e., mapping range color range 0..255 to 0..100)
    colorMode(HSB, 100, 100, 100, 100);
    // declaring noStroke(), 
    // holds true until overridden
    noStroke();
		//UPDATE: Safari throwing error for context.ellipse() so removing the canvis clip for now
    // unless mobile, using stardard cavas API here to clip the canvas from rectangular 
    //to an ellipse spanning  the width and height of the window
    // (couldn't figure out how to do this with p5 library directly)
/*    if (!isMobile()) {
        var canvas = document.getElementById('defaultCanvas');
        var context = canvas.getContext('2d');
        radiusX = width / 2;
        radiusY = height / 2;

        //x coordinate of center, y coordinate of center, x-axis radius, x-axis radius,rotation, startAngle, endAngle
        context.ellipse(radiusX, radiusY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        // in contrast to p5 syntax ellipse(x-coordinate, y-coordinate, width, height)
        context.clip();
    }*/
}


// draw() loops infinitely: each loop = animation frames
// draw() function gets called approximately 60 times a second
function draw() {
    //reset the background color of the cavas on each loop
    //to "clear" the display window at the beginning of each frame
    // [show what happens when I omit this]
    background(60, 25, 19, 100);

    //use built-in mouseX and mouseY to create a vector at the mouse coorindate, 
    //or again at last coordinate if out of window range
    // just use 0, 0 if it's a mobile device
    var position = isMobile() ? createVector(0, 0) : createVector(mouseX, mouseY);

    //a random coordinate corresponding to a non-white pixel on the logo image
    var target = findTarget();

    // create a magnet object with these values and add to my array of magnets
    // which holds properties for current position and target, 
    // as well as a randomly generated diameter property
    var magnet = new Magnet(position, target);
    magnets.push(magnet);

    //I want no more than 2300 magnets to adequately cover the space of the logo pixels
    //so, when i reach my max, remove one before entering the next
    //animation frame so I can continuously create them
    if (magnets.length > 2300) magnets.shift(); 

    //for each draw frame, I want to loop through my entire array of magnets 
    // and call my methods updating their position and color
    for (var i = 0; i < magnets.length; i++) {
        magnets[i].update();
        magnets[i].draw();
    }
}

/******************************************************************/

// each magnet gets a number of tries to find a target location:
// we pick a random spot corresponding to a location on the codepen image, and 
// choosing it if the random spot isn't white (if the red value of the pixel is less than 255 using the built in red() function)

// 15 tries works pretty well for the larger logo, if much less there are lots of misses since it will take the last random coordinate anyway. I'll give it 5 more tries if it's the smaller image in which I made the lines of the logo narrower. to do this but not check which image each time, I created the triesForTarget when the large or small logo was selected in preload()
function findTarget() {
    var x, y;
    for (var i = 0; i < triesForTarget; i++) {
        x = floor(random(codePenLogo.width));
        y = floor(random(codePenLogo.height));
        if (red(codePenLogo.get(x, y)) < 255) break;
    }
    //relative to the default reference to the image pixels at coordinates (0, 0), 
    //reposition the returned vector so it is at absolute center of the window's size at runtime
    return createVector(x + (width / 2 - codePenLogo.width / 2), y + (height / 2 - codePenLogo.height / 2));
}

function Magnet(position, target) {
    this.position = position;
    this.target = target;
    this.diameter = random(8, 22); //random size for dot
}

// why dots move faster when farther from their target:
// linear interpolation- lerp(start, stop, amount) 
Magnet.prototype.update = function() {
    // using linear interpolation, map the distance between the current position 
    // and the target coordinate. By passing the amount argument of 0.09, 
  	// the dot's motion is modeled by updating it's position incrementing towards its target 
  	// at 9% of the distance from it's current position to the target every animation 
  	// frame--so it "slows down" as it gets very close, as the calculated distance perframe is much smaller.
    this.position = p5.Vector.lerp(
        this.position, //start at magnets currnet position
        this.target, //stop at target
        0.09 //interpolate by this amount
    );
};

Magnet.prototype.draw = function() {
  	// to get the more natural appearance of TWINKLING ...
    // p5's noise(x, y, z) function can do 1D, 2D or 3D 
    // (here being 3D, passing in all 3 parameters)

    // this noise function is an implementation of Perlin noise: 
    // algorithm for random sequence that produces more natural ordered, 
    // harmonic succession of numbers compared to the standard random() function.
    // Perlin noise is defined in an infinite n-dimensional space where each 
    // pair of coordinates corresponds to a fixed semi-random value 
    // (fixed only for the lifespan of the program)
		var elapsedSeconds = millis() / 1000.0; // since running
    // alpha evaluates to a (semi-random) value between 0 and 1
    var alpha = noise(
        this.target.x,
        this.target.y,
        // random(.3, .7) // try uncommenting this and comment out elapsedSeconds
        elapsedSeconds
    );
    // var alpha = random(0..1) //also see difference if uncomment this adn comment out the above alpha def

    // p5 map function Re-maps a number from one range to another. 
    // update the random time funtion to a number between 0 and 100 for a hue
    // b/c my max for hue is set to 100 and i want it to do the full 
    //spectrum of color in 30 seconds...
  	var time = millis() % 30000;
    var hue = map(time, 0, 30000, 0, 100);

    //set the fill for any following shapes: 
    //change the brightness using the noise to create the flickering
    //alpha is between 0 and 1 and brightness maxes at 100, 
    //so by multiplying alpha by 200, i'll be more likely to have full brightness 
    //but still possible to see very low
    fill(hue, 70, alpha * 200);

    //draws the actual dot with the above calculated color 
    //using the magnets updated position and diameter...
    //..which again is called 60 times/second, redrawing it each time!
    ellipse(
        this.position.x, this.position.y,
        this.diameter, this.diameter
    );
};

// check if mobile device
function isMobile() {
   return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? true : false;
}