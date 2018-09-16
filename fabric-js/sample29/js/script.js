(function() {
  // manually initialize 2 filter backend to give ability to switch:
  var webglBackend;
  try {
    webglBackend = new fabric.WebglFilterBackend();
  } catch (e) {
    console.log(e)
  }
  var canvas2dBackend = new fabric.Canvas2dFilterBackend()

  fabric.filterBackend = fabric.initFilterBackend();
  fabric.Object.prototype.transparentCorners = false;
  var $ = function(id){return document.getElementById(id)};

  function applyFilter(index, filter) {
    var obj = canvas.getActiveObject();
    obj.filters[index] = filter;
    var timeStart = +new Date();
    obj.applyFilters();
    var timeEnd = +new Date();
    var dimString = canvas.getActiveObject().width + ' x ' +
      canvas.getActiveObject().height;
    $('bench').innerHTML = dimString + 'px ' +
      parseFloat(timeEnd-timeStart) + 'ms';
    canvas.renderAll();
  }

  function getFilter(index) {
    var obj = canvas.getActiveObject();
    return obj.filters[index];
  }

  function applyFilterValue(index, prop, value) {
    var obj = canvas.getActiveObject();
    if (obj.filters[index]) {
      obj.filters[index][prop] = value;
      var timeStart = +new Date();
      obj.applyFilters();
      var timeEnd = +new Date();
      var dimString = canvas.getActiveObject().width + ' x ' +
        canvas.getActiveObject().height;
      $('bench').innerHTML = dimString + 'px ' +
        parseFloat(timeEnd-timeStart) + 'ms';
      canvas.renderAll();
    }
  }

  fabric.Object.prototype.padding = 5;
  fabric.Object.prototype.transparentCorners = false;

  var canvas = this.__canvas = new fabric.Canvas('c'),
      f = fabric.Image.filters;

  canvas.on({
    'object:selected': function() {
      fabric.util.toArray(document.getElementsByTagName('input'))
                          .forEach(function(el){ el.disabled = false; })

      var filters = ['grayscale', 'invert', 'remove-color', 'sepia', 'brownie',
                      'brightness', 'contrast', 'saturation', 'noise', 'vintage',
                      'pixelate', 'blur', 'sharpen', 'emboss', 'technicolor',
                      'polaroid', 'blend-color', 'gamma', 'kodachrome',
                      'blackwhite', 'blend-image', 'hue', 'resize'];

      for (var i = 0; i < filters.length; i++) {
        $(filters[i]) && (
        $(filters[i]).checked = !!canvas.getActiveObject().filters[i]);
      }
    },
    'selection:cleared': function() {
      fabric.util.toArray(document.getElementsByTagName('input'))
                          .forEach(function(el){ el.disabled = true; })
    }
  });

  fabric.Image.fromURL('./images/pug.jpg', function(img) {
    var oImg = img.set({ left: 0, top: 0}).scale(0.25);
    canvas.add(oImg);
  });
  fabric.Image.fromURL('./images/printio.png', function(img) {
    var oImg = img.set({ left: 150, top: 0}).scale(0.4);
    canvas.add(oImg);
  });
  fabric.Image.fromURL('./images/dragon.jpg', function(img) {
    var oImg = img.set({ left: 0, top: 270}).scale(0.2);
    canvas.add(oImg);
  });
  fabric.Image.fromURL('./images/dragon2.jpg', function(img) {
    var oImg = img.set({ left: 0, top: 500}).scale(0.2);
    canvas.add(oImg);
  });
  var indexF;
  $('webgl').onclick = function() {
    if (this.checked) {
      fabric.filterBackend = webglBackend;
    } else {
      fabric.filterBackend = canvas2dBackend;
    }
  };
  $('brownie').onclick = function() {
    applyFilter(4, this.checked && new f.Brownie());
  };
  $('vintage').onclick = function() {
    applyFilter(9, this.checked && new f.Vintage());
  };
  $('technicolor').onclick = function() {
    applyFilter(14, this.checked && new f.Technicolor());
  };
  $('polaroid').onclick = function() {
    applyFilter(15, this.checked && new f.Polaroid());
  };
  $('kodachrome').onclick = function() {
    applyFilter(18, this.checked && new f.Kodachrome());
  };
  $('blackwhite').onclick = function() {
    applyFilter(19, this.checked && new f.BlackWhite());
  };
  $('grayscale').onclick = function() {
    applyFilter(0, this.checked && new f.Grayscale());
  };
  $('average').onclick = function() {
    applyFilterValue(0, 'mode', 'average');
  };
  $('luminosity').onclick = function() {
    applyFilterValue(0, 'mode', 'luminosity');
  };
  $('lightness').onclick = function() {
    applyFilterValue(0, 'mode', 'lightness');
  };
  $('invert').onclick = function() {
    applyFilter(1, this.checked && new f.Invert());
  };
  $('remove-color').onclick = function () {
    applyFilter(2, this.checked && new f.RemoveColor({
      distance: $('remove-color-distance').value,
      color: $('remove-color-color').value,
    }));
  };
  $('remove-color-color').onchange = function() {
    applyFilterValue(2, 'color', this.value);
  };
  $('remove-color-distance').oninput = function() {
    applyFilterValue(2, 'distance', this.value);
  };
  $('sepia').onclick = function() {
    applyFilter(3, this.checked && new f.Sepia());
  };
  $('brightness').onclick = function () {
    applyFilter(5, this.checked && new f.Brightness({
      brightness: parseFloat($('brightness-value').value)
    }));
  };
  $('brightness-value').oninput = function() {
    applyFilterValue(5, 'brightness', parseFloat(this.value));
  };
  $('gamma').onclick = function () {
    var v1 = parseFloat($('gamma-red').value);
    var v2 = parseFloat($('gamma-green').value);
    var v3 = parseFloat($('gamma-blue').value);
    applyFilter(17, this.checked && new f.Gamma({
      gamma: [v1, v2, v3]
    }));
  };
  $('gamma-red').oninput = function() {
    var current = getFilter(17).gamma;
    current[0] = parseFloat(this.value);
    applyFilterValue(17, 'gamma', current);
  };
  $('gamma-green').oninput = function() {
    var current = getFilter(17).gamma;
    current[1] = parseFloat(this.value);
    applyFilterValue(17, 'gamma', current);
  };
  $('gamma-blue').oninput = function() {
    var current = getFilter(17).gamma;
    current[2] = parseFloat(this.value);
    applyFilterValue(17, 'gamma', current);
  };
  $('contrast').onclick = function () {
    applyFilter(6, this.checked && new f.Contrast({
      contrast: parseFloat($('contrast-value').value)
    }));
  };
  $('contrast-value').oninput = function() {
    applyFilterValue(6, 'contrast', parseFloat(this.value));
  };
  $('saturation').onclick = function () {
    applyFilter(7, this.checked && new f.Saturation({
      saturation: parseFloat($('saturation-value').value)
    }));
  };
  $('saturation-value').oninput = function() {
    applyFilterValue(7, 'saturation', parseFloat(this.value));
  };
  $('noise').onclick = function () {
    applyFilter(8, this.checked && new f.Noise({
      noise: parseInt($('noise-value').value, 10)
    }));
  };
  $('noise-value').oninput = function() {
    applyFilterValue(8, 'noise', parseInt(this.value, 10));
  };
  $('pixelate').onclick = function() {
    applyFilter(10, this.checked && new f.Pixelate({
      blocksize: parseInt($('pixelate-value').value, 10)
    }));
  };
  $('pixelate-value').oninput = function() {
    applyFilterValue(10, 'blocksize', parseInt(this.value, 10));
  };
  $('blur').onclick = function() {
    applyFilter(11, this.checked && new f.Blur({
      value: parseFloat($('blur-value').value)
    }));
  };
  $('blur-value').oninput = function() {
    applyFilterValue(11, 'blur', parseFloat(this.value, 10));
  };
  $('sharpen').onclick = function() {
    applyFilter(12, this.checked && new f.Convolute({
      matrix: [  0, -1,  0,
                -1,  5, -1,
                 0, -1,  0 ]
    }));
  };
  $('emboss').onclick = function() {
    applyFilter(13, this.checked && new f.Convolute({
      matrix: [ 1,   1,  1,
                1, 0.7, -1,
               -1,  -1, -1 ]
    }));
  };
  $('blend').onclick= function() {
    applyFilter(16, this.checked && new f.BlendColor({
      color: document.getElementById('blend-color').value,
      mode: document.getElementById('blend-mode').value,
      alpha: document.getElementById('blend-alpha').value
    }));
  };

  $('blend-mode').onchange = function() {
    applyFilterValue(16, 'mode', this.value);
  };

  $('blend-color').onchange = function() {
    applyFilterValue(16, 'color', this.value);
  };

  $('blend-alpha').oninput = function() {
    applyFilterValue(16, 'alpha', this.value);
  };

  $('hue').onclick= function() {
    applyFilter(21, this.checked && new f.HueRotation({
      rotation: document.getElementById('hue-value').value,
    }));
  };

  $('hue-value').oninput = function() {
    applyFilterValue(21, 'rotation', this.value);
  };

  $('blend-image').onclick= function() {
    applyFilter(20, this.checked && new f.BlendImage({
      image: fImage,
    }));
  };

  $('blend-image-mode').onchange = function() {
    applyFilterValue(20, 'mode', this.value);
  };
  var imageElement = document.createElement('img');
  imageElement.src = './images/printio.png';
  var fImage = new fabric.Image(imageElement);
  fImage.scaleX = 1;
  fImage.scaleY = 1;
  fImage.top = 15;
  fImage.left = 15;
})();
