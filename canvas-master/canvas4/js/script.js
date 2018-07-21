console.clear();

// Config constants
var ANTIALIAS = false,
    GROUND_SPACING = 35,
    GROUND_LINES = 20;

var entities;

// Canvas init
var c = document.getElementById('output'),
    ctx = c.getContext('2d');

ctx.webkitImageSmoothingEnabled = 
    ctx.imageSmoothingEnabled = 
    ctx.mozImageSmoothingEnabled = 
    ctx.oImageSmoothingEnabled = ANTIALIAS;

// Asset references
var treeImg = document.getElementById('tree'),
    rockImg = document.getElementById('rock'),
    flatImg = document.getElementById('flat'),
    logoImg = document.getElementById('logo');

// Virtual horizon for perspective calc
var vanishingPoint = {
    x: c.width * 0.5,
    y: c.height * 0.4
};

var camera = {
    x: 0,
    y: 40,
    z: -10,
    fov: 170,
    dist: 300
};

/**
 * Base entity class, renders a coloured rect by default
**/
function Entity(x, y, z, color) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.anchor = { x: 0.5, y: 1 };
    this.scale = 1;
    this.width = 10;
    this.height = 60;
    this.color = color || 'red';
    
    this._p = {};
}

Entity.prototype._canRender = function() {
    // don't draw if behind camera or beyond draw dist
    if (camera.z - this.z < 0) return false;
    if (camera.z - this.z > camera.dist) return false;
    return true;
};

Entity.prototype.calc = function(attr) {
    // Calculate scaling factor based on camera FOV and position
    this._p.sf =  camera.fov / (camera.z - this.z);
    
    // Calculate position and size on screen
    this._p.dx = (camera.x + this.x) * this._p.sf + vanishingPoint.x;
    this._p.dy = (camera.y - this.y) * this._p.sf + vanishingPoint.y;
    this._p.dw = this.width * this.scale * this._p.sf;
    this._p.dh = this.height * this.scale * this._p.sf;
    
    // Translate to anchor for rendering purposes
    this._p.dx -= this._p.dw * this.anchor.x;
    this._p.dy -= this._p.dh * this.anchor.y;
}

Entity.prototype.render = function() {

    if(!this._canRender()) return false;
    
    this.calc();
    this.draw();
};

Entity.prototype.draw = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this._p.dx >> 0, this._p.dy >> 0, 
                 this._p.dw >> 0, this._p.dh >> 0);
};

