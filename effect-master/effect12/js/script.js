// First experiment with Verlet integration.
// Written in typescript (yay!) and compiled/build to js.

var Point = (function () {
    function Point(x, y) {
        this.size = 10;
        this.drawSize = 1;
        this.position(x, y);
    }
    Object.defineProperty(Point.prototype, "vx", {
        get: function () {
            return this.x - this.ox;
        },
        set: function (value) {
            this.ox = this.x - value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Point.prototype, "vy", {
        get: function () {
            return this.y - this.oy;
        },
        set: function (value) {
            this.oy = this.y - value;
        },
        enumerable: true,
        configurable: true
    });
    Point.prototype.position = function (x, y) {
        this.x = this.ox = x;
        this.y = this.oy = y;
    };
    Point.prototype.constrain = function (x, y, width, height) {
        this.x = Math.max(x, Math.min(x + width, this.x));
        this.y = Math.max(y, Math.min(y + height, this.y));
    };
    Point.prototype.update = function () {
        var tx = this.x;
        var ty = this.y;
        this.x += this.vx;
        this.y += this.vy;
        this.ox = tx;
        this.oy = ty;
    };
    Point.prototype.draw = function (context) {
        context.beginPath();
        context.arc(this.x, this.y, this.drawSize, 0, 2 * Math.PI);
        context.stroke();
    };
    return Point;
})();
var Stick = (function () {
    function Stick(start, end, length) {
        if (typeof length === "undefined") { length = -1; }
        this.startPoint = start;
        this.endPoint = end;
        if(length == -1) {
            var dx = start.x - end.x;
            var dy = start.y - end.y;
            this.length = Math.sqrt(dx * dx + dy * dy);
        } else {
            this.length = length;
        }
    }
    Stick.prototype.update = function () {
        var dx = this.endPoint.x - this.startPoint.x;
        var dy = this.endPoint.y - this.startPoint.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var diff = this.length - dist;
        var nx = (diff * dx / dist) / 2;
        var ny = (diff * dy / dist) / 2;
        this.startPoint.x -= nx;
        this.startPoint.y -= ny;
        this.endPoint.x += nx;
        this.endPoint.y += ny;
    };
    Stick.prototype.draw = function (context) {
        context.beginPath();
        context.moveTo(this.startPoint.x, this.startPoint.y);
        context.lineTo(this.endPoint.x, this.endPoint.y);
        context.stroke();
    };
    return Stick;
})();
var VerletSystem = (function () {
    function VerletSystem(iterations) {
        if (typeof iterations === "undefined") { iterations = 1; }
        this.points = [];
        this.sticks = [];
        this.iterations = iterations;
    }
    VerletSystem.prototype.addPoint = function (x, y) {
        var p = new Point(x, y);
        this.points.push(p);
        return p;
    };
    VerletSystem.prototype.addStick = function (firstPoint, secondPoint, length) {
        if (typeof length === "undefined") { length = -1; }
        var s = new Stick(firstPoint, secondPoint, length);
        this.sticks.push(s);
        return s;
    };
    VerletSystem.prototype.updatePoints = function () {
        for(var i = 0, l = this.points.length; i < l; i++) {
            this.points[i].y += 0.5;
            this.points[i].update();
        }
    };
    VerletSystem.prototype.constrainPoints = function (width, height) {
        for(var i = 0, l = this.points.length; i < l; i++) {
            this.points[i].constrain(20, 20, width - 20, height - 20);
        }
    };
    VerletSystem.prototype.drawPoints = function (context) {
        for(var i = 0, l = this.points.length; i < l; i++) {
            this.points[i].draw(context);
        }
    };
    VerletSystem.prototype.updateSticks = function () {
        for(var i = 0, l = this.sticks.length; i < l; i++) {
            this.sticks[i].update();
        }
    };
    VerletSystem.prototype.drawSticks = function (context) {
        for(var i = 0, l = this.sticks.length; i < l; i++) {
            context.beginPath();
            this.sticks[i].draw(context);
            context.fill();
        }
    };
    VerletSystem.prototype.update = function (context, width, height, drawPoint) {
        if (typeof drawPoint === "undefined") { drawPoint = false; }
        this.updatePoints();
        for(var i = 0; i < this.iterations; i++) {
            this.constrainPoints(width, height);
            this.updateSticks();
        }
        if(drawPoint) {
            this.drawPoints(context);
        }
        this.drawSticks(context);
    };
    return VerletSystem;
})();
var Playground = (function () {
    function Playground() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseDown = false;
        this.pinX = 100;
        this.pinY = 100;
        this.colsNumber = 25;
        this.linesNumber = 20;
        this.distance = 20;
        this.pinned = true;
        this.color = "#C80000";
        var canvas = document.querySelector("#canvas");
        this.context = canvas.getContext("2d");
        this.context.lineWidth = 1;
        this.resize();
        this.init();
        window.addEventListener('resize', this.resize.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.animate();
    }
    Playground.prototype.init = function () {
        this.cloth = new VerletSystem(5);
        for(var i = 0; i < this.linesNumber; i++) {
            for(var j = 0; j < this.colsNumber; j++) {
                this.cloth.points[i * this.colsNumber + j] = new Point(this.pinX + i * this.distance, this.pinY + j * this.distance);
                this.cloth.points[i * this.colsNumber + j].size = 15;
                this.cloth.points[i * this.colsNumber + j].drawSize = 1;
                if(i > 0) {
                    this.cloth.addStick(this.cloth.points[i * this.colsNumber + j], this.cloth.points[(i - 1) * this.colsNumber + j]);
                }
                if(j > 0) {
                    this.cloth.addStick(this.cloth.points[i * this.colsNumber + j - 1], this.cloth.points[i * this.colsNumber + j]);
                }
            }
        }
        this.rope = new VerletSystem(5);
        for(i = 0; i < this.linesNumber; i++) {
            this.rope.addPoint(i * this.width / this.linesNumber, this.pinY);
            this.rope.points[i].drawSize = 10;
            if(i > 0) {
                this.rope.addStick(this.rope.points[i - 1], this.rope.points[i]);
            }
        }
    };
    Playground.prototype.onMouseMove = function (e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    };
    Playground.prototype.onMouseDown = function (e) {
        this.mouseDown = true;
        for(var i = 0, l = this.cloth.points.length; i < l; i++) {
            for(var j = 0, k = this.cloth.points.length; j < k; j++) {
                var dx = this.mouseX - this.cloth.points[j].x;
                var dy = this.mouseY - this.cloth.points[j].y;
                var dist = dx * dx + dy * dy;
                if(dist <= this.cloth.points[j].size * this.cloth.points[j].size) {
                    this.targetPoint = this.cloth.points[j];
                    return;
                }
            }
        }
    };
    Playground.prototype.onMouseUp = function (e) {
        this.mouseDown = false;
        this.targetPoint = null;
    };
    Playground.prototype.resize = function () {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.context.canvas.width = this.width;
        this.context.canvas.height = this.height;
    };
    Playground.prototype.animate = function () {
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.fillStyle = this.context.strokeStyle = this.color;
        this.context.globalCompositeOperation = "lighter";
        if(this.pinned) {
            this.cloth.points[0].position(this.pinX, this.pinY);
            this.cloth.points[this.colsNumber - 1].position(this.width - this.pinX, this.pinY);
        }
        this.cloth.update(this.context, this.width, this.height, true);
        if(this.targetPoint) {
            this.targetPoint.position(this.mouseX, this.mouseY);
        }
        requestAnimationFrame(this.animate.bind(this));
    };
    return Playground;
})();
var Run = (function () {
    function Run() {
        var playground = new Playground();
    }
    return Run;
})();
var run = new Run();
