(function() {
  this.__canvases = [];
  fabric.Object.prototype.transparentCorners = false;
  var canvas2 = new fabric.Canvas('c1');
  canvas2.add(new fabric.Rect({ width: 50, height: 50, fill: 'red', top: 100, left: 100 }));
  canvas2.add(new fabric.Rect({ width: 30, height: 30, fill: 'green', top: 50, left: 50 }));
  canvas2.add(new fabric.Circle({ radius: 20, fill: 'blue', top: 160, left: 140 }));

  var log2 = document.getElementById('log1');

  function log(message, opt, color) {
    if ((message === 'mouse:move' || message === 'mousemove' || message === 'mouse:move:before' || message === 'mousemove:before') && !document.getElementById('move').checked) {
      return;
    }
    if ((message === 'dragover') && !document.getElementById('dragover').checked) {
      return;
    }
    var el = document.createElement('p');
    if (color) {
      el.style.color = color;
    }
    el.appendChild(document.createTextNode(message + ' ' + JSON.stringify(opt)));
    log2.insertBefore(el, log2.firstChild);
    var children = log2.children;
    while (children[100]) {
      var child = children[100];
      log2.removeChild(child);
    }
  }
  function logObservingEvent(eventName) {
    var el = document.getElementById('observing-events-log');
    var para = document.createElement('p');
    para.appendChild(document.createTextNode(eventName));
    el.appendChild(para);
  }

  function logObservingEventObj(eventName) {
    var el = document.getElementById('observing-events-log-obj');
    var para = document.createElement('p');
    para.appendChild(document.createTextNode(eventName));
    el.appendChild(para);
  }

  function addSeparator(id) {
    document.getElementById(id).appendChild(document.createElement('br'));
  }

  function observe(eventName) {
    logObservingEvent(eventName);
    canvas2.on(eventName, function(opt){ log(eventName, opt) });
  }

  function observeObj(eventName) {
    logObservingEventObj(eventName);
    canvas2.getObjects().forEach(function(o) {
      o.on(eventName, function(opt){ log(eventName, opt, o.fill) });
    });
  }

  observe('object:modified');
  addSeparator('observing-events-log');

  observe('object:moving');
  observe('object:scaling');
  observe('object:rotating');
  observe('object:skewing');
  observe('object:moved');
  observe('object:scaled');
  observe('object:rotated');
  observe('object:skewed');
  addSeparator('observing-events-log');

  observe('before:transform');
  observe('before:selection:cleared');
  observe('selection:cleared');
  observe('selection:created');
  observe('selection:updated');
  addSeparator('observing-events-log');

  observe('mouse:up');
  observe('mouse:down');
  observe('mouse:move');
  observe('mouse:up:before');
  observe('mouse:down:before');
  observe('mouse:move:before');
  observe('mouse:dblclick');
  observe('mouse:wheel');
  observe('mouse:over');
  observe('mouse:out');
  addSeparator('observing-events-log');

  observe('drop');
  observe('dragover');
  observe('dragenter');
  observe('dragleave');
  addSeparator('observing-events-log');

  observe('after:render');
  addSeparator('observing-events-log');

  observeObj('moving');
  observeObj('scaling');
  observeObj('rotating');
  observeObj('skewing');
  observeObj('moved');
  observeObj('scaled');
  observeObj('rotated');
  observeObj('skewed');
  addSeparator('observing-events-log-obj');

  observeObj('mouseup');
  observeObj('mousedown');
  observeObj('mousemove');
  observeObj('mouseup:before');
  observeObj('mousedown:before');
  observeObj('mousemove:before');
  observeObj('mousedblclick');
  observeObj('mousewheel');
  observeObj('mouseover');
  observeObj('mouseout');
  addSeparator('observing-events-log-obj');

  observeObj('drop');
  observeObj('dragover');
  observeObj('dragenter');
  observeObj('dragleave');
  this.__canvases.push(canvas2);
})();

      (function(){
        var mainScriptEl = document.getElementById('main');
        if (!mainScriptEl) return;
        var preEl = document.createElement('pre');
        var codeEl = document.createElement('code');
        codeEl.innerHTML = mainScriptEl.innerHTML;
        codeEl.className = 'language-javascript';
        preEl.appendChild(codeEl);
        document.getElementById('bd-wrapper').appendChild(preEl);
      })();
	  
	  
(function() {
  fabric.util.addListener(fabric.window, 'load', function() {
    var canvas = this.__canvas || this.canvas,
        canvases = this.__canvases || this.canvases;

    canvas && canvas.calcOffset && canvas.calcOffset();

    if (canvases && canvases.length) {
      for (var i = 0, len = canvases.length; i < len; i++) {
        canvases[i].calcOffset();
      }
    }
  });
})();