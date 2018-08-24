var config = { 
    max : 3,
    size : 10,
    age : 1000
};

var cubes = [];

function rand(min, max, e) {
    if(typeof e == 'undefined'){
        return Math.random() * (max - min + 1) + min;
    } else {
        do {
            var rand = Math.floor(Math.random() * (max - min + 1) + min);
        } while(rand == e);
    }
    return rand;
}

var Cube = function(x, y) {
    this.x = x;
    this.y = y;
    this.size = config.size;
    this.cont = true;
    this.height = this.size * (Math.sqrt(3) / 2);
    this.age = 0;
}

Cube.prototype = {
    update: function() {
        if (this.cont) {
            this.x += this.height * rand(-1, 1, 0);
            this.y += (this.size / 2 * 3) * rand(-1, 1, 0);
        }

        if (cubes.length < config.max) {
            cubes.push(new Cube(this.x, this.y));
        }

        this.age++;

        if (this.x >= canvas.width - (this.height*2) || this.x <= 0
            || this.y >= canvas.height - (this.size*2) || this.y <= 0 
            || this.age >= config.age) {
            this.cont = false;
        }
    },

    render: function(ctx) {
        if (this.cont) {
            var x = this.x;
            var y = this.y;
            var size = this.size;
            var h = this.height;

            ctx.globalAlpha = '0.5';

            // draw iso cube
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + h, y - size/2);
            ctx.lineTo(x + h*2, y);
            ctx.lineTo(x + h, y + size/2);
            ctx.closePath();
            ctx.fillStyle = "#" + Math.floor((Math.random() * 16777215)).toString(16);
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + h, y + size/2);
            ctx.lineTo(x + h, y + (size/2) * 3);
            ctx.lineTo(x, y+size);
            ctx.closePath();
            ctx.fillStyle = "#" + Math.floor((Math.random() * 16777215)).toString(16);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(x + h*2, y);
            ctx.lineTo(x + h*2, y+size);
            ctx.lineTo(x + h, y + (size/2) * 3);
            ctx.lineTo(x + h, y + size/2);
            ctx.closePath();
            ctx.fillStyle = "#" + Math.floor((Math.random() * 16777215)).toString(16);
            ctx.fill();

        };
    },

    destroy: function() {

    }
};

var Mozaik = new function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var centerX = window.innerWidth / 2;
    var centerY = window.innerHeight / 2;
    var start = false;

    function spawn(x, y) {
        for(var i = 0; i < config.max; i++) {
            cubes.push(new Cube(x, y));
        }
    }

    function clickEvent(e) {
        Mozaik.reset();
        Mozaik.clear();
        spawn(e.offsetX, e.offsetY);
    }

    function onResize() {
        canvas.width = window.innerWidth - 50;
        canvas.height = window.innerHeight - 50;

        Mozaik.reset();
        spawn(centerX, centerY);
    }

    function update() {
        requestAnimFrame(update);
        var cube;

        for(var i = 0, c = cubes.length; i < c; i++){
            cube = cubes[i];
            cube.update();
            cube.render(ctx);
        }

    }

    return {
        init: function() {
            onResize();

            if(!start){
                start = true;
                $(window).resize(onResize);
                canvas.addEventListener('click', clickEvent, false);
                update();
            }
        },
        reset: function() {
            for(var i = 0, c = cubes.length; i < c; i++){
                cubes[i].destroy();
            }

            cubes = [];
        },

        clear: function() {
            Mozaik.reset();
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        }
    }
}

/* Ty Paul Irish */
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame   || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(/* function */ callback, /* DOMElement */ element){
					return window.setTimeout(callback, 1000 / 33);
			};
})();

$('#regen').bind('click', function(){
  Mozaik.init();
});
// start
Mozaik.init();