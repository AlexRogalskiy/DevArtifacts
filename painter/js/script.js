(function() {
  
  /**
   * HORRIBLE hacked-together jQuery and globals,
   * because this was only ever supposed to be a bit of fun.
   * Please don't judge me. :)
  **/
  
  var C64_PAL = [
    '#000000',
    '#ffffff',
    '#882000',
    '#68d0a8',
    '#a838a0', 
    '#50b818', 
    '#181090',
    '#f0e858', 
    '#a04800', 
    '#472b1b',
    '#c87870', 
    '#484848',
    '#808080', 
    '#98ff98',
    '#5090d0',
    '#b8b8b8'
  ];
  
  var KEYS = {
    BRUSH_UP: 221,  // ]
    BRUSH_DOWN: 219,  // [
    TOOL_ERASER: 69,  // e
    TOOL_PENCIL: 66,   // b
    SHIFT: 16,   // shift
    CTRL: 17,   // ctrl
    UNDO: 90,   // z
    DITHER: 68 // d
  };
  var CTRL_PRESSED = false;
  var SHIFT_PRESSED = false;
  
  var mem = {};
  var c = function(x,y) { return 'x' + x + 'y' + y; }
  
  var selectedColor = '#ffffff',
      selectedTool = 'pencil';
  
  var els = {
    posX: $('#pos-x'),
    posY: $('#pos-y'),
    mini: $('#mini'),
    layerContainer: $('#layers ul'),
    selectedColor: $('#selected'),
    atCursorColor: $('#atcursor'),
    outLink: $('#outlink')
  };
  
  var c = {
    base: document.getElementById('base'),
    layers: {},
    palette: document.getElementById('pal'),
    cursors: document.getElementById('cursors'),
    miniComp: $('<canvas>', { 'id': 'miniComp' })[0]
  };
  
  var ctx = {
    base: c.base.getContext('2d'),
    layers: {},
    palette: c.palette.getContext('2d'),
    cursors: c.cursors.getContext('2d'),
    miniComp: c.miniComp.getContext('2d')
  };
  
  var layerTpl = $('#t-layer').html();
  
  var GRID_SIZE = 32,
      CELL_SIZE = 16,
      PAL_CELL_SIZE = Math.floor(c.palette.width / Math.sqrt(C64_PAL.length)),
      WRAP_PADDING = 20;
  
  var NUM_LAYERS = 5;
  
  var selectedLayer = 3;
  var layers = {};
  for(var i = 0; i < NUM_LAYERS; i++) {
    var tmp = layerTpl.replace(/LAYER_ID/g, i+1);
    els.layerContainer.append(tmp);
    var lid = 'layer'+(i+1);
    layers[lid] = {
      orderIdx: 0,
      visible: true,
      active: (i==0)
    }
    c.layers[lid] = $('<canvas>', { 'class': 'layerCanvas' })[0];
    ctx.layers[lid] = c.layers[lid].getContext('2d');
    c.layers[lid].width = c.layers[lid].height = GRID_SIZE * CELL_SIZE;
    $('#wrap').prepend(c.layers[lid]);
  }
  
  c.miniComp.height = c.miniComp.width = 32;

  var _moveLayer = function(id, dir) {
    var layer = layers['layer'+id];
    if(dir == 'up' && layer.orderIdx == 0) return false;
    if(dir == 'down' && layer.orderIdx == NUM_LAYERS - 1) return false;            
    
  }
  
  var _orderLayerZ = function() {
    for(var k in layers) {
      c.layers[k].style.zIndex = 1000 + layers[k].orderIdx * 50;
    }
  }
  
  var _selectLayer = function(id) {
    var lid = 'layer'+(id);
    layers['layer'+selectedLayer].active = false;
    selectedLayer = id;
    layers['layer'+selectedLayer].active = true;
    els.layerContainer.find('li').removeClass('active');
    els.layerContainer.find('[data-layer="' + id + '"]').addClass('active');
  }
  
  var _toggleLayer = function(id) {
    var lid = 'layer'+(id);
    layers[lid].visible = !layers[lid].visible;
    $(c.layers[lid]).css('display', (layers[lid].visible) ? 'block' : 'none');
    els.layerContainer.find('[data-layer="' + id + '"]').toggleClass('hidden', !(layers[lid].visible));
  }
  
  _selectLayer(3);
  //_orderLayerZ();
  
  var UNDO_MEM = [];
  var MAX_UNDO = 10;
  
  var _saveLayerState = function(layerId) {
    var state = {
      layer: layerId,
      data: c.layers[layerId].toDataURL("image/png")
    };
    if(UNDO_MEM.length > MAX_UNDO) UNDO_MEM.shift();
    UNDO_MEM.push(state);
    console.log('state saved', state);
  };
  var _applyUndo = function() {
    if(UNDO_MEM.length < 1) return;
    var state = UNDO_MEM.pop();
    console.log('restore state', state);
    
    
    var uImg = new Image();
    uImg.onload = function() {
      c.layers[state.layer].width = c.layers[state.layer].height;
      ctx.layers[state.layer].drawImage(uImg, 0 ,0);
    }
    uImg.src = state.data;
    
  };
  
  var mains = ['base','cursors'];
  for(var i = 0; i < mains.length; i++) {
    var cv = c[mains[i]];
    cv.width = cv.height = GRID_SIZE * CELL_SIZE;
  }
  $('#help-wrap').css({
    width: GRID_SIZE * CELL_SIZE,
    height: GRID_SIZE * CELL_SIZE
  });
  var wrap = $('#wrap');
  wrap.css({
    width: WRAP_PADDING + $('#droplets').width() + WRAP_PADDING + c.base.width + WRAP_PADDING + c.palette.width + WRAP_PADDING,
    height: WRAP_PADDING + c.base.height + WRAP_PADDING
  });
  
  var _drawPal = function(colors) {
    var cw = c.palette.width / PAL_CELL_SIZE;
    for(var i = 0; i < colors.length; i++) {
      var x = i % cw, y = Math.floor(i / cw);
      ctx.palette.fillStyle = colors[i];
      ctx.palette.fillRect(x * PAL_CELL_SIZE, y * PAL_CELL_SIZE, PAL_CELL_SIZE, PAL_CELL_SIZE);
      
    }
  }
  
  var _getCanvasColorAllLayers = function(px, py) {
    var c = false;
    for(var i = 0; i < NUM_LAYERS; i++) {
      c = ctx.layers['layer' + (i+1)].getImageData(px, py, 1, 1).data;
      if(c[3] !== 0) {
        c = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
        break;
      }
    }
    return c;
  };
  
  var _getColorAtPixel = function(px, py, targ) {
    targ = targ || ctx.layers['layer' + selectedLayer];
    var c = targ.getImageData(px, py, 1, 1).data;
    return 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
  }
  
  var DITHER_ON = false;
  
  var _drawCell = function(x, y, color, targ, cursorSize) {
    targ = targ || ctx.layers['layer' + selectedLayer];
    cursorSize = cursorSize || 1;
    targ.fillStyle = color;
    var x = x - Math.floor(cursorSize / 2),
        y = y - Math.floor(cursorSize / 2);
    if(!DITHER_ON) {
      targ.fillRect(x*CELL_SIZE, y*CELL_SIZE, CELL_SIZE * cursorSize, CELL_SIZE * cursorSize);
    } else {
      
      var ditherIdx;
      
      for(var cy = y; cy < y + cursorSize; cy++) {
        for(var cx = x; cx < x + cursorSize; cx++) {
          
          ditherIdx = (cx % 2);
          if(SHIFT_PRESSED) ditherIdx = 1-ditherIdx;
          if (cy % 2) ditherIdx = 1-ditherIdx;
          if(ditherIdx) targ.fillRect(cx*CELL_SIZE, cy*CELL_SIZE, CELL_SIZE, CELL_SIZE);
          
        }
      }
    }
  }
  
  var _clearCell = function(x,y, cursorSize) {
    cursorSize = cursorSize || 1;
    var x = x - Math.floor(cursorSize / 2),
        y = y - Math.floor(cursorSize / 2);
    ctx.layers['layer' + selectedLayer].clearRect(x*CELL_SIZE, y*CELL_SIZE, CELL_SIZE * cursorSize, CELL_SIZE * cursorSize);
  }
  
  var clearColors = ['#111','#011'];
  var clearColIdx;
  
  var _drawBase = function() {
    var numCells = GRID_SIZE * GRID_SIZE;
    for(var i = 0; i < numCells; i++) {     
      var x = i % GRID_SIZE, y = Math.floor(i / GRID_SIZE);
      if (x == 0) clearColIdx = (y % 2) ? 0 : 1;
      _drawCell(x, y, clearColors[clearColIdx], ctx.base);
      clearColIdx = 1-clearColIdx;
    }
  };
  
  var _drawCustomPal = function(id) {
    console.log('draw custom pal', id);
    ctx.palette.drawImage($('#' + id + '-pal')[0], 0, 0, c.palette.width, c.palette.height);
  };
  
  var cursorSize = 1;
  var cursorColor = '#ff0099';
  var cursorX = -10, cursorY = -10;
  var _drawCursor = function() {
    requestAnimationFrame(_drawCursor);
    c.cursors.width = c.cursors.height;
    if(!CTRL_PRESSED) {
      ctx.cursors.strokeStyle = cursorColor;
      var x = cursorX - Math.floor(cursorSize / 2),
          y = cursorY - Math.floor(cursorSize / 2);
      ctx.cursors.strokeRect(x*CELL_SIZE, y*CELL_SIZE, CELL_SIZE * cursorSize, CELL_SIZE * cursorSize);
    }
  };
  //setInterval(function() {
  //  cursorColor = (cursorColor == '#000000') ? '#ffffff' : '#000000';
  //}, 50);
  _drawCursor();
  
  var _drawToolCell = function(x,y) {
    switch(selectedTool) {
      case 'eraser':
        _clearCell(x,y,cursorSize);
        break;
      case 'pencil':
      default:
        _drawCell(x, y, selectedColor, ctx.doodle, cursorSize);
    }
  };
  
  var _getCellAtPixel = function(px, py) {
    return { x: Math.floor(px /CELL_SIZE), y: Math.floor(py/CELL_SIZE)};
  };
  
  var _renderMini = function() {
    var order = [];
    for(var l in layers) {
      order.push([l, layers[l].orderIdx]);
    }
    order.sort(function(a,b) { return a[1] - b[1] });
    order.reverse();
    c.miniComp.width = c.miniComp.height;
    for(var i = 0; i < order.length; i++) {
      var cvId = order[i][0];
      //var cimg = ctx.layers[cvId].getImageData(0,0,c.layers[cvId].width, c.layers[cvId].height);
      if(layers[cvId].visible) ctx.miniComp.drawImage(c.layers[cvId],0,0, c.miniComp.width, c.miniComp.height);
    }
    var dat = c.miniComp.toDataURL("image/png");
    els.mini.attr('src', dat);
    els.outLink.attr('href', dat);
  };
 
  var drawing = false;
  
  $('#cursors').on('mousemove', function(e) {
    var xpos, ypos;
    if(e.offsetX==undefined) // this works for Firefox
    {
      xpos = e.pageX-$(this).offset().left;
      ypos = e.pageY-$(this).offset().top;
    }             
    else                     // works in Google Chrome
    {
      xpos = e.offsetX;
      ypos = e.offsetY;
    }
    var pos = _getCellAtPixel(xpos, ypos);

    if(CTRL_PRESSED) {
      var pc = _getCanvasColorAllLayers(xpos, ypos);
      if(pc) {
        els.atCursorColor.css('background-color', pc);
      }
    } else {
      
      if(drawing) _drawToolCell(pos.x,pos.y);
    }
    els.posX.html(pos.x);
    els.posY.html(pos.y);
    cursorX = pos.x;
    cursorY = pos.y;
  });
  
  $('#cursors').on('mouseout', function() {
    els.posX.html('');
    els.posY.html('');
    cursorX = -10;
    cursorY = -10;
    
  })
  
  $('#cursors').on('mousedown', function(e) {
    var xpos, ypos;
    if(e.offsetX==undefined) // this works for Firefox
    {
      xpos = e.pageX-$(this).offset().left;
      ypos = e.pageY-$(this).offset().top;
    }             
    else                     // works in Google Chrome
    {
      xpos = e.offsetX;
      ypos = e.offsetY;
    }
    
    if(CTRL_PRESSED) {
      var pc = _getCanvasColorAllLayers(xpos, ypos);
      if(pc) {
        selectedColor = pc;
        els.selectedColor.css('background-color', selectedColor);
      }
    } else {
      var pos = _getCellAtPixel(xpos, ypos);
      _saveLayerState('layer' + selectedLayer);
      _drawToolCell(pos.x,pos.y);
      drawing = true;
    }
  });
  $(document).on('mouseup', function() {
    drawing = false;
  });
  
  $('#pal').on('mousedown', function(e) {
    var xpos, ypos;
    if(e.offsetX==undefined) // this works for Firefox
    {
      xpos = e.pageX-$(this).offset().left;
      ypos = e.pageY-$(this).offset().top;
    }             
    else                     // works in Google Chrome
    {
      xpos = e.offsetX;
      ypos = e.offsetY;
    }
    selectedColor = _getColorAtPixel(xpos, ypos, ctx.palette);
    els.selectedColor.css('background-color', selectedColor);
  });
  
   $('#pal').on('mousemove', function(e) {
     var xpos, ypos;
    if(e.offsetX==undefined) // this works for Firefox
    {
      xpos = e.pageX-$(this).offset().left;
      ypos = e.pageY-$(this).offset().top;
    }             
    else                     // works in Google Chrome
    {
      xpos = e.offsetX;
      ypos = e.offsetY;
    }
    els.atCursorColor.css('background-color', _getColorAtPixel(xpos, ypos, ctx.palette));
  });
  
  var _selectTool = function(toolId) {
    $('#tools button').removeClass('active');
    $('#tools').find('button[data-tool="' + toolId + '"]').addClass('active');
    selectedTool = toolId;
  };
  
  $('#pal').on('mouseout', function(e) {
    els.atCursorColor.css('background-color', selectedColor);
  });
  
  $('#tools button').on('click', function(e) {
    _selectTool($(this).data('tool'));
  });
  
  var _adjustBrush = function(brushAdj) {
    cursorSize = (brushAdj == 'up') ? Math.min(cursorSize + 1, 6) : Math.max(cursorSize - 1, 1);
  }
  
  $('#brush button').on('click', function(e) {
    var brushAdj = $(this).data('brush');
    _adjustBrush(brushAdj);
  });
  
  $('#layers li').on('click', function(e) {
    e.stopPropagation();
    var lid = $(this).closest('li').data('layer');
    _selectLayer(lid);
  });
  
  $('#layers li').find('.layer-toggle').on('click', function(e) {
    e.stopPropagation();
    var lid = $(this).closest('li').data('layer');
    _toggleLayer(lid);
  });
  
  $('#layers li').find('.layer-up').on('click', function(e) {
    e.stopPropagation();
    var lid = $(this).closest('li').data('layer');
    _moveLayer(lid, 'up');
  });
  
  $('#layers li').find('.layer-down').on('click', function(e) {
    e.stopPropagation();
    var lid = $(this).closest('li').data('layer');
    _moveLayer(lid, 'down');
  });
  
  $('#pal-select a').on('click', function(e) {
    e.preventDefault();
    switch($(this).data('pal')) {
      case 'c64':
        _drawPal(C64_PAL);
        break;
      case 'doom':
        _drawCustomPal('doom');
        break;
      case 'truecol':
        _drawCustomPal('true');
        break;
      default:
        break;
    }
  });
  
  $('#import').on('click', function(e) {
    var dat = prompt('Enter a base64-encoded image string to import:');
    if(dat == null) return false;
    
    var impc = document.createElement('canvas');
    var impctx = impc.getContext('2d');
    impc.width = impc.height = 32;
    var impImg = new Image;
    impImg.src = 'data:image/png;base64,' + dat;
    console.log('image import', impImg);
    impImg.onload = function() {
          impctx.drawImage(impImg, 0, 0);
    
          var impdat = impctx.getImageData(0,0,32,32);
          //console.log(impdat);
          for(var y = 0; y < 32; y++) {
            for(var x = 0; x < 32; x++) {
              var i = (y * (32 * 4)) + (x * 4);
              
              var col = 'rgba(' + impdat.data[i] + ',' + impdat.data[i+1] + ',' + impdat.data[i+2] + ',' + impdat.data[i+3] + ')';
              //console.log(x, y, col);
              _drawCell(x, y, col);
              
            }
          }   
    }

    
  });
  
  var _persistSlots = function() {
    if(!('localStorage' in window)) return false;
    
    var slots = [];
    $('#droplets span').each(function() {
      slots.push($(this).css('background-color'));
    });
    var str = slots.join('|');
    window.localStorage['PCP32x32_slots'] = str;
    
  };
  
  var _retrieveSlots = function() {
    if(!('localStorage' in window)) return false;
    if(! ('PCP32x32_slots' in window.localStorage)) return false;
    
    var slotStr = window.localStorage['PCP32x32_slots'];
    var slots = slotStr.split('|');
    console.log('slots recovered', slots);
     $('#droplets span').each(function(idx) {
      $(this).css('background-color', slots[idx]);
    });
  }
  
  $('#undo').on('click', function(e) {
    e.preventDefault();
    _applyUndo();
  });
  
  $('#mini').on('click', function() {
    //window.open($(this).attr('src'));
  });
  
  $(window).on('keydown', function(e) {
    var key = e.which;
    if(key == KEYS.CTRL) {
      CTRL_PRESSED = true;
      $('#cursors').addClass('sampling'); 
    }
    if(key == KEYS.SHIFT) SHIFT_PRESSED = true;
    if(key == KEYS.DITHER) DITHER_ON = true;
  });
  $(window).on('keyup', function(e) {
    var key = e.which;
    console.log('key', key);
    
    switch(key) {
      case KEYS.CTRL:
        CTRL_PRESSED = false;
        $('#cursors').removeClass('sampling');
        els.atCursorColor.css('background-color', selectedColor);
        break;
      case KEYS.SHIFT:
        SHIFT_PRESSED = false;
        break;
      case KEYS.BRUSH_UP:
        _adjustBrush('up');
        break;
      case KEYS.BRUSH_DOWN:
        _adjustBrush('down');
        break;
      case KEYS.TOOL_PENCIL:
        _selectTool('pencil');
        break;
      case KEYS.TOOL_ERASER:
        _selectTool('eraser');
        break;
      case KEYS.UNDO:
        if(CTRL_PRESSED) _applyUndo();
        break;
      case KEYS.DITHER:
        DITHER_ON = false;
        break;
      default:
        if((key >= 48 && key <= 57) || (key >= 96 && key <= 105)) {
            var slot = (key >= 48 && key <= 57) ? key - 48 : key - 96;
            console.log('num key pressed', slot);
            if(SHIFT_PRESSED) {
              $('#droplets span').eq(slot).css('background-color', selectedColor);
              _persistSlots();
            } else {
              selectedColor = $('#droplets span').eq(slot).css('background-color');
              els.selectedColor.css('background-color', selectedColor);
              els.atCursorColor.css('background-color', selectedColor);
            }
        }
        break;
    }
    
    
  });
  
  //_drawPal(C64_PAL);
  _drawCustomPal('doom');
  _drawBase();
  
  for(var i = 0; i < 10; i++) {
    var sp = $('<span>' + i + '</span>');
    sp.data('slot', i);
    sp.height((c.base.height / 10) - 1);
    sp.attr('title', 'Preset colors (click to select, shift-click to set) (0-9)');
    $('#droplets').append(sp);
  }
  
  _retrieveSlots();
  
  $('#droplets span').on('mouseover', function() {
    
    var col = $(this).css('background-color');
    els.atCursorColor.css('background-color', col);
    
  }).on('mouseout', function() {
    
    els.atCursorColor.css('background-color', selectedColor);
    
  }).on('click', function() {
    
    if(SHIFT_PRESSED) {
      $(this).css('background-color', selectedColor);
      _persistSlots();
    } else {
      selectedColor = $(this).css('background-color');
      els.selectedColor.css('background-color', selectedColor);
    }
    
  });
  $(window).on('beforeunload', function() {
    return 'Unless you have saved your image, all your work will be lost!';
  });
  
  $('#help-but').on('click', function() {
    $('#help-wrap').toggle();
  });
  
  setInterval(function() {
    _renderMini();
  }, 1000);
  
  DITHER_ON = false;
  
})();