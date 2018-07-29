'use strict';

/**
 * @ngdoc directive
 * @name angryApp.directive:game
 * @description
 * # game
 */
angular.module('angryApp', [])
  .directive('game', function () {
    'use strict';

     // The minimum field effect required to 
     // form a connection
     var thresholdEnergy = 100,
     eMax = 100,
     eMin = 30,
     // Cache the 2 Pi
     TwoPI = Math.PI * 2,
     PIby4 = Math.PI / 4,
     PIby2 = Math.PI / 2;
    
     var teams = ['#ffff99','#990033','#9988ff', '#02301f'];

     function getRandomTeam(){
       return teams[~~(Math.random()*teams.length)];
     }
    
     // e - base energy
     function Base(x, y, team){
       this.x = x;
       this.y = y;
       // Minimum energy to make a base
       this.energy = 1000;
       this.criticalMass = Math.pow(this.energy,1.5);
       this.team = team;
     }
     
     Base.prototype.upgradeSpecs = function(){
       var cost = Math.pow(this.energy,2);
       var critMass = Math.pow(this.energy, 1.5);
       
       return {
         critMass: critMass,
         cost: cost
       };
     
     }
     
    Base.prototype.emit = function(){
        var angle = Math.random() * TwoPI;
        var dist = this.energy / 10;
        var x = this.x + (dist * Math.sin(angle));
        var y = this.y + (dist * Math.cos(angle));
        var e = eMin;

        //console.log( x, y );
        var newPar = new Particle( x, y, e, this.team, this.energy/1000 );
        newPar.setCourseTowards(this, 4, PIby2);
        return newPar;
    }

     Base.prototype.upgrade = function(){
       this.energy += 1000;
       this.criticalMass = Math.pow(this.energy, 1.5);
     }
     
     Base.prototype.grow = function(e){
       if( base.energy < this.criticalMass ){
         this.energy += e * 0.001;
       }
     }
     
     Base.prototype.hit = function(e){
        this.energy -= e * 0.01;
     }

     Base.prototype.render = function(ctx){
        // Draw the outer team circle
        if( this.energy <= 0 ){
            return;
        }
        ctx.beginPath();
        ctx.shadowBlur = this.energy/4;
        ctx.shadowColor = ctx.strokeStyle = ctx.fillStyle = this.team;
        ctx.arc(this.x , this.y , this.energy/20 + Math.abs(Math.sin(Date.now() * 0.0018) * ( this.energy/200 )), 0,  TwoPI, false);
        ctx.closePath();
        ctx.fill();

        // Draw the inner core circle
        ctx.beginPath();
        ctx.shadowBlur = 0;
        ctx.shadowColor = ctx.strokeStyle = ctx.fillStyle = '#ffffff';
        ctx.arc(this.x, this.y, this.energy/22, 0,  TwoPI, false);
        ctx.closePath();
        ctx.fill();
       
    }

    Base.prototype.isInTeam = function(particle){
        return particle.team === this.team;
    }
    Base.prototype.attract = function(particle){
        // More like gravity
        particle.setCourseTowards( this , 0.0001 * this.energy);
    }

    Base.prototype.influence = function(particles){
        if( this.energy <= 1){
            this.dead = true;
            return;
        }
        var teamMates = particles.forEach(this.attract.bind( this ));
    }
    
    function Particle(x, y, e, team, baseLevel){
        //Todo: Add sanitzation
        this.x = x;
        this.y = y;
        this.energy = e;
        this.xVel = 0;
        this.yVel = 0;
        this.team = team;
        
        this.dead = false;

        // Level 2 base = 0.1 extra bravery ! woot ?
        // this allows incredible attackery and defendary.
        
        this.bravery = Math.random() * 0.01 + baseLevel * 0.01;
        this.teamWork = Math.random() * 0.01 + baseLevel * 0.01;

        // Discipline causes following of finger
        this.discipline = Math.random() * 0.01 + baseLevel * 0.01;
    }
    
     
    Particle.prototype.hit = function(e){
        this.energy -= e * 0.01;
    }
     
    
    Particle.prototype.heal = function(e){
        if( eMax > this.energy){
            this.energy += e * 0.005;       
        }
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
    
    Particle.prototype.setCourseTowards = function(target, eagerness, deltaAngle){
       var dir = this.directionTo(target);
       deltaAngle = deltaAngle || 0;
       dir += deltaAngle;

       this.xVel += Math.cos(dir) * eagerness;
       this.yVel += Math.sin(dir) * eagerness;
    }

    Particle.prototype.attack = function(enemy){
       this.setCourseTowards( enemy, this.bravery );
       enemy.hit( this.energy );
    }
     
    Particle.prototype.collaborate = function(friend){
       this.setCourseTowards( friend, this.teamWork );
       friend.heal( this.energy );
    }

    Particle.prototype.findClosestBase = function(listOfBases, includeEnemies, enemyOnly){
        
        var lenListOfBases = listOfBases.length,
        closestDist = Infinity, currDist, base,
        closestBase = null;
        
        includeEnemies = includeEnemies || false;
        enemyOnly = enemyOnly || false;

        for( var i = 0; i < lenListOfBases; i++){
            
            base = listOfBases[i];

            if( !includeEnemies && base.team !== this.team ){
                continue;
            }
            if( enemyOnly && base.team === this.team ){
                continue;
            }
            // Its our base lets find the distance
            currDist = this.distance( base );
            
            if( currDist < closestDist ){
                closestDist = currDist;
                closestBase = base;
            }
        
        }

        return closestBase;
    } 

    Particle.prototype.thinkAndAct = function(arrayOfParticles, arrayOfBases){
        this.attacking = arrayOfParticles.filter( this.canFire.bind(this) );
        this.friendZones = arrayOfParticles.filter( this.isInsideFriendZoneOf.bind(this) );       
        this.attacking = this.attacking.concat( arrayOfBases.filter( this.canFire.bind( this ) ) );

        this.attacking.forEach(this.attack.bind(this));
        this.friendZones.forEach(this.collaborate.bind(this));


        // If this area is cool
        if( this.attacking === 0 ){
            // Goto the closest base
            this.closestEnemyBase = this.findClosestBase(arrayOfBases, true, true);
            this.closestFriendlyBase = this.findClosestBase( arrayOfBases, false);
            this.closestBase = this.findClosestBase(arrayOfBases, true);

            if( this.closestEnemyBase ){
                this.attacking.push( this.closestEnemyBase );
                this.closestEnemyBase.hit( this.energy );
            }
            

            if( this.closestBase === this.closestEnemyBase && this.bravery > this.teamWork ){
                // Perhaps attack
                this.setCourseTowards( this.closestEnemyBase, this.bravery + this.teamWork );
            }
            
            if( this.closestBase === this.closestFriendlyBase && this.teamWork > this.bravery ){
                // Perhaps go back
                this.setCourseTowards( this.closestFriendlyBase, this.bravery + this.teamWork );
            }

            // Randomly sway.
        }        
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
        var parFrags = 0, dx, dy;

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
        
        this.xVel %= 10;
        this.yVel %= 10;

        this.x += this.xVel;
        this.y += this.yVel;
        this.energy -= 0.001; // Decay of movement
        if( this.energy <= 0 ){
            this.dead = true;
            return;
        }
  
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
                Bases = [],
                a = 255,r = 255,g = 255,b = 189;
        

                // Bootstrap it

                function MakeBases(maxX, maxY){
                    Bases = [];
                    for( var i = 0; i < teams.length; i++ ){
                        Bases.push(new Base(Math.random() * maxX, Math.random() * maxY, teams[i]));       
                    }

                  
                }
         
                MakeBases(w, h);
        
                
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
                    MakeBases(w, h);
                    particles.length = 0;                    
                    timeout = null;
                }
        
        
                function render(){
                    ctx.clearRect(0, 0, w, h);         
                    
                    particles = particles.filter(function(p){
                        return !p.dead;
                    });
                    Bases = Bases.filter(function(b){
                        return !b.dead;
                    });
                    
                    if( Bases.length === 1 && !timeout){
                      timeout = setTimeout(newWorld, 5000);
                    }
                  
                    aliveParticles = particles.length;
                    
                    for( var a = 0; a < Bases.length; a++){
                        
                        Bases[a].render(ctx);

                        // Bases cannot attack they are peaceful
                        // energy orbs attack they are angry lol
                        Bases[a].influence( particles );

                        if( aliveParticles < noOfParticles ){
                            particles.push(Bases[a].emit());
                            aliveParticles++;
                        }
                    
                    }

                    for( var i = 0; i < aliveParticles; i++){
                        particles[i].thinkAndAct( particles, Bases );
                        particles[i].move(w, h);
                        particles[i].render(ctx);
                    }

                    requestAnimationFrame( render );
                }
          
                render();
            }
        };
    
    });


