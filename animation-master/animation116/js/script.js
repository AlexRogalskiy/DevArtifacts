console.clear();

if (typeof Array.isArray === 'undefined') {
  Array.isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }
}

function getRnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 
 * Components that we can apply to Entities.
 * Do nothing by themselves - Systems use them to
 * provide behaviour and functionality.
 * TODO: come up with something nicer than no-ops
 * for components without params
 **/
var Components = {
  
  AttractToMouse: null,
  AutoRotate: function(speed) {
    this.rot = 0;
    this.rotSpeed = speed || 1;
  },
  Color: function(color) {
    this.color = color || 'white';
  },
  ColorFlash: function(flashColor, flashSpeed) {
    this.flashColor = flashColor || 'red';
    this.flashSpeed = flashSpeed || 300;
    this._flashTimer = Date.now();
    this._flashToggle = false;
  },
  ControlsWASD: function(moveSpeed) {
    this.moveSpeed = moveSpeed || 3;
  },
  Ghost: null,
  Gravity: null,
  Position: function(pos) {
    this.x = pos.x || 0;
    this.y = pos.y || 0;
  },
  Rendering: null,
  ShapeCircle: null,
  ShapeTriangle: null,
  Size: function(size) {
    this.size = size || 50;
    this._hsize = (size * 0.5) >> 0;
  },
  StageBounce: function(damping) {
    this.damping = damping || 0;
  },
  StageConstrain: null,
  StageWrap: null,
  Velocity: function(vels) {
    this.vx = (vels === undefined) ? 0 : vels.vx;
    this.vy = (vels === undefined) ? 0 : vels.vy;
    this.vmax = (vels === undefined) ? 10 : vels.max;
  }
  
};



/** 
 * Module to create an Entity 
 **/
var EntityFactory = (function() {
  
  var entityCount = 0,
      entities = [],
      ComponentCollection = {};
  
  var Entity = function() {
    this.uid = Date.now() + Math.floor(Math.random() * 100000) + '_' + entityCount;
    this._components = [];
  };
  
  Entity.prototype = {
    addComponent: function(componentId, params) {
      this._components[componentId] = params;
      if(typeof ComponentCollection[componentId] === 'function') {
      	 ComponentCollection[componentId].call(this, params);
      }
    },
    removeComponent: function(componentId) {
      if(this._components.hasOwnProperty(componentId)) {
        this._components[componentId] = undefined;
        delete this._components[componentId];
      }
    },
    has: function(componentId) {
      return this._components.hasOwnProperty(componentId);
    }
  };
  
  function createEntity(componentList) {
    var entity = new Entity(componentList);
    entities.push(entity);
    entityCount = entities.length;
    return entity;
  }
  
  function getEntities() {
    return entities;
  }
    
  function initComponents(components) {
    ComponentCollection = components;
  }
  
  return {
    create: createEntity,
    getAll: getEntities,
    initComponents: initComponents
  }
  
})();



/**
 * System for entity motion (velocity, gravity, bouncing etc).
 **/
var MotionSystem = (function() {

  var GRAVITY = 0.08,
      stageSize;
  
  function init(config) {
    stageSize = config.stageSize;
  }
  
  function update(ents) {
    if (!ents) return;
    
    ents.forEach(function(entity) {
      
      if(!entity.has('Position') &&
         !entity.has('Velocity')) return;
      
      // subtract gravity
      if(entity.has('Gravity')) entity.vy += GRAVITY;
      
      // check for edge collision
      var cleft = false,
          cright = false,
          ctop = false,
          cbottom = false;
      
      var min = (entity.has('Size')) ? entity._hsize : 0,
          max = (entity.has('Size')) ? stageSize - entity._hsize : stageSize;

      if(entity.x < min) cleft = true;
      if(entity.x > max) cright = true;
      if(entity.y < min) ctop = true;
      if(entity.y > max) cbottom = true;
      
      if(entity.has('StageConstrain')) {
        // keep inside edges
        if(cleft) entity.x = min;
        if(cright) entity.x = max;
        if(ctop) entity.y = min;
        if(cbottom) entity.y = max;

        // bounce with damping
        if(entity.has('StageBounce')) {
          if(cleft || cright) {
            entity.vx = -entity.vx;
            entity.vx *= 1 - entity.damping;
          }
          if(ctop || cbottom) {
            entity.vy = -entity.vy;
            entity.vy *= 1 - entity.damping;
          }
        }
      }
      
      // Wrap-around
      if(entity.has('StageWrap')) {
        if(cleft) entity.x = max;
        if(cright) entity.x = min;
        if(ctop) entity.y = max;
        if(cbottom) entity.y = min;
      }
      
      // reposition based on velocity
      if(entity.has('Velocity')) {
        entity.x = Math.round(entity.x + entity.vx);
        entity.y = Math.round(entity.y + entity.vy);
      }
      
      // rotation update {
      if(entity.has('AutoRotate')) {
        entity.rot += entity.rotSpeed;
      }
  
    });
  }
  
  
  return {
    init: init,
    update: update
  }
  
})();


