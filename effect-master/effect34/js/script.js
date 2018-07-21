var util = {
  degreesToRads: function (degrees) {
    return degrees / 180 * Math.PI;
  },
  randomInt: function (min, max) {
    return min + Math.random() * (max - min + 1);
  },
  $: function (selector) {
    return document.querySelector(selector);
  },

  /**
   * undefined, null, void 0, [], {},
   * with .length === 0 is empty,
   * object without a own enumerable property is empty
   * @param Object obj
   * @return Boolean
   */
  isEmpty: function (obj) {
    if (obj == null) return true
    if (obj.length !== undefined) return obj.length === 0
    return Object.keys(obj).length === 0
  },

  /**
   * Returns a function, that, as long as it continues to be invoked, will not
   * be triggered. The function will be called after it stops being called for
   * `delay` milliseconds. If `atBegin` is passed, trigger the function on the
   * leading edge, instead of the trailing.
   * */
  debounce: function (fn, delay, atBegin) {
    var timeout;
    return function () {
      var that = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        timeout = null;
        if (!atBegin) fn.apply(that, args);
      }, delay);
      if (atBegin && !timeout) {
        fn.apply(that, args);
      }
    };
  },

  // extend prototype
  extend: function (child, parent) {
    // for (var p in parent) if (parent.hasOwnProperty(p)) child[p] = parent[p];
    function __() {
      this.constructor = child;
    }

    child.prototype = parent === null
      ? Object.create(parent)
      : (__.prototype = parent.prototype, new __());
  },
  /**
   * deep assign
   * var p = {a: 1, b:{c: 3}};
   * var c = deepAssign({}, p, {a: 2, b:{d: 4}});
   * c should be {a: 2, b:{c: 3, d: 4}};
   */
  deepAssign: function (target /*[, ...sources]*/) {
    'use strict';
    if (target === undefined || target === null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }
    var output = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source !== undefined && source !== null) {
        for (var nextKey in source) {
          if (Object.prototype.hasOwnProperty.call(source, nextKey)) {
            if (Object.prototype.toString.apply(source[nextKey]) === '[object Object]') {
              output[nextKey] = output[nextKey] ? output[nextKey] : {};
              output[nextKey] = deepAssign({}, output[nextKey], source[nextKey]);
            } else {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
    }
    return output;
  }
};


var Container = (function () {
  "use strict";
  function Container(option) {
    option = util.deepAssign({
      width: document.body.clientWidth,
      height: document.body.clientHeight,
      x: 0,
      y: 0
    }, option);
    this.width = option.width;
    this.height = option.height;
    this.x = option.x;
    this.y = option.y;
    this.needRender = true;
    this.autoResize = false;
    this.children = [];
  }
  Container.prototype.resize = function (width, height) {
    var originWidth = this.width;
    var originHeight = this.height;
    this.width = width || this.width;
    this.height = height || this.height;
    // @TODO resize all children
    this.children.forEach(function(container){
      if(!container.autoResize) {
        container.resize();
        return;
      }
      container.resize(
        container.width * this.width / originWidth,
        container.height * this.height / originHeight);
    }.bind(this));
  };
  Container.prototype.clearChildren = function () {
    this.children = [];
  };
  Container.prototype.addChild = function (child) {
    this.children.push(child);
  };
  Container.prototype.update = function () {
    this.children.forEach(function (particle) {
      particle.update(renderer.ctx);
    });
    this.needRender = true;
  };
  return Container;
})();


var Stage = (function(_super){
  util.extend(Stage, _super);
  function Stage(option) {
    _super.call(this);
    // @TODO the font-family should be set in the option
    this.option = util.deepAssign({
      sampleRate: .25, // 0 ~ 1
      particle: {
        type: 'circle',
        radius: 1,
        gravity: 0,
        duration: .4,
        speed: .1
      }
    }, option);
    this.children = [];
    this.resize(this.width, this.height);
    this.buffer32Cache = null;
  }
  Stage.prototype.resize = function (width, height) {
    _super.prototype.resize.call(this, width, height);
    this.clearChildren(); // @TODO is it necessary here?
    if (this.buffer32Cache){
      this.generate();
    }
  };
  
  Stage.prototype.generate = function (buffer32) {
    var gridW = parseFloat(1 / this.option.sampleRate);
    if(buffer32) this.buffer32Cache = buffer32;
    console.log('generate ', this.width, this.height);
    console.log('generate ', this.buffer32Cache.width, this.buffer32Cache.height);
    console.log('l', this.buffer32Cache.buffer32.length);
    
    var width = this.buffer32Cache.width;
    var height = this.buffer32Cache.height;
    var buffer = this.buffer32Cache.buffer32;
    var enlargeRate = this.height / height;
    for (var y = 0; y < height; y += 1) {
      for (var x = 0; x < width; x += gridW) {
        if (buffer[y * width + x]) {
          var particle = new Particle(x * enlargeRate, y * enlargeRate, this.option.particle);
          // console.log('add', x, y);
          this.addChild(particle);
        }
      }
    }
  };
  
  return Stage;
})(Container);


util.extend(Particle, Container);
function Particle(x, y, option) {
  this.duration = option.duration;
  this.speed = option.speed;
  this.radius = option.radius;
  this.width = this.height = util.randomInt(option.radius, option.radius + 3);
  Container.call(this, {
    width: this.width,
    height: this.height,
    x: x,
    y: y
  });
  this.type = option.type;

  this.vx = 0;
  this.vy = 0;

  this.dying = false;
  this.base = [x, y];

  this.friction = .99;
  this.gravity = option.gravity;
  this.color = colors[Math.floor(Math.random() * colors.length)];

  this.setSpeed(util.randomInt(.1, .5));
  this.setHeading(util.randomInt(util.degreesToRads(0), util.degreesToRads(360)));
}

Particle.prototype = {
  getSpeed: function () {
    return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
  },

  setSpeed: function (speed) {
    var heading = this.getHeading();
    this.vx = Math.cos(heading) * speed;
    this.vy = Math.sin(heading) * speed;
  },

  getHeading: function () {
    return Math.atan2(this.vy, this.vx);
  },

  setHeading: function (heading) {
    var speed = this.getSpeed();
    this.vx = Math.cos(heading) * speed;
    this.vy = Math.sin(heading) * speed;
  },
  
  resize: function(width, height){
    Container.prototype.resize.call(this);
    // @TODO adjust x, y
  },

  // @TODO: particle or the container should be rendered instead of have a render function
  update: function (context) {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.vx *= this.friction;
    this.vy *= this.friction;

    if (this.radius < this.width && this.dying === false) {
      this.radius += this.duration;
    } else {
      this.dying = true;
    }
    if (this.dying === true) {
      this.radius -= this.duration;
    }

    if (this.y < 0 || this.radius < 1) {
      this.x = this.base[0];
      this.y = this.base[1];
      this.dying = false;
      this.radius = 1.1;
      this.setSpeed(this.speed);
      this.width = util.randomInt(this.radius, this.radius + 3);
      this.setHeading(util.randomInt(0, 2 * Math.PI));
    }
    
    Container.prototype.update.call(this);
  }
};


var Graphics = function() {};
Graphics.drawCircle = function (context, x, y, color, radius) {
  context.save();
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, radius, Math.PI * 2, 0);
  context.closePath();
  context.fill();
  context.restore();
};

