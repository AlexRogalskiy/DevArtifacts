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

    function colorsToPaths(colors){

      var output = ""; 

      // Loop through each color to build paths
      each(colors,function(color,values){
        var orig = color;
        color = getColor.apply(null,color.split(','));

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

    var getColors = function(img) {
      var colors = {},
          data = img.data,
          len = data.length,
          w = img.width,
          h = img.height,
          x = 0,
          y = 0,
          i = 0,
          color;

      for (; i < len; i+= 4) {
        if ( data[i+3] > 0 ) {
          color = data[i]+','+data[i+1]+','+data[i+2]+','+data[i+3];
          colors[color] = colors[color] || [];
          x = (i / 4) % w;
          y = Math.floor((i / 4) / w);
          colors[color].push([x,y]);
        }                      
      }

      return colors;
    }

    var window = window || {};
    window.CP = { 
      shouldStopExecution: function(){ return false; },
      exitedLoop: function(){}
    };

    var colors = getColors(img),
        paths = colorsToPaths(colors),
        output = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 '+img.width+' '+img.height+'" shape-rendering="crispEdges">\n<metadata>Made with Pixels to Svg https://codepen.io/shshaw/pen/XbxvNj</metadata>\n' + paths + '</svg>';

    // Send message back to the main script
    return output;

  };
  
  
  // File Output
  var outputDiv = document.getElementById('output');
  
  function fileSize(str) {
    var bytes = encodeURI(str).split(/%..|./).length - 1;
    if ( bytes === 0 ) return 0;
    var sizes = ['bytes', 'kb', 'mb', 'gb', 'tb'],
        i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024))),
        size = bytes / Math.pow(1024, i);
    return (Math.round(size * 100) / 100) + ' ' + sizes[i];
  };
  
  function downloadLink(output,fileName,linkContent) {
    return '<a href="data:Application/octet-stream,'+ encodeURIComponent(output) +'" download="'+fileName+'.svg">' + (linkContent || output ) + '</a>';
  }
  
  function showOutput(output,fileName) {
    
    outputDiv.innerHTML = '<figure class="output">' + downloadLink(output,fileName) + '<figcaption class="output__details"><em class="output__size">Output size: ' + fileSize(output) + '</em>' + downloadLink(output,fileName,'<span class="download">Download SVG</span>') + '<pre contentEditable="true"  class="output__raw">' + output.replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</pre></figcaption></figure>'  + outputDiv.innerHTML;

    console.timeEnd('conversion');
  }

  // Convert image to canvas ImageData
  function imageToData(img) {

    var canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d"),
        width = img.width,
        height = img.height;

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img,0,0);
    
    return ctx.getImageData(0,0,width,height);
  }
  
  var imageWorker = cw(convertImage);
  function convert(img,fileName){

    img = (img.type ? this : img ); // use `this` if `img` is event
    if ( !img || img === window ) { return false; }
    
    console.time('conversion');
    fileName = fileName || 'pixels';
    
    var imgData = imageToData(img);

    if ( !Modernizr.webworkers || !Modernizr.blobworkers ) {
      console.log('No workers or blog support. Larger images may timeout.');
      var converted = convertImage(imgData);
      showOutput(converted,fileName);
    } else {
      imageWorker.data(imgData).then(function(converted){
        showOutput(converted,fileName);
      },function(e){ 
        outputDiv.innerHTML = outputRaw.innerHTML = "";
        console.error(e);
        console.timeEnd('conversion');
      });
    }
  }

  function makeImage(src,callback){
    var img = new Image();
    img.onload = callback;
    img.src = ( src.target ? src.target.result : src );
  }

  function loadFiles(e){
    var files = (e.target.files || e.dataTransfer.files || uploader.files),
        len = files.length,
        i = 0;

    each(files,function(i,file){
      var reader = new FileReader();
      var fileName = file.name;
      fileName = fileName.slice(0,fileName.lastIndexOf('.')) || fileName + "";
      reader.onload = function(e){
        console.log(e,arguments);
        makeImage(e,function(img){ convert(this,fileName); });
      }
      reader.readAsDataURL(files[i]);
    });
   
  }

  // File Uploader
  var uploader = document.getElementById('upload');
  uploader.onchange = loadFiles;

  // Test Image Conversion
  var test = document.getElementById('test');
  var testImage = document.getElementById('testImage');
  test.onclick = function(){ convert(testImage,'test'); }
  
  // Clear Output
  var clear = document.getElementById('clear');
  clear.onclick = function(){ output.innerHTML = ""; };
  
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