/**
 * System for entities interacting with the mouse.
 **/
var MouseSystem = (function($) {
  
  var ATTRACT_RADIUS = 200,
      ATTRACT_STRENGTH = 0.6,
      cfg,
      isOn = false,
      mouse = { x: 0, y: 0 },
      _ents;
  
  function getDist(p1, p2) {
    return Math.sqrt(((p2.x - p1.x) * (p2.x - p1.x)) + ((p2.y - p1.y) * (p2.y - p1.y)));
  }
  
  function init(config) {
    cfg = config;
    // TODO: come up with a way to share canvas etc between systems
    $('canvas').on('mouseover mousemove', function(e) { _updateMousePos(e); });
    $('canvas').on('mouseout', _disableMousePos);
    $('canvas').on('click', _explode);
  }
  
  function _updateMousePos(e) {
    isOn = true;
    var isFF = (e.offsetX === undefined);
    mouse.x = (isFF) ? e.pageX-$(this).offset().left : e.offsetX;
    mouse.y = (isFF) ? e.pageY-$(this).offset().top : e.offsetY;
  }
  
  function _disableMousePos() {
    isOn = false;
  }
  
  function _explode() {
    _ents.forEach(function(entity) {
      if (!entity.has('Velocity')) return;
    	entity.vx = getRnd(-5, 5);
      entity.vy = getRnd(-4, -8);
    });
  }
  
  function update(ents) {
    if(!isOn) return;
    
    _ents = ents;
    
    ents.forEach(function(entity) {
      if(!entity.has('AttractToMouse') ||
         !entity.has('Velocity') ||
         !entity.has('Position')) return;
      
      var dist = getDist(mouse, entity);
      if(dist > ATTRACT_RADIUS) return;
      
      entity.vx += (entity.x > mouse.x) ? -ATTRACT_STRENGTH : ATTRACT_STRENGTH;
      entity.vy += (entity.y > mouse.y) ? -ATTRACT_STRENGTH : ATTRACT_STRENGTH;
    });
  }
  
  return {
    init: init,
    update: update
  }
  
})($);
  

/**
 * System to handle key-controlled entities
 **/
var ControlsSystem = (function($) {
  
  var KEY_CODES = {
    W: 87,
    A: 65,
    S: 83,
    D: 68
  };
  var KEYS = [];
     
  function init(options) {
    for(var i = 0; i < 128; i++) {
      KEYS[i] = { isPressed: false }
    };
    
    $(document).on('keydown', function(e) {
      KEYS[e.which].isPressed = true;
    });
    $(document).on('keyup', function(e) {
      KEYS[e.which].isPressed = false;
    });
  }
  
  function isPressed(keyCode) {
    return KEYS[KEY_CODES[keyCode]].isPressed;
  }
  
  function update(ents) {

    ents.forEach(function(entity) {
      if(!entity.has('ControlsWASD') || !entity.has('Position')) return;
      
      if(isPressed('W')) entity.y -= entity.moveSpeed;
      if(isPressed('S')) entity.y += entity.moveSpeed;
      if(isPressed('A')) entity.x -= entity.moveSpeed;
      if(isPressed('D')) entity.x += entity.moveSpeed;
      
    });
  }
  
  return {
    init: init,
    update: update
  }
  
})($);

/**
 * System for Canvas rendering of entities.
 **/
