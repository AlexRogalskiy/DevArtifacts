console.clear();
console.time = console.time || function(){};
console.timeEnd = console.timeEnd || function(){};

(function(){

  "use strict";

  function each(obj,fn) {
    var length = obj.length,
        likeArray = ( length === 0 || ( length > 0 && (length - 1) in obj ) ),
        i = 0;

    if ( likeArray ) {
      for ( ; i < length; i++ ) { if ( fn.call( obj[ i ], i, obj[ i ] ) === false ) { break; } }
    } else {
      for (i in obj) { if ( fn.call( obj[ i ], i, obj[ i ] ) === false ) { break; } }
    }
  }

  function convertImage(img){
    "use strict";

    var window = window || {};
    window.CP = { 
      shouldStopExecution: function(){ return false; },
      exitedLoop: function(){}
    };

    console.log(img.options);

    var data = img.imageData,
        mask = img.mask || img.options.mask,
        dataURL = img.options.matte.dataURL || img.dataURL || img.options.dataURL,
        width = img.naturalWidth || img.width,
        height = img.naturalHeight || img.height,
        output = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 '+width+' '+height+'" width="'+width+'" height="'+height+'">\n<!-- Made with JPNG.svg http://cdpn.io/LVKEdv -->\n';

    // Only output a mask if there is one.
    if ( mask ) { 
      output += '<defs><mask id="a"><image width="'+width+'" height="'+height+'" xlink:href="'+mask.dataURL+'"/></mask></defs>\n';
    }

    output += '<image width="'+width+'" height="'+height+'"' + ( mask ? ' mask="url(#a)"' : '' ) + ' xlink:href="'+dataURL+'"/></svg>';

    // Send message back to the main script
    return output; //;//output;

  };

  function imageDataToAlpha(img,levels) {
    var data = img.data,
        len = data.length,
        alpha = false,
        i = 0, gray;

    // Limit colors to certain amount of levels
    levels = ( levels < 1 && levels > 0 ? levels * 10 : levels ) || false;

    for (; i < len; i+= 4) {
      if ( !alpha && data[i+3] < 255 ) { alpha = true; }
      gray = ( !levels ? data[i+3] : Math.round(data[i+3]/256 * levels) * (256 / levels ) );
      data[i] = data[i+1] = data[i+2] = gray; //data[i+3];
      data[i+3] = 255;
    }

    return ( alpha ? img : false );
  }

  function alphaMask(svggyImage) {

    var img = svggyImage.imageData,
        canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d"),
        width = img.naturalWidth || img.width,
        height = img.naturalHeight || img.height,
        maskTypeInputChecked = document.querySelector('input[name="mask-type"]:checked'),
        maskType = ( maskTypeInputChecked ? maskTypeInputChecked.value : 'png'),
        maskQualityInput = document.querySelector('input[name="mask-quality"]'),
        maskQuality = ( maskQualityInput ? maskQualityInput.value : 0.3 );

    canvas.width = width;
    canvas.height = height;

    img = imageDataToAlpha(img,( maskType === 'png' && maskQuality < 1 ? maskQuality * 10 : null));

    if ( !img ) { return false; }

    ctx.putImageData(img,0,0);

    return { 
      imageData: img,
      dataURL: canvas.toDataURL('image/'+maskType, parseFloat(maskQuality)),
      quality: maskQuality,
      type: maskType
    };
  }

  function addMatte(svggyImage,quality){

    var img = svggyImage.imageData,
        canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d"),
        w = img.naturalWidth || img.width,
        h = img.naturalHeight || img.height,
        color = document.querySelector('input[name="matte"]').value || "#000";

    quality = quality || 0.6;

    canvas.width = w;
    canvas.height = h;

    ctx.fillStyle = color;
    ctx.fillRect(0,0,w,h);
    ctx.drawImage(svggyImage.canvas,0,0);

    return { 
      imageData: ctx.getImageData(0,0,w,h),
      dataURL: canvas.toDataURL('image/jpeg', parseFloat(quality))
    };
  }

  // Test Image Conversion
  var test = document.getElementById('test');
  var testImage = document.getElementById('testImage');
  test.onclick = function(){ new SvggyImage(testImage,convert); }

  function convert(){

    var imageQualityInput = document.querySelector('input[name="image-quality"]'),
        imageQuality = ( imageQualityInput ? imageQualityInput.value : 0.6 );

    this.options = {
      dataURL: this.canvas.toDataURL('image/jpeg', parseFloat(imageQuality)),
      matte: addMatte(this,imageQuality),
      mask: alphaMask(this)
    }

    this.process(convertImage,false,showOutput);
  };


  function loadFiles(e){
    var files = (e.target.files || e.dataTransfer.files || uploader.files),
        len = files.length,
        i = 0;

    each(files,function(i,file){
      var reader = new FileReader();

      new SvggyImage(file,convert);
    });

  }

  // File Uploader
  var uploader = document.getElementById('upload');
  uploader.onchange = loadFiles;

  // Drag & Drop
  var fileDrag = document.getElementById('filedrag');

  function FileDragReset(e){
    e.preventDefault();
    fileDrag.className = '';
  }

  function FileDragDrop(e){
    e = e || window.event;
    FileDragReset(e);    
    loadFiles(e);
  }

  fileDrag.addEventListener("dragleave", FileDragReset);
  document.addEventListener("dragenter", function(){ fileDrag.className = 'dragenter'; });
  document.addEventListener('dragover',function(e){ e.preventDefault(); /* Essential! */ });
  document.addEventListener("drop", FileDragDrop);

}());


