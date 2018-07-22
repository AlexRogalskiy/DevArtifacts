

var msX = 0;  //mouse x
var msY = 0;  //mouse y
var c;  //canvas
var $$; //context
var imgs; //images
var ready = 0;  //images loaded / ready counter
var prevX = 0.5;  //previous x
var prevY = 0.5;  //previous y

function init() {

    var imglay = new Image();
    imglay.src = "http://i61.tinypic.com/245lres.jpg";  //layer4 (background)
    imglay.onload = function() {ready++};
    
     var imglay2 = new Image(); 
    imglay2.src = "http://i61.tinypic.com/v5yj45.jpg";  //layer3 
    imglay2.onload = function() {ready++};

    var imglay3= new Image();
    imglay3.src = "http://i61.tinypic.com/14idg21.jpg"; //layer2
    imglay3.onload = function() {ready++};

    var imglay4 = new Image();
    imglay4.src = "http://oi57.tinypic.com/2enb9ll.jpg "; //layer 1 (foreground)
    imglay4.onload = function() {ready++};



    imgs = [ imglay, imglay2, imglay3, imglay4];

    //
    document.addEventListener('mousemove',function(e){
        var offset = $('#canvas').offset();
        msX = e.pageX - offset.left;
        msY = e.pageY - offset.top;
    });

    c = document.getElementById('canv');
    $$ = c.getContext('2d');
    w = c.width;
    h = c.height;
    render();
}

function render() {

    $$.fillStyle = "rgba(0,0,0,1)";
    $$.fillRect(0, 0, 960, 600);

    prevX += (Math.min(Math.max((msX/960), 0.12), 0.88) - prevX) * .2;
    prevY += (Math.min(Math.max((msY/600), 0.12), 0.88) - prevY) * .2;

    var offx = -(3200-960) * prevX;
    var offy = -(900-650) * prevY;  //50 more than actual height so image base is not shown (depends on the type of image used for layer 1 - in this case, the single tree - it's just a tree, so the base is transparent, showing the black of the canvas. if I used the flowers for layer1, I could set offy to -900-600, which is the actual height of the canvas bc its base is not transparent)

    var iarray = ready / imgs.length;
    if(iarray == 1) {
        try {
            var l = imgs.length;

            for(var i = 0; i < l; ++i) {
                var scale = 0.7 + i/10;
                $$.drawImage(imgs[i], Math.round(offx*scale), Math.round(offy*scale), Math.round(3200*scale), Math.round(900 * scale));
            }
        } catch(e) {
        }
    } else {
        $$.fillStyle = '#fff';
        $$.font = 'italic 14px sans-serif';
        $$.textBaseline = 'top';
        $$.fillText  ('ready: ' + Math.floor(iarray * 100) + "%", 0, 0);
    }
   window.requestAnimationFrame(render);
}
init();