/**
 * Sprite subclass, renderes a scaled billboarded image
**/
function Sprite(x, y, z, img) {
    Entity.call(this, x, y, z);
    this.img = img;
    this.width = img.width;
    this.height = img.height;
}
Sprite.prototype = Object.create(Entity.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.draw = function() {
    if(this.clipRect) {
        ctx.drawImage(this.img, 
                      this.clipRect.x >> 0, this.clipRect.y >> 0, 
                      this.clipRect.width >> 0, this.clipRect.height >> 0,
                      this._p.dx >> 0, this._p.dy >> 0, this._p.dw >> 0, this._p.dh >> 0);
    } else {
        ctx.drawImage(this.img, this._p.dx >> 0, 
                      this._p.dy >> 0, this._p.dw >> 0, this._p.dh >> 0);
    }  
};

/**
 * Flat subclass, renders an image as a plane, SNES Mode7-style
**/
function Flat(x, y, z, img) {
    Sprite.call(this, x, y, z, img);

    this.lines = [];
    
    for(var i = 0; i < img.height; i++) {
        // TODO: sort out magic numbers here
        var line = new Sprite(x, y, z + (i * 0.7), img);
        line.height = 2;
        line.clipRect = {
            x: 0, 
            y: i, 
            width: this.width, 
            height: 1
        };
        this.lines.push(line);
    }
}
Flat.prototype = Object.create(Sprite.prototype);
Flat.prototype.constructor = Flat;

Flat.prototype.render = function() {
    this.lines.forEach(function(line) {
        line.render();
    });
};


// Simple z-ordering for entities, to be passet to array.sort()
function _zSort(a, b) {
    return a.z - b.z;
}

// Init the entities in the scene
function _createEntities() {
    entities = [];

    // These don't have to be in order as we sort them after.
    // TODO: establish a data format for creating these
    entities.push(new Entity(70, 0, -600, '#666'));
    entities.push(new Entity(-90, 0, -500, 'yellow'));
    entities.push(new Entity(0, 0, -200, 'lightblue'));
    entities.push(new Entity(-80, 0, -270, 'silver'));
    entities.push(new Entity(20, 0, -100, 'grey'));
    entities.push(new Entity(150, 0, -300, 'lightgreen'));
    entities.push(new Entity(-30, 0, -230, 'purple'));
    
    entities.push(new Sprite(-50, 0, -580, treeImg));
    entities.push(new Sprite(90, 0, -490, treeImg));
    entities.push(new Sprite(80, 0, -180, treeImg));
    entities.push(new Sprite(-70, 0, -150, treeImg));
    entities.push(new Sprite(40, 0, -120, treeImg));
    entities.push(new Sprite(-30, 0, -340, treeImg));
    entities.push(new Sprite(-60, 0, -310, treeImg));
    entities.push(new Sprite(70, 0, -260, treeImg));
    
    entities.push(new Sprite(-20, 0, -530, rockImg));
    entities.push(new Sprite(10, 0, -370, rockImg));
    entities.push(new Sprite(-70, 0, -220, rockImg));
    entities.push(new Sprite(-80, 0, -110, rockImg));
    entities.push(new Sprite(10, 0, -90, rockImg));
    entities.push(new Sprite(60, 0, -80, rockImg));
    
    entities.push(new Flat(-20, 0, -470, flatImg));
    entities.push(new Flat(100, 0, -400, logoImg));
    
    entities.sort(_zSort);
}

// Render the ground
function _drawHorizon() {
    ctx.fillStyle = '#364';
    ctx.fillRect(0, vanishingPoint.y, c.width, c.height - vanishingPoint.y);
}

// Render perspective-corrected lines on the ground to give a sense of depth.
// Always spwan relative to the camera.
function _drawGroundLines() {
    ctx.fillStyle = '#253';
    
    var iz = Math.floor(camera.z / GROUND_SPACING);
    
    for(var i = 0; i < GROUND_LINES; i++) {
        
        var z = (iz * GROUND_SPACING) - (GROUND_SPACING * i);
        
        // Don't draw if behind camera or beyond draw dist
        if (camera.z - z < 0) continue;
        if (camera.z - z > camera.dist) return;

        var scalingFactor = camera.fov / (camera.z - z);
        var y = camera.y * scalingFactor + vanishingPoint.y;
        
        ctx.fillRect(0, y, c.width, 1);
    }
}

function update() {
    // Move the camera in a sinus patten, yay magic numbers
    var t = Date.now() * 0.001;
    
    camera.x = Math.sin(t * 0.6) * 50 * 0.7;
    camera.y = (Math.sin(t * 0.5) * 100 * 0.2) + 60;
    camera.z = (Math.sin(t * 0.2) * 550 * 0.3) - 190;
    
    // Pitch / yaw the camera slightly by adjusting the vanishing point
    vanishingPoint.x = (Math.sin(t * 0.6) * (c.width * 0.2)) + (c.width * 0.5);
    vanishingPoint.y = (Math.sin(t * 0.5) * (c.height * 0.2)) + (c.height * 0.5) - 50;
}

function render() {
    ctx.clearRect(0, 0, c.width, c.height);
    
    _drawHorizon();
    _drawGroundLines();
    
    var l = entities.length;
    for (var i = 0; i < l; i++) {
        entities[i].render();
    }
}

var lt = Date.now()
FRAME_TIME = 1000 / 70
function frame() {
    requestAnimationFrame(frame);
    var ct = Date.now()
    if (ct - lt > FRAME_TIME) {
        lt = ct;
        update();
        render();
    } 
}

function _sizeCanvas() {
    var ww = window.innerWidth,
        wh = window.innerHeight;
    
    if(ww > wh) {
        c.style.height = window.innerHeight * 0.95 + 'px';
        c.style.width = 'auto';
    } else {
        c.style.width = window.innerWidth * 0.95 + 'px';
        c.style.height = 'auto';
    }
}

function init() {
    _createEntities();
    _sizeCanvas();
    
    window.addEventListener('resize', _sizeCanvas, false);
    
    frame();
}

init();