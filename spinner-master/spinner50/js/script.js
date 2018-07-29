
Loadr = new (function Loadr(id){
		// # Defines
		const max_size = 24;
		const max_particles = 1500;
		const min_vel = 20;
		const max_generation_per_frame = 10;

		// #Variables
// sometimes i wrote code horrible enouhg to make eyes bleed 
		var canvas = document.getElementById(id);
		var ctx = canvas.getContext('2d');
		var height = canvas.height;
		var center_y = height/2;
		var width = canvas.width;
		var center_x = width / 2;
		var animate = true;
		var particles = [];
		var last = Date.now(),now = 0;
		var died = 0,len = 0,dt;

		function isInsideHeart(x,y){
			  x = ((x - center_x) / (center_x)) * 3;
		  	y = ((y - center_y) / (center_y)) * -3;
			  // Simplest Equation of lurve
		  	var x2 = x * x;
  		var y2 = y * y;
  		// Simplest Equation of lurve
	  
  return (Math.pow((x2 + y2 - 1), 3) - (x2 * (y2 * y)) < 0);
		
}
		
function random(size,freq){
			  var val = 0;
			  var iter = freq;
			  
  do{
				    size /= iter;
				    iter += freq;
				    val += size * Math.random();
			  }while( size >= 1);
			  
  return val;
		}
  
		function Particle(){
		  	var x = center_x;
			  var y = center_y;
			  var size = ~~random(max_size,2.4);
			  var x_vel = ((max_size + min_vel) - size)/2 - (Math.random() * ((max_size + min_vel) - size));
		  	var y_vel = ((max_size + min_vel) - size)/2 - (Math.random() * ((max_size + min_vel) - size));
			  var nx = x;
  var ny = y;
  var r,g,b,a = 0.05 * size;
  
  this.draw = function(){
    r = ~~( 255 * ( x / width));
    g = ~~( 255 * (1 - ( y / height)));
    b = ~~( 255 - r );
    ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    ctx.beginPath();
    ctx.arc(x,y,size,0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();
  }

  			this.move = function(dt){

    nx += x_vel * dt;
    ny += y_vel * dt;
    if( !isInsideHeart(nx,ny)){
      if( !isInsideHeart(nx,y)){
        x_vel *= -1;
        return;
      }
				      
      if( !isInsideHeart(x,ny)){
							        y_vel *= -1;
							        return;
				      	}
      // Lets do the crazy furbidden
      x_vel = -1 * y_vel;
      y_vel = -1 * x_vel;
      return;
    }
          
				    x = nx;
				    y = ny;
			  }

		}
    
function movementTick(){
  	var len = particles.length;
			  var dead = max_particles - len;
			  for( var i = 0; i < dead && i < max_generation_per_frame; i++ ){
				    particles.push(new Particle());
			  }
			
  // Update the date
  now = Date.now();
  dt = last - now;
  dt /= 1000;
  last = now;
  particles.forEach(function(p){
    p.move(dt);
  });
}
  
		function tick(){

			  ctx.clearRect(0,0,width,height);
			  particles.forEach(function(p){
    		p.draw();
  		});

  			requestAnimationFrame(tick);
		}
		
this.start = function(){

		}
		
this.done = function(){

		}
    
setInterval(movementTick,16);
		tick();

})("loader");