var RenderSystem = (function() {
  
  var c, ctx, bufferc, bufferctx, hsize, cfg;
  
  function init(config) {
    cfg = config;
    
    c = document.createElement('canvas');
    ctx = c.getContext('2d');
    
    bufferc = document.createElement('canvas');
    bufferctx = bufferc.getContext('2d');
    
    c.width = c.height = 
      bufferc.width = bufferc.height = cfg.stageSize;
    hsize = Math.floor(cfg.stageSize * 0.5);
    
    var b = document.body || document.documentElement;
    b.appendChild(c);

  }
  
  function toRad(angle) {
    return angle * Math.PI / 180;
  }
  
  function update(ents) {
    bufferctx.clearRect(0, 0, cfg.stageSize, cfg.stageSize);
    ctx.clearRect(0, 0, cfg.stageSize, cfg.stageSize);

    var now = Date.now();
    
    ents.forEach(function(entity) {
      if(! entity.has('Rendering') && 
         ! entity.has('Position') &&
         ! entity.has('Size')) return;
      
      // Use color, handle flashing
      var col = (entity.has('Color')) ? entity.color : '#ffffff';
      if(entity.has('ColorFlash')) {
         col = (entity._toggleFlash) ? entity.flashColor : col;
        if(now - entity._flashTimer > entity.flashSpeed) {
        	entity._toggleFlash = !entity._toggleFlash;
        	entity._flashTimer = now;
        }
      }
      bufferctx.fillStyle = col;
      
      // Rotate
      var needsRestore = false;
      if(entity.has('AutoRotate')) {
        bufferctx.save();
        bufferctx.translate(entity.x, entity.y);
        bufferctx.rotate(toRad(entity.rot));
        bufferctx.translate(-entity.x, -entity.y);
        needsRestore = true;
      }
      
      // Draw circle or rect
      var drawFn;
      
      if(entity.has('ShapeCircle')) {
        drawFn = function(context) {
          context.beginPath();
          context.arc(entity.x >> 0, entity.y >> 0, 
                      entity._hsize >> 0, 0, 2 * Math.PI, false);
          context.fill();
        }
      } else if(entity.has('ShapeTriangle')) {
        drawFn = function(context) {
          context.beginPath();
          context.moveTo((entity.x - entity._hsize) >> 0, 
                         (entity.y + entity._hsize) >> 0);
          context.lineTo(entity.x >> 0, (entity.y - entity._hsize >> 0));
          context.lineTo((entity.x + entity._hsize) >> 0, 
                         (entity.y + entity._hsize) >> 0);
          context.fill();
        }
      }else {
        drawFn = function(context) {
          context.fillRect((entity.x - entity._hsize) >> 0, 
                           (entity.y - entity._hsize) >> 0, 
                           entity.size >> 0, entity.size >> 0);
        }
      }
      
      // Reduce alpha if ghost
      if(entity.has('Ghost')) bufferctx.globalAlpha = 0.6;
      
      drawFn(bufferctx);
      
      if(entity.has('Ghost')) bufferctx.globalAlpha = 1;
      
      if(needsRestore) bufferctx.restore();
    });
    ctx.drawImage(bufferc, 0, 0);
  }
  
  return {
    init: init,
    update: update
  }
  
})();


/**
 * Test code
 **/
(function() {
  
  var config = {
    stageSize: 600
  };

  function createThingy() {
    var thingy = EntityFactory.create();

    var isCircle = !!getRnd(0,1),
        isTriangle = !isCircle && !!getRnd(0,1),
        hasRotation = !isCircle && !!getRnd(0,1),
        rotateSpeed = getRnd(-2, 2),
        color = '#'+Math.floor(Math.random()*16777215).toString(16),
        size = getRnd(10, 50),
        x = getRnd(200, 400),
        y = getRnd(200, 400),
        vx = getRnd(-4, 4),
        vy = getRnd(-6, -3),
        hasGravity = !!getRnd(0,2),
        isGhost = !!getRnd(0,1),
        isAttracted = !!getRnd(0,2);

    if (isCircle) thingy.addComponent('ShapeCircle');
    if (isTriangle) thingy.addComponent('ShapeTriangle');
    if (hasRotation) thingy.addComponent('AutoRotate', rotateSpeed);
    if (isGhost) thingy.addComponent('Ghost');
    if (hasGravity) thingy.addComponent('Gravity');
    if (isAttracted) thingy.addComponent('AttractToMouse');

    thingy.addComponent('Color', color);
    thingy.addComponent('Size', size);
    thingy.addComponent('Position', { x: x, y: y });
    thingy.addComponent('Velocity', { vx: vx, vy: vy });
    thingy.addComponent('StageConstrain');
    thingy.addComponent('StageBounce', 0.2);
    thingy.addComponent('Rendering');

    return thingy;
  }

  function createShip() {
    var ship = EntityFactory.create();
    ship.addComponent('ShapeTriangle');
    ship.addComponent('Color', 'white');
    ship.addComponent('ColorFlash', '#ff00cc');
    ship.addComponent('Size', 30);
    ship.addComponent('Position', { x: 300, y: 300 });
    ship.addComponent('StageWrap');
    ship.addComponent('ControlsWASD');
    ship.addComponent('Rendering');
    return ship;
  }


  var entities, ship;
  
  function init() {
    EntityFactory.initComponents(Components);
    
    var NUM_THINGS = 40;
    for(var i = 0; i < NUM_THINGS; i++) {
      createThingy();
    }
    entities = EntityFactory.getAll();
    ship = [createShip()];

    MotionSystem.init(config);
    RenderSystem.init(config);
    MouseSystem.init(config);
    ControlsSystem.init(config);
  }

  function update() {
    MouseSystem.update(entities);
    ControlsSystem.update(ship);
    MotionSystem.update(entities);
  }

  function render() {
    RenderSystem.update(entities);
  }

  function loop() {
    requestAnimationFrame(loop);
    update();
    render();
  }

  init();
  loop();

  var blurb = $('<p class="blurb"></p>');
  blurb.html('Components:<br/>' + Object.keys(Components).join(', '));
  $('body').append(blurb);

})();
