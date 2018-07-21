console.clear();

// 'Utils' object available - see https://codepen.io/njmcode/pen/doPJLM.js

var BASE_SPEED = 0.005,
    MAP_SIZE = 48,
    TILE_SIZE = 6,
    NOISE_TYPE = 'simplex2',
    REZ = 35,
    FUZZ = 0;

var c = document.getElementById('output'),
    ctx = c.getContext('2d');

var bc = document.createElement('canvas'),
    bctx = bc.getContext('2d');
bc.width = c.width;
bc.height = c.height;

function normalize(sine, value) {
    return Math.round((value * 0.5) + (sine * (value * 0.5)));
}

function getColorString(r,g,b) {
    return 'rgba(' + r + ',' + g + ',' + b + ', 1)';
}

function getRndFloat(min, max) {
  return Math.random() * (max - min) + min;
};

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

var map = [];

function generate() {
    map = [];
    
    // https://github.com/josephg/noisejs
    noise.seed(Date.now());

    for (var y = 0; y < MAP_SIZE; y++) {
      for (var x = 0; x < MAP_SIZE; x++) {
        var value = noise[NOISE_TYPE](x / REZ, y / REZ),  // -1 ... 1
            fuzz = getRndFloat(-FUZZ, FUZZ);
        map.push(clamp(value + fuzz, -1, 1));
      }
    }
}

var config = {
    r: {
        enabled: true,
        freq: 0.05,
        speed: 0.9,
        amp: 1,
        ofs: 5,
        fn: 'sin',
        lo: 0,
        hi: 256
    },
    g: {
        enabled: true,
        freq: 0.01,
        amp: 1,
        speed : 0.3,
        ofs: 5,
        fn: 'sin',
        lo: 0,
        hi: 256
    }, 
    b: {
        enabled: true,
        freq: 0.03,
        amp: 1,
        speed: 0.2,
        ofs: 5,
        fn: 'sin',
        lo: 0,
        hi: 256
    }
};

function _calcChannel(k, v, t) {
    var data = config[k],
        ov = (v >= data.lo && v <= data.hi) ? 
            normalize(Math[data.fn]((v * data.freq) + (data.ofs + (t * data.speed))), data.amp * 255) : 0;
    return ov;
}

function palette(v, t) {
    var output = [];
    ['r','g','b'].forEach(function(k, idx) {
        var val = (config[k].enabled) ? _calcChannel(k, v, t) : v;
        output.push(val);
    });
    return output;
}

function render() {
    bctx.clearRect(0, 0, c.width, c.height);
    ctx.clearRect(0, 0, c.width, c.height);
    
    var t = BASE_SPEED * Date.now();
    
    for(var i = 0; i < 256; i++) {
        bctx.fillStyle = getColorString(i, i, i);
        bctx.fillRect(i, 50, 1, 20);
        
        ['r','g','b'].forEach(function(k, idx) {
            var args = [0,0,0];
            args[idx] = (config[k].enabled) ? _calcChannel(k, i, t) : i;
            bctx.fillStyle = getColorString.apply(this, args);
            bctx.fillRect(i, 80 + 30 * idx, 1, 20);
        });
        var nv = palette(i, t);
        bctx.fillStyle = getColorString(nv[0], nv[1], nv[2]);
        bctx.fillRect(i, 200, 1, 20);
    }
    
    for(var y = 0; y < MAP_SIZE; y++) {
        for(var x = 0; x < MAP_SIZE; x++) {
            var v = map[(y * MAP_SIZE) + x];
            var color = Math.round(Math.abs(v) * 256);
            var nv = palette(color, t);
            bctx.fillStyle = getColorString(nv[0], nv[1], nv[2]);
            bctx.fillRect(300 + (x * TILE_SIZE), y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
    
    ctx.drawImage(bc, 0, 0);
}

function frame() {
    requestAnimationFrame(frame);
    render();
}


// Set up GUI
var gui = new dat.GUI({ autoPlace: false });
document.getElementById('controls').appendChild(gui.domElement);

gui.add(this, 'REZ').min(2).max(100).step(1).name('Resolution');
gui.add(this, 'FUZZ').min(0).max(0.1).step(0.01).name('Fuzz factor');
gui.add(this, 'generate').name('Regenerate');
gui.add(this, 'BASE_SPEED').min(0).max(0.05).step(0.001).name('Global speed');

['r','g','b'].forEach(function(k, idx) {
    var f = gui.addFolder(k);
    f.add(config[k], 'enabled');
    f.add(config[k], 'fn', ['sin', 'cos']);
    f.add(config[k], 'freq').min(0.01).max(0.5).step(0.005);
    f.add(config[k], 'ofs').min(1).max(Math.PI * 2).step(0.01);
    f.add(config[k], 'speed').min(0).max(3).step(0.1);
    f.add(config[k], 'amp').min(0).max(1).step(0.01);
    f.add(config[k], 'lo').min(0).max(255).step(1);
    f.add(config[k], 'hi').min(0).max(255).step(1);
    f.open();
});

generate();
frame();