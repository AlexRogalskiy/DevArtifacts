console.clear();

/** This is dead simple, just heavily-commented! **/

// Some constants to tweak.
var NUM_CIRCLES = 60,
    MIN_SIZE = 50,
    MAX_SIZE = 100;

// Returns a random int between two numbers.
function getRndInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Cache refs to our canvas, context and images.
var c = document.getElementById('output'),
    ctx = c.getContext('2d'),
    sources = document.getElementById('sources'),
    imgBase = document.getElementById('base'),
    imgXtra = document.getElementById('xtra');

// Timestamp var used in the update-render loop.
var t;

/**
 * An object 'class' to describe a circle which animates
 * its size (radius) and which can randomize its position.
 **/
var Circle = {
    x: 0,
    y: 0,
    size: 0,
    _needsRandomized: false,

    /**
     * Set a random position and max size
     **/
    randomize: function() {
        this.x = getRndInt(50, c.width - 50);
        this.y = getRndInt(50, c.height - 50);
        this.maxSize = getRndInt(MIN_SIZE, MAX_SIZE);
    },

    /**
     * Animates the size up and down via a sine calculation against a passed-in
     * timestamp factorial.  (See the main program update() method).
     * Accepts an offset so different instances will animate out-of-sync
     * (if ofs was 0 for all instances, they would synchronize).
     * When the circle is fully-shrunk, it randomizes its position and max size.
     **/
    update: function(t, ofs) {
        this.size = Math.abs(Math.round(Math.sin(t + ofs) * this.maxSize));

        if (this.size < 2) {
            if (this._needsRandomized) {
                this.randomize();
                this._needsRandomized = false;
            }
        } else {
            this._needsRandomized = true;
        }
    },

    /**
     * Draws a circle to the context at the current position and size.
     * NOTE: this doesn't open or close a path, or apply a fill or stroke.
     * It assumes a path has already been opened in the context.
     * (See main program render() method)
     **/
    draw: function() {
        ctx.moveTo(this.x, this.y);
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    }
};

/**
 *
 * MAIN PROGRAM
 *
 **/

// Create multiple Circle instances in an array.
var circles = [];
for (var i = 0; i < NUM_CIRCLES; i++) {
    var circle = Object.create(Circle);
    circle.randomize();
    circles.push(circle);
}

/**
 * Tell each mask to update itself.  Pass in the current time
 * and an offset integer so the animations do not synchronize.
 **/
function update() {
    t = 0.001 * Date.now();
    circles.forEach(function(circle, idx) {
        circle.update(t, idx);
    });
}

/**
 * Main render method.
 * NOTE: we could have the Circle class drawing its own clip path and
 * image, but for performance reasons we do the main rendering here.
 * So we have one clip path created from multiple circles, instead of 
 * multiple clip paths (and image renders) per frame.
 **/
function render() {
    // Draw the 'Sexualizer' background first.
    // Since this will cover everything from the last frame, 
    // there's no need for an explicit 'clear the canvas' step.
    ctx.drawImage(imgBase, 0, 0);

    // Save the state (before any clip regions exist),
    // and begin a new path.
    ctx.save();
    ctx.beginPath();

    // Draw each Circle instance, at its current position
    // and size, into the open path.
    // (Note that nothing gets visibly 'drawn' here - we're 
    // just defining the shape of the path.)
    circles.forEach(function(circle) {
        circle.draw();
    });

    // Close the path and flag it as a clipping region
    // for any subsequent drawing.
    ctx.closePath();
    ctx.clip();

    // Draw the 'I Am The Night' image, which will be clipped
    // by our path, so it is drawn 'into' the circles.
    ctx.drawImage(imgXtra, 0, 0);

    // Restore the pre-clip state, so that no further
    // clipping will occur.  Otherwise, the Sexualizer bg
    // would get clipped when we draw it next frame.
    ctx.restore();
}

// Main update-render loop.
function loop() {
    requestAnimationFrame(loop);
    update();
    render();
}

// Kick it off when our images are fully loaded.
imagesLoaded(sources, function() {
    console.log('Humans are such easy prey...');
    loop();
});
//# sourceURL=pen.js