////////////////////////////////////////

// OUTPUT
(function(){

  // File Output
  var outputDiv = document.getElementById('output');

  if ( !outputDiv ) { 
    outputDiv = document.createElement('div');
    outputDiv.setAttribute('id','output');
    document.body.appendChild('output');
  }

  // Clear Output
  var clear = document.getElementById('clear');
  clear.onclick = function(){ output.innerHTML = ""; };

  function fileSize(str) {
    var bytes = ( typeof str === typeof "" ? encodeURI(str).split(/%..|./).length - 1 : str );
    if ( bytes === 0 ) return 0;
    var sizes = ['bytes', 'kb', 'mb', 'gb', 'tb'],
        i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024))),
        size = bytes / Math.pow(1024, i);
    return (Math.round(size * 100) / 100) + ' ' + sizes[i];
  };

  function downloadLink(url,fileName,linkContent) {
    var link = document.createElement('a');
    link.setAttribute('href',url);
    link.setAttribute('target','_blank');

    if ( fileName ) {
      link.setAttribute('download',fileName);
    }

    if ( !linkContent ) {
      linkContent = document.createElement('img');
      linkContent.src = url;
      linkContent.setAttribute('alt',fileName);
    }

    if ( linkContent.nodeName ) {
      link.appendChild(linkContent);
    } else {
      link.innerHTML = linkContent;
    }

    return link;
  }

  function showOutput(output) {

    var fileName = this.fileName || 'jpng',
        blob = new Blob([output], {type: 'image/svg+xml'}),//output,
        blobUrl = URL.createObjectURL(blob),
        figure = document.createElement('figure'),
        figCaption = document.createElement('figcaption');

    figure.className = 'output';
    figure.appendChild(downloadLink(blobUrl,fileName+'.svg'));

    figCaption.className = 'output__details';

    figCaption.innerHTML = '<em class="output__size">Output size: ' + fileSize(output.size ? output.size : output) + '</em>';
    figCaption.appendChild( downloadLink(blobUrl,fileName+'.svg','<span class="download">Download SVG</span>') );

    var showRaw = document.createElement('button'),
        raw = document.createElement('div'),
        rawVisible = false;

    showRaw.className = 'output__show-raw';
    showRaw.innerText = "Show SVG Output";

    showRaw.addEventListener('click',function(){
      rawVisible = !rawVisible;
      showRaw.innerText = ( rawVisible ? 'Hide SVG Output' : 'Show SVG Output' );

      raw.innerHTML = ( rawVisible ? '<pre contentEditable="true" class="output__raw">' + 
                       output.replace(/</g,'&lt;').replace(/>/g,'&gt;') + 
                       '</pre>' : '' );
    });

    figCaption.appendChild(showRaw);
    
    figCaption.appendChild( downloadLink(this.options.mask.dataURL,fileName+'_mask.' + this.options.mask.type,'<span class="download">Download Mask</span>') );
    figCaption.appendChild( downloadLink(this.options.matte.dataURL,fileName+'_image.jpg','<span class="download">Download Matted Image</span>') );

    var removeOutput = document.createElement('button');
    removeOutput.className = 'output__remove';
    removeOutput.innerText = "Remove";

    removeOutput.addEventListener('click',function(){
      figure.remove();
    });
    figCaption.appendChild(removeOutput);
    figCaption.appendChild(raw);

    figure.appendChild(figCaption);
    outputDiv.insertBefore(figure,outputDiv.childNodes[0]);
  }

  window.showOutput = showOutput;
}());


////////////////////////////////////////

// CONVERT FILE

