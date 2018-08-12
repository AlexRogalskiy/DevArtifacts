var canvas=document.getElementById('myCanvas');

var draw = function () {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
   
    view.things.forEach(function (thing) {
        var ctx=canvas.getContext('2d');
        ctx.fillStyle=thing.color;
        ctx.fillRect(thing.x, thing.y, thing.w, thing.h);
    });
}

thing = {
    x: 20,
    y: 20,
    dx: 0,
    dy: 0,
    w: 10,
    h: 10,
    color: '#FF0000'
};

var view = {
    things: [thing]
}

var s = 2;

setInterval(function () {
  if (keys.left && !keys.right) {
      thing.dx -= s;
  } else if (keys.right && !keys.left) {
      thing.dx += s;
  }
  
  if (keys.up && !keys.down) {
      thing.dy -= s;
  } else if (keys.down && !keys.up) {
      thing.dy += s;
  }
  
  thing.x += thing.dx;
  thing.y += thing.dy;
  
  if (thing.x < 0) {
    thing.x = -thing.x;
    thing.dx *= -1;
  } else if (thing.x > canvas.width - thing.w) {
    thing.x = (canvas.width - thing.w) - thing.x % (canvas.width - thing.w);
    thing.dx *= -1;
  }
  
  if (thing.y < 0) {
    thing.y = -thing.y;
    thing.dy *= -1;
  } else if (thing.y > canvas.height - thing.h) {
    thing.y = (canvas.height - thing.h) - thing.y % (canvas.height - thing.h);
    thing.dy *= -1;
  }
  
  var f = 1;
  if (thing.dx >= f) {
    thing.dx -= f;
  } else if (thing.dx <= -f) {
     thing.dx += f;
  }
  
  if (thing.dy >= f) {
    thing.dy -= f;
  } else if (thing.dy <= -f) {
     thing.dy += f;
  }
  
  
  draw();
}, 1000/30); // 30 fps


var keys = {
  left: false,
  up: false,
  right: false,
  down: false
}

$(document).bind('keydown', function (event) {
    switch (event.keyCode) {
        case 37:
            keys.left = true;
            return false;
            break;
        case 38:
            keys.up = true;
            return false;
            break;
        case 39:
            keys.right = true;
            return false;
            break;
        case 40:
            keys.down = true;
            return false;
            break;
    }
});

$(document).bind('keyup', function (event) {
    switch (event.keyCode) {
        case 37:
            keys.left = false;
            return false;
            break;
        case 38:
            keys.up = false;
            return false;
            break;
        case 39:
            keys.right = false;
            return false;
            break;
        case 40:
            keys.down = false;
            return false;
            break;
    }
});
