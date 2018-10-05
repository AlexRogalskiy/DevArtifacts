var area = document.getElementById('play');
var canvas = document.createElement('canvas');
area.appendChild(canvas);

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
var ctx = canvas.getContext('2d');
var halfOfWidth = canvas.width / 2;
var halfOfHeight = canvas.height / 2;

ctx.fillStyle = 'black';
ctx.fillRect(0,0,canvas.width, canvas.height);
ctx.translate(halfOfWidth, halfOfHeight);

var ParticalApp = (function() {
	/* */
  var me = {};
  var particals = [];
  var noOfParticals = 100;
  var gravity = 0.1;
  var shootPower = 10;
  
  function genRanVelX() {
    return Math.floor(Math.random() * 6) - 3;
  }
  function genRanVelY() {
    return Math.floor(Math.random() * shootPower) - shootPower;
  }
  
  function Velocity(x,y)
  {
    this.x = y;
    this.y = y;
    
    this.addVel = function(dot) {
      dot.x += this.x;
      dot.y += this.y + ((dot.givenLife - dot.life) / 10) + gravity / 2;
    }
  }
  
  function Dot(x, y, v) {
    this.x = x;
    this.y = y;
    this.v = v;
    this.size = 1;
    this.color = genColor();
    this.givenLife = 100;
    
    function genColor() {
      var hue = Math.floor(Math.random() * 360);
      return 'hsla(' + hue + ', 100%, 50%, 1)';
    }
    
    this.reset = function() {
      	this.x = 0;
        this.y = 0;
        
				var vx = genRanVelX();
        var vy = genRanVelY();
        this.v.x = vx;
        this.v.y = vy;
        this.color = genColor();
        this.life = Math.floor(Math.random() * 200) + 1;
      	this.givenLife = this.life;
      	this.size = Math.random() * 3 + 1;
    };
    this.life = 20;
  }
  for (var i=0; i< noOfParticals; i++) {
  	particals.push( new Dot(0,0,new Velocity(genRanVelX(),genRanVelY())) );
  }
  
  me.draw = function() {
    // Begin clear
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
		ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.translate(halfOfWidth, canvas.height);
    
    for (var i=0; i < particals.length; i++) {
      var currentDot = particals[i];
      ctx.beginPath();

      ctx.arc(currentDot.x, currentDot.y, currentDot.size, 0, 2*Math.PI, true);
      ctx.fillStyle = currentDot.color;
      ctx.fill();
      
      
      currentDot.life--;
     	
      if(currentDot.life === 0) {
        currentDot.reset();
      }
        
      currentDot.v.addVel(currentDot);
      
    }
    window.requestAnimationFrame(ParticalApp.draw);
  }
  
  return me;
})();


window.requestAnimationFrame(ParticalApp.draw);

window.addEventListener("resize", function(){
  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  	halfOfWidth = canvas.width / 2;
		halfOfHeight = canvas.height / 2;
  
});