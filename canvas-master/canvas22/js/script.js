var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var DeepSpace = function(size, number, speed)
{
  this.size = size;
	this.number = number;
	this.speed = speed;
	this.objects = new Array();

	this.initialize = function()
	{
		this.creationImage();
		this.drawCircle();
		this.animate();
	}

	this.creationImage = function()
	{
		for(var i = 0; i < this.number; i++)
		{
			var star = {
				'x' : Math.random()*2000,
				'y' : Math.random()*900,
				'radius' : Math.random()*this.size+1,
			}
			this.objects.push(star);
		}
	}

	this.drawCircle = function(x, y, radius)
	{
		with(ctx)
		{
			beginPath();
			arc(x, y, radius, 0, 2*Math.PI);
			fillStyle = 'white';
			fill();
			stroke(); 
			closePath();
		}
	}

	this.animate = function()
	{
		for(var j in this.objects)
		{
			var x = this.objects[j].x--;
			var y = this.objects[j].y;
			var radius = this.objects[j].radius;
      
      if(x < -2) this.objects[j].x = 2000;

			this.drawCircle(x, y, radius);
      
		}
	}
  
  setInterval(this.animate.bind(this), this.speed);
}

var space = new DeepSpace(0.5, 600, 50);
space.initialize();
var space = new DeepSpace(1.3, 100, 30);
space.initialize();
var space = new DeepSpace(1.5, 100, 10);
space.initialize();