(function(){
/* 
  function Options() { return this; }
 
  Options.prototype = {
    get: function(key){ 
      return key && key !== 'get' && key !== 'set' ? this[key] : this;
    },
    set(key,value) {
      if ( value === undefined ) {
        if ( Array.isArray(key) ) {
          value = key[1];
          key = key[0];
        }
      }
      this[key] = value;
      return this;
    }
  }
  
  var opt = new Options();
  console.log(opt,opt.set('test','true'),opt.get('test'),opt.test,opt.set(['foo','bar']));
  
  function get(key) {
      return ( key ? options[key] : options ) || false;
    };
  function set(key,value) {
      console.log(key,value);
      if ( value === undefined ) {
        value = key[1];
        key = key[0];
      }
      options[key] = value;
      return this;
    };
/*    
  var options = this._options = {};
  
  Object.defineProperty(this, 'options', {
    writeable: true,
    get: get,
    set: set
  });
  
  options.get = get;
  options.set = set;
  
  console.log(this.options);
  console.log(this.options = ['test',true],this.options, this.options.test);
  console.log(this.options = ['foo','another value'],this.options, this.options.test);

*/

  function SvggyImage(file,onready){
    this.onready = onready;
    if ( file instanceof File ) {
      var name = file.name;

      this.file = file;
      this.fileName = name.slice(0,name.lastIndexOf('.')) || name + "";

      var reader = new FileReader();
      reader.onload = this.onloadFile.bind(this);
      reader.readAsDataURL(file);
    } else if ( file instanceof Node ) {
      this.convertImage(file);
    }
    console.log('SvvgyImage',this);
    return this;
  }

  var fn = SvggyImage.prototype = {};
  
  fn.onloadFile = function(src){
    var img = new Image();
    img.onload = this.convertImage.bind(this,img);
    img.src = ( src.target ? src.target.result : src );
  }

  fn.convertImage = function(img){
    img = (img.type ? this : img ); // use `this` if `img` is event
    if ( !img || img === window ) { return false; }

    this.img = img;

    this.canvas = document.createElement("canvas");
    this.width = this.canvas.width = img.naturalWidth || img.width;
    this.height = this.canvas.height = img.naturalHeight || img.height;

    var ctx = this.canvas.getContext("2d");
    ctx.drawImage(img,0,0);

    this.imageData = ctx.getImageData(0,0,this.width,this.height);   

    if ( this.onready ) { 
      this.onready.call(this);
      this.onready = false;
    }
  }

  fn.getSafeData = function(options){    
    return {
      imageData: this.imageData,
      fileName: this.fileName,
      width: this.width,
      height: this.height,
      options: options
    };
  };


  fn.process = function(process,options,callback){

    options = options || this.options;

    var safeData = this.getSafeData(options);

    var processEnd = function(processed){
      this.processed = processed;
      if ( callback ) { callback.call(this,processed); }
      console.timeEnd('conversion');
    }.bind(this);

    if ( !Modernizr.webworkers || !Modernizr.blobworkers ) {
      console.log('No workers or blog support. Larger images may timeout.');
      processEnd(process(safeData));
    } else {
      var imageWorker = cw(process);
      imageWorker.data(safeData).then(processEnd,function(e){ 
        console.error(e);
        console.timeEnd('conversion');
      });
    }
  }

  window.SvggyImage = SvggyImage;

}());

(function(){
  /*

    function each(obj,fn) {
      var length = obj.length,
          likeArray = ( length === 0 || ( length > 0 && (length - 1) in obj ) ),
          i = 0;

      if ( likeArray ) {
        for ( ; i < length; i++ ) { if ( fn.call( obj[ i ], i, obj[ i ] ) === false ) { break; } }
      } else {
        for (i in obj) { if ( fn.call( obj[ i ], i, obj[ i ] ) === false ) { break; } }
      }
    }

    function componentToHex(c) {
      var hex = parseInt(c).toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }

    function getColor(r,g,b,a){
      a = parseInt(a);
      if ( a === undefined || a === 255 ) { return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b); }
      if ( a === 0 ) { return false; }
      return 'rgba('+r+','+g+','+b+','+(a/255)+')';
    }

    // Optimized for horizontal lines
    function makePathData(x,y,w) { return ('M'+x+' '+y+'h'+w+''); }
    function makePath(color,data) { return '<path stroke="'+color+'" d="'+data+'" />\n'; }

    function alphasToPaths(colors){

      var output = ""; 

      // Loop through each color to build paths
      each(colors,function(color,values){
        var orig = color;
        color = 'rgba(0,0,0,'+(255-color)+')';

        if ( color === false ) { return; }

        var paths = [];
        var curPath;
        var w = 1;

        // Loops through each color's pixels to optimize paths
        each(values,function(){

          if ( curPath && this[1] === curPath[1] && this[0] === (curPath[0] + w) ) {
            w++;
          } else {
            if ( curPath ) {
              paths.push(makePathData(curPath[0],curPath[1],w));
              w = 1;
            }
            curPath = this;
          }

        });

        paths.push(makePathData(curPath[0],curPath[1],w)); // Finish last path
        output += makePath(color,paths.join(''));
      });

      return output;
    }

    var getAlphas = function(img) {
      var alphas = {},
          data = img.data,
          len = data.length,
          w = img.width,
          h = img.height,
          x = 0,
          y = 0,
          i = 0,
          alpha;      

      for (; i < len; i+= 4) {
        if ( data[i] < 255 ) {
          alpha = data[i];// - (data[i] + data[i+1] + data[i+2])/3;
          //alpha = alpha.toFixed(2);

          x = (i / 4) % w;
          y = Math.floor((i / 4) / w);

          alphas[alpha] = alphas[alpha] || [];
          alphas[alpha].push([x,y]);
        }                      
      }

      return alphas;
    }

    function makeMask(paths,imgData){

      var mask = imgData.mask,
          img = imgData.imageData;

      //return '<defs><mask id="a"><image width="'+img.width+'" height="'+img.height+'" xlink:href="'+mask.dataURL+'"/></mask></defs>';

      return '<defs><mask id="a"><rect width="100%" height="100%" fill="white" />' + paths + '</mask></defs>';
    }/**/

}());