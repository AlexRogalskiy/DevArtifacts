console.clear();
console.time = console.time || function(){};
console.timeEnd = console.timeEnd || function(){};

// Adjust this value at your own peril!
var maxSize = 512;

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

    function makePathData(x,y,w) { 
      w = w ? 'h'+w : 'z';
      return ('M'+x+' '+y+w);
    }
    
    function getBrightness(img) {
      var lums = {},
          data = img.data,
          len = data.length,
          w = img.width,
          h = img.height,
          x = 0,
          y = 0,
          i = 0,
          brightest = 0,
          lum;

      for (; i < len; i+= 4) {
        if ( data[i+3] > 0 ) {
          lum = data[i+3] - (data[i] + data[i+1] + data[i+2])/3;
          lum = ( lum / 256 ).toFixed(2);
          
          lums[lum] = lums[lum] || [];
          x = (i / 4) % w;
          y = Math.floor((i / 4) / w);
          lums[lum].push([x,y]);
          //output+='<circle cx="'+x+'" cy="'+y+'" r="'+lum/255 +'" />\n';
        }                      
      }
      return lums;
    }
    
    function makeCirclePath(lum,data) {
      return '<path stroke-width="'+lum+'" d="'+data+'" />\n';
    }
    
    function lumsToPaths(lums){
      var output = "";
      
/*      each(lums,function(lum,coords){
        var paths = [];
        each(coords,function(i,coord){
          paths.push(makePathData(coord[0],coord[1]));
        });
        output += makeCirclePath(lum,paths.join(''));
      });*/
      
      // Loop through each color to build paths
      each(lums,function(color,values){
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
        output += makeCirclePath(color,paths.join(''));
      });
      
      return output;
    }

    var window = window || {};
    window.CP = { 
      shouldStopExecution: function(){ return false; },
      exitedLoop: function(){}
    };
    
    var lums = getBrightness(img),
        paths = lumsToPaths(lums),
        output;
     
    output = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 '+img.width+' '+img.height+'">\n<g stroke="#000" fill="none" stroke-linecap="square">' + paths + '</g></svg>'

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
  
  function download(data,fileName) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    //return function(){
    var blob = new Blob([data], {type: "octet/stream"}),
        url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
  
  function downloadLink(output,fileName,linkContent) {
    var link = document.createElement('a');
    link.setAttribute('href','#');
    link.addEventListener('click',function(e){
      e.preventDefault();
      download(output,fileName+'.svg');
    });
    
    link.innerHTML = (linkContent || output );
    
    return link;
  }
  
  function showOutput(output,fileName) {
    var figure = document.createElement('figure'),
        figCaption = document.createElement('figcaption');
    figure.className = 'output';
    figure.appendChild(downloadLink(output,fileName));
    
    figCaption.className = 'output__details';
    
    figCaption.innerHTML = '<em class="output__size">Output size: ' + fileSize(output) + '</em><pre contentEditable="true"  class="output__raw">' + output.replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</pre>';
   
    figCaption.insertBefore(downloadLink(output,fileName,'<span class="download">Download SVG</span>'),figCaption.childNodes[0]);
    
    figure.appendChild(figCaption);
    
    outputDiv.insertBefore(figure,outputDiv.childNodes[0]);

    console.timeEnd('conversion');
  }

  // Convert image to canvas ImageData
  function imageToData(img) {

    var canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d"),
        width = img.naturalWidth || img.width,
        height = img.naturalHeight || img.height,
        maxSize = window.maxSize || 512,
        greater = ( width >= height ? width : height ),
        scale = maxSize / greater;
    
    if ( greater > maxSize ) {
      height = height * scale;
      width = width * scale;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img,0,0,width,height);
    
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