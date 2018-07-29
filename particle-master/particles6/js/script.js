'use strict';



angular.module('demo', [])
	.directive('team', function () {

		// The minimum field effect required to 
		// form a connection
		var thresholdEnergy = 100,
     eMax = 100,
		eMin = 30,
     // Cache the 2 Pi
     TwoPI = Math.PI * 2;
    
     var teams = ['#ffff99','#990033','#9988ff', '#02301f'];
    
     function getRandomTeam(){
       return teams[~~(Math.random()*teams.length)];
     }
    
		function Particle(xMax,yMax,eMax, eMin, team){
			//Todo: Add sanitzation
			this.generate(xMax, yMax, eMax, eMin);
			this.dead = false;
       this.team = team;
       this.bravery = Math.random() * 0.01;
       this.teamWork = Math.random() * 0.01;
		}
    
     
     Particle.prototype.hit = function(e){
       this.energy -= e * 0.01;
     }
     
     Particle.prototype.heal = function(e){
       if( eMax > this.energy){
         this.energy += e * 0.01;       
       }
     }
		
     Particle.prototype.generate = function(xMax, yMax, eMax, eMin){
			this.x = ~~xMax * Math.random();
			this.y = ~~yMax * Math.random();
			this.xVel = Math.random() * 2;
			this.yVel = Math.random() * 5;
			this.energy   = ~~(((eMax - eMin) * Math.random()) + eMin);
		}

		Particle.prototype.distance = function(par2){
			// Find absolute distance
			return Math.sqrt(Math.pow(par2.x - this.x, 2) + Math.pow(par2.y - this.y, 2)); 
		}

		Particle.prototype.isReachable = function(p2, e2){
			return ((this.energy) * (e2)/ this.distance(p2)) > thresholdEnergy;
		}

     Particle.prototype.isEnemy = function(p2){
       return this.team !== p2.team;
     }
     
     Particle.prototype.canFire = function(p2){
       return this.isEnemy(p2)?this.isReachable(p2, this.energy): false;
     }
		
     Particle.prototype.isInsideFriendZoneOf = function(p2){
       return (p2 !== this) && this.isEnemy(p2)?false : this.isReachable(p2, p2.energy); 
     }
     
     Particle.prototype.getInfluenceOf = function(p2){
       return ((this.energy) * (p2.energy)/ Math.pow(this.distance(p2)));  
     }
     
     Particle.prototype.directionTo = function(p2){
       return Math.atan2(p2.y - this.y, p2.x - this.x);
     }
     
     Particle.prototype.attack = function(enemy){
       var dir = this.directionTo(enemy);
       this.xVel += Math.cos(dir) * this.bravery;
       this.yVel += Math.sin(dir) * this.bravery;
       enemy.hit( this.energy );
     }
     
     Particle.prototype.collaborate = function(friend){
       var dir = this.directionTo(friend);
       this.xVel += Math.cos(dir) * this.teamWork;
       this.yVel += Math.sin(dir) * this.teamWork;
       friend.heal( this.energy );
     }
     
		Particle.prototype.thinkAndAct = function(arrayOfParticles){
			this.attacking = arrayOfParticles.filter( this.canFire.bind(this) );
       this.friendZones = arrayOfParticles.filter( this.isInsideFriendZoneOf.bind(this) );       
       this.attacking.forEach(this.attack.bind(this));
       this.friendZones.forEach(this.collaborate.bind(this));
      
		}
     
		Particle.prototype.render = function(ctx){
       if( this.energy <= 0 ){
         return;
       }

      ctx.beginPath();
		
			ctx.shadowBlur = this.energy / 2;
      
      
			//Draw the particle itself
			ctx.shadowColor = ctx.strokeStyle = ctx.fillStyle = this.team;
       ctx.arc(this.x, this.y, this.energy/10, 0,  TwoPI, false);
		   ctx.closePath();
			ctx.fill();

			ctx.shadowBlur = 0;
			var parLength = this.attacking.length;
			var parFrags = 0,dx,dy;

       parFrags = ~~(Math.random() * 10);
       for( var j = 0; j < parFrags; j++ ){
				  ctx.beginPath();
           dx = (Math.random() * this.energy/4) - this.energy/8;
           dy = (Math.random() * this.energy/4) - this.energy/8;
           ctx.moveTo(this.x + dx, this.y + dy);
           dx += (Math.random() * this.energy/4) - this.energy/8;
           dy += (Math.random() * this.energy/4) - this.energy/8;
           ctx.lineTo(this.x + dy,   this.y + dx);            
           ctx.closePath();
           ctx.stroke();
       }
      
			for( var i = 0; i < parLength; i++ ){
           ctx.beginPath();  
  			  ctx.moveTo(this.x, this.y);
           ctx.lineTo(this.attacking[i].x,   this.attacking[i].y);            
				 ctx.closePath();
				 ctx.stroke();            
			}
			
			// Draw the lines b/w conencted particles
		}

		Particle.prototype.move = function(maxX, maxY){
			this.x += this.xVel;
			this.y += this.yVel;
       this.energy -= 0.001; // Decay of movement
       if( this.energy <= 0 ){
         this.dead = true;
         return;
       }
       this.x += maxX;
       this.x %= maxX;
       
       this.y += maxY;
       this.y %= maxY;
      
		}


		return {
			template: '<canvas></canvas>',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				var canvas = element.find('canvas')[0],
				ctx = canvas.getContext('2d'),
				aliveParticles = 0,	
				particles = [],
				w  = window.innerWidth,
				h = window.innerHeight,
				noOfParticles = Math.pow(w * h, 1/3),
         a = 255,r = 255,g = 255,b = 189;
		

				// Bootstrap it
				for( var i = 0; i < noOfParticles; i++){
					particles.push( new Particle(w,h, eMax, eMin, getRandomTeam()) );
				}
				
				canvas.width = window.innerWidth;
				canvas.height = window.innerHeight;
          window.addEventListener('resize', handleResize);

          function handleResize(){
              canvas.width = w = window.innerWidth;
              canvas.height = h = window.innerHeight;
              noOfParticles = Math.pow(w * h, 1/3);
            
          }

          var hasWon, lastTeam, timeout;
        
        function newWorld(){
            particles.length = 0;
            for( var i = 0; i < noOfParticles; i++){
					  particles.push( new Particle(w,h, eMax, eMin, getRandomTeam()) );
				  }
            timeout = null;
          }
        
        
				function render(){
				  ctx.clearRect(0, 0, w, h);         
          
            particles = particles.filter(function(p){
						return !p.dead;
					});

					aliveParticles = particles.length;
					for( var i = 0; i < aliveParticles; i++){
						particles[i].thinkAndAct( particles );
						particles[i].move(w, h);
						particles[i].render(ctx);
					}
					
					for( var j = 0; j < noOfParticles - aliveParticles; j++ ){
						particles.push( new Particle(w, 0, eMax, eMin, getRandomTeam()) );
					}
            lastTeam = particles[0].team;
            hasWon = true;
            for( var k = 0; k < noOfParticles; k++ ){
              if( particles[k].team !== lastTeam){
                hasWon = false;
                break;
              }
            }
            if( hasWon && !timeout ){
              timeout = setTimeout(newWorld, 5000);
            }
					requestAnimationFrame( render );
				}
          
         render();
			}
		};
    
	});