Graphics.drawRect = function (context, x, y, color, width, height) {
  height = height===void 0 ? width : height;
  context.save();
  context.fillStyle = color;
  context.beginPath();
  context.fillRect(x, y, width, height);
  context.closePath();
  context.fill();
  context.restore();
};

// @TODO multiple line. Text Wrap at \n and overflow
// function fillTextMultiLine(ctx, text, x, y) {
// var lineHeight = ctx.measureText("M").width * 1.2;
// var lines = text.split("\n");
// for (var i = 0; i < lines.length; ++i) {
//   ctx.fillText(lines[i], x, y);
//   y += lineHeight;
// }
// }

Graphics.fillText = function (context, text, width, height) {
  context.save();
  context.font = height + "px/1.4 arial";
  context.fillText(text, 0, height);
  context.restore();
};

Graphics.getImageDataBuffer32 = function (context) {
  console.log('getting imgDataBuffer32');
  var imgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);

  console.log('imgData:', imgData);
  return {
    buffer32: new Uint32Array(imgData.data.buffer),
    width: context.canvas.width,
    height: context.canvas.height
  };
};


function Renderer(canvas) {
  this.canvas = canvas;
  this.ctx = canvas.getContext('2d');
  this.resize(document.body.clientWidth, document.body.clientHeight);
}

