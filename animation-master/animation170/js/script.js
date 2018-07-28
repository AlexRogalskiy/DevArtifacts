(function(scope){
    //cheap and dirty color blending: Just create a gradient on a canvas and pick a list of colours.

    var createBlends = scope.createBlends = function(steps, startCol, endCol){
        var canvas = document.createElement("canvas"); 
        var colors = []      
        
        canvas.width = steps;
        canvas.height = 1;

        if (canvas.getContext){
            ctx = canvas.getContext('2d');
            ctx.rect(0, 0, steps, 100);
            grd = ctx.createLinearGradient(0, 0, canvas.width, 0);
            grd.addColorStop(0, startCol);   
            grd.addColorStop(1, endCol);
            ctx.fillStyle = grd;
            ctx.fill();
            var imgData = ctx.getImageData(0, 0, steps, 1);
            var data = imgData.data;
        }

        for(var i = 0; i<steps*4; i+= 4){
            var r = data[i];
            var g = data[i+1];
            var b = data[i+2];
            colors.push("rgb("+r+","+g+","+b+")");
        }
        return colors;
    }
    
    var box = document.getElementById("box");
    var numberOfSlices = 60;
    var height = 300;
    var delta = Math.floor(height/numberOfSlices);
    var origindelta = 10/numberOfSlices ;
    var originstart = 45;
    var rotationdelay = 0.2;
    var scaledelay = 0.05;
    var start = -height/2;
    var colrs = createBlends(numberOfSlices,"#FF0000","#FEA208");
    var userAgent   = navigator.userAgent.toLowerCase();
    var prefix = "";
    
    if(/webkit/gi.test(userAgent)){
        prefix = "-webkit-";
    }else if(/explorer/gi.test(userAgent)){
        prefix = "-ms-";
    }else if(/mozilla/gi.test(userAgent)){
        prefix = "-moz-";
    }else{
        prefix = "";
    }
    
    function createElem(c){
        var frag = document.createDocumentFragment();
        var d = document;
        var cssText1 = prefix+"animation-delay:"+ rotationdelay * c+"s;"+prefix+"transform: translateZ("+start+"px)";
        var cssText2 = prefix+"animation-delay:"+ rotationdelay * c+"s;"+prefix+"transform-origin: " + originstart+"% 50%";
        var cssText3a = prefix+"animation-delay:"+ scaledelay * c+"s ;border: solid 2px "+ colrs[c]+";";
        var cssText3b = prefix+"animation-delay:"+ scaledelay * c+"s ;border: solid 2px "+ colrs[numberOfSlices-c]+";";
        var d1 = d.createElement("div");
        var d2 = d.createElement("div");
        var d3a = d.createElement("div");
        var d3b = d.createElement("div");
        var d3c = d.createElement("div");
        var d3d = d.createElement("div");

        d1.setAttribute("style", cssText1);
        d1.className = "outer";
        d2.setAttribute("style", cssText2);
        d3a.setAttribute("style", cssText3a);
        d3a.className = "a";
        d3b.setAttribute("style", cssText3b);
        d3b.className = "b";
        d3c.setAttribute("style", cssText3a);
        d3c.className = "c";
        d3d.setAttribute("style", cssText3b);
        d3d.className = "d";

        d1.appendChild(d2);
        d2.appendChild(d3a);
        d2.appendChild(d3b);
        d2.appendChild(d3c);
        d2.appendChild(d3d);
        frag.appendChild(d1);

        start+= delta;
        originstart+= origindelta;
        return frag;
    }

    for (var i=0, l = numberOfSlices; i<l; i++){
        var elem = createElem(i);
        box.appendChild(elem);
    }
})(window);

var   traqball = new Traqball({stage: "stage", axis: [1, 1, 0], angle: 0.82});