Renderer.prototype = {
  render: function (container) {
    if(!container.needRender){
      return;
    }
    switch (container.type) {
      case 'circle':
        Graphics.drawCircle(this.ctx, container.x, container.y, container.color, container.radius);
        break;
      case 'rect':
        Graphics.drawRect(this.ctx, container.x, container.y, container.color, container.width, container.height);
        break;
      default:
        break;
    }
    
    container.children.forEach(function (child) {
      this.render(child);
    }.bind(this));
    
    container.needRender = false;
  },
  resize: function (width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    // @TODO resize container
  }
};


var colors = [
  '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
  '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
  '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
  '#FF5722'
];

var $message = util.$('#message');
$message.addEventListener('keyup', util.debounce(function () {
  renderer.ctx.clearRect(0, 0, renderer.canvas.width, renderer.canvas.height);
  stage.clearChildren();
  console.log('input changed to: ', this.value);
  var newImgBuffer32 = getTextImgBuffer32(this.value, true);
  console.log('newImgBuffer32', newImgBuffer32);
  stage.generate(newImgBuffer32);
}, 200));

var renderer = new Renderer(util.$('#canvas'));
// renderer.ctx.textAlign = "center";
var stage = new Stage();

var tmpCanvas = document.createElement('canvas');
var tmpCtx = tmpCanvas.getContext('2d');
document.body.appendChild(tmpCanvas);
function getTextImgBuffer32(text, render) {
  console.log('clear tmp canvas');
  tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
  if(render) Graphics.fillText(tmpCtx, text, 200, 80);
  console.log('getting imgDataBuffer32 in index.js');
  return Graphics.getImageDataBuffer32(tmpCtx);
}

// @TODO generate a caret inside particles, and i can edit it directly
stage.generate(getTextImgBuffer32($message.value, true));


(function drawFrame() {
  renderer.ctx.clearRect(0, 0, renderer.canvas.width, renderer.canvas.height);
  renderer.render(stage);
  stage.update();
  
  window.requestAnimationFrame(drawFrame);
}());

setTimeout(function backspace() {
  $message.value = $message.value.slice(0, -1);
  renderer.ctx.clearRect(0, 0, renderer.canvas.width, renderer.canvas.height);
  stage.clearChildren();
  var newImgBuffer32 = getTextImgBuffer32($message.value, true);
  stage.generate(newImgBuffer32);
  $message.value.length > 3 && setTimeout(function() {
    backspace();
  }, 1000)
}, 1000);


window.addEventListener('resize', util.debounce(function () {
  renderer.ctx.clearRect(0, 0, renderer.canvas.width, renderer.canvas.height);
  // don't use window.innerWidth and window.innerHeight here,
  // or it will leave a block of space below the canvas
  // while change orientation to landscape.(iOS 7)
  // You should set html, body {width: 100%;height: 100%;}
  // with document.body.clientWidth and document.body.clientHeight
  stage.resize(document.body.clientWidth, document.body.clientHeight);
  renderer.resize(document.body.clientWidth, document.body.clientHeight);
}, 400));
