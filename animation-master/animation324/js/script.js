 /** 
 * @author Karol Stopyra stopyransky(at)gmail.com
 * @since May 5, 2015
 */ 

var settings = {
  initialPixCount : 20,
  framerate : 30,
  pixColor : "#D30000",
  pixColorHover : "#FFBD00",
  backgroundColor: "#eee",
  quadShade : 12,
  
}
var PIXELOZE = ( function( settings ) {
    
    var root = {},
        boxes = [],
        addons = [],
        removals = [],
        mouseBox = {},
        active = null,
        last = null,
        mouseDragging = false,
        mouseoverboxed = null,
        //txtSize = 11,
        // w, h, br,
        markAssetsToReset = false;


    function setup() {
        
        createCanvas( window.innerWidth, window.innerHeight );
        smooth();
        frameRate( settings.framerate );
        noStroke();
        smooth();
        textAlign( CENTER, CENTER );
        //textSize(txtSize);
        //textFont( "Monospace", txtSize );
        
        root = new SingleQuad( 0, 0, width, height, null );
        
        mouseBox = new Boxed( width/2, height/2 );
        
        mouseBox.setSize( 1 );
        
        for(var i = 0; i < settings.initialPixCount; i++) {
            var b = new Boxed(random(width), random(height));
            boxes[boxes.length] = b;
        }
        
    }
    

    function resetAssets() { 
        var ct = 0;
        for( var i = 0; i < boxes.length; i++ ) {
            var b = boxes[ i ];
            if( b.getValue() !== null ) {
                ct++;
                var ww = w + br * ct;
                b.setCenter( ww, h );
                
            }
        }
        markAssetsToReset = false;
    }

    function reset() {
        
        root.clear();
        mouseoverboxed = null;
        

        for(var i = 0; i < removals.length; i++) {
            var b = removals[i];
            var index = boxes.indexOf(b);
            boxes.splice(index, 1);
        }
        removals = [];
        
        var temp = boxes.concat(addons);
        addons = [];
        boxes = temp;
        
        for(var i = 0; i < boxes.length ; i++) {

            var ab = boxes[i];
            if(root.add(ab)) {
                
            } else {
                if(ab.value !== null) {
                    markAssetsToReset = true;
                } else {
                    removals[removals.length] = ab;
                }
            }     
        }
        
        if(markAssetsToReset) resetAssets();
    }

    function update() {
        
        reset();
        root.traverse(applyBehaviors);
        root.traverse(updateMotion);
        
    }

    function draw() {
        
        update();
        
        background(settings.backgroundColor);

        noStroke();
        
        root.display();

        noFill();
        
        root.traverse(displayHoverQuads);
        
        root.traverse(displayContent);

        
        fill(Boxed.ORANGE);
      
       
    }

    function mouseMoved() {
    
        mouseBox.setCenter(mouseX, mouseY);
    
    }

    function mousePressed() {

        root.traverse(passMousePress);
        
        if(active === null) {
            var boxed = new Boxed(mouseX+random(-1,1), 
                                  mouseY+random(-1,1),
                                  random(Boxed.MINSIZE, Boxed.MAXSIZE));
            boxes[boxes.length] = boxed;
            active = boxed;
            last = boxed;
        }
    }

    function mouseReleased() {
        root.traverse( passMouseRelease );
        
        mouseDragging = false;
        last=null;

    }
    
    function mouseDragged() {
        mouseMoved();
        
        if(active !== null && active.isMutable()) active.setDragged(true);
        
        mouseDragging = true;

        if( last != null ) {
            if( Vect2d.prototype.distSq( last.pos, mouseBox.pos ) > Boxed.MAXSIZE * Boxed.MAXSIZE ) {
            var boxed = new Boxed(mouseX+random(-1,1), 
                                  mouseY+random(-1,1),
                                  random(Boxed.MINSIZE, Boxed.MAXSIZE));
            boxes[boxes.length] = boxed;
            last = boxed;
            }
        }
    }

    function mouseEntered() {
       
        mouseMoved();
    
    }

    function mouseExited() {
        
        mouseMoved();
    
    }

    function mouseWheel(e) {
        var scrollamt = e.detail ? e.detail * (-120) : e.wheelDelta;
        var delta = scrollamt > 0 ? 1 : scrollamt < 0 ? -1 : 0;
        if(active !== null) {
            //console.log("active is not null");
            var s = active.getSize() + delta;
            s = s > 36 ? 36 : s < 4 ? 4 : s;
            active.setSize(s);
        }

        
    }

    function windowResized() {
        resizeCanvas(window.innerWidth, window.innerHeight);
        var oldSize = root.getDimension();
        root.resizeQuad(window.innerWidth-1, window.innerHeight-1);
        var newSize = root.getDimension();
        root.clear();
        for(var i = 0; i < boxes.length ; i++) {
            var b = boxes[i];
            var oldpos = b.getPos();
            var newposx = map(oldpos.x, 0, oldSize.x, 0, newSize.x );
            var newposy = map(oldpos.y, 0, oldSize.y, 0, newSize.y );
            b.setCenter(newposx, newposy);
            root.add(b);
        }
        textAlign( CENTER, CENTER );
        textSize(txtSize);
        textFont( "Monospace", txtSize );
    }

    var passMousePress = function(quad) {
        var b = quad.getValue();
        if(b !== null && b.isMouseOver()) {
            b.setPressed(true);  
            active = b;
        }
    };

    var passMouseRelease = function(quad) {
        var b = quad.getValue();
        
        if(b) {
            if(b.isPressed()) {

                b.setPressed(false);
            }
            if(b.isDragged()) {
                b.setDragged(false);
                    var f = Vect2d.prototype.subtract(
                            new Vect2d(b.x(), b.y()), 
                            new Vect2d(mouseX, mouseY));
                    b.applyForce(f);
            }
            active = null;
        }
    };

    var displayHoverQuads = function(quad) {
        if(quad.intersectsBoxed(mouseBox)) {
            fill(0, settings.quadShade);
            rect(quad.x1(), quad.y1(), quad.width(), quad.height());
        }
    };

    var displayContent = function(quad) {
        if(quad.getValue() !== null) {
                quad.getValue().display();
        }  
    };

    var updateMotion = function(quad) {
        var b = quad.getValue();
        if(b !== null) {
            if(!b.isMutable()) return;
                b.update();
        }
    };

    var applyBehaviors = function(quad) {
        var val = quad.getValue();
        if(val !== null) {
                if(!val.isMutable()) val.stayWithin(root);
                val.separate(root.getObjectsUnder(val));
        }
    };

    var Boxed = function( x_, y_, opt_size ) {
        
        // public variables
        this.pos = new Vect2d(x_, y_);
        this.vel = new Vect2d(0, 0);
        this.acc = new Vect2d(0, 0);
        this.size = opt_size || random(Boxed.MINSIZE, Boxed.MAXSIZE);
        this.value = null;
        this.name = "";
        this.mouseover = false;
        this.pressed = false;
        this.dragged = false;
        this.immortal = false;   
        this.icon = null;
        this.link = "";
        this.mutable = true;
        
        Boxed.ORANGE = settings.pixColor ;//color( 255, 89,0, 255 );
        
        Boxed.YELLOW = settings.pixColorHover;
        
        Boxed.WHITE = color( 255, 255, 255 );
        
        Boxed.MINSIZE = 6;
        
        Boxed.MAXSIZE = 22;
        
        Boxed.MAXSPEED = 20;
                
        Boxed.MAXFORCE = 0.95;
        
        Boxed.prototype.setMutable = function ( flag ) {
            
            this.mutable = flag;
            
        };

        Boxed.prototype.isMutable = function () {
            
            return this.mutable;
            
        };

        Boxed.prototype.isMouseOver = function () {
            
            return this.mouseover;
            
        };

        Boxed.prototype.isPressed = function () {
            
            return this.pressed;
            
        };

        Boxed.prototype.isDragged = function () {
            
            return this.dragged;
            
        };

        Boxed.prototype.setPressed = function ( flag ) {
            
            this.pressed = flag;
            
        };

        Boxed.prototype.setDragged = function ( flag ) {
            
            this.dragged = flag;
            
        };

        Boxed.prototype.setLink = function ( link ) {
            
            this.link = link;
            return this;
            
        };

        Boxed.prototype.setIcon = function ( icon ) {
            
            this.icon = icon;
            return this;
            
        };

        Boxed.prototype.getValue = function () {
            
            return this.value;
            
        };

        Boxed.prototype.setValue = function ( val ) {
            
            this.value = val;
            if (this.value !== null)
                this.setMutable( false );
            else
                this.setMutable( true );
            return this;
            
        };

        Boxed.prototype.getName = function () {
            
            return this.name;
            
        };

        Boxed.prototype.setName = function (n) {
            
            this.name = n;
            return this;
            
        };

        Boxed.prototype.getSize = function () {
            
            return this.size;
        
        };

        Boxed.prototype.setSize = function ( s ) {
            
            this.size = s;
            return this;
            
        };

       
        Boxed.prototype.display = function () {
            
            this.mouseover = this.contains(mouseX, mouseY);
            if ( this.mouseover ) mouseoverboxed = this;
            fill( this.mouseover ? ( this.pressed ? Boxed.WHITE : Boxed.YELLOW ) : Boxed.ORANGE );
            stroke("#fff")
            rect( this.x1(), this.y1(), this.size, this.size );
            
            if ( this.value !== null ) {
                
                image( this.value, 
                       this.x1() - 2, 
                       this.y1() - 2, 
                       this.size + 4, 
                       this.size + 4 );
                      
            }

        };

        Boxed.prototype.setCenter = function ( xx, yy ) {
            
            this.pos.set( xx, yy );
            
        };

        Boxed.prototype.getPos = function () {
            
            return this.pos;
            
        };
        
        Boxed.prototype.x = function () {
            
            return this.pos.x;
            
        };

        Boxed.prototype.y = function () {
            
            return this.pos.y;
        };
        
        Boxed.prototype.width = function () {
            
            return this.size;
            
        };
        Boxed.prototype.height = function () {
            
            return this.size;
            
        };

        Boxed.prototype.intersects = function ( x1, y1, x2, y2 ) {
            
            return !( this.x2() < x1 || 
                      x2 < this.x1() || 
                      this.y2() < y1 || 
                      y2 < this.y1() );
              
        };

        Boxed.prototype.intersectsBoxed = function ( other ) {
            
            return !( this.x2() < other.x1() || 
                      other.x2() < this.x1() || 
                      this.y2() < other.y1() || 
                      other.y2() < this.y1() );
              
        };
        
        Boxed.prototype.contains = function (xx, yy) {
            
            return xx >= this.x1() && 
                   yy >= this.y1() && 
                   xx <= this.x2() && 
                   yy <= this.y2();
           
        };

        Boxed.prototype.x1 = function () {
            
            return this.pos.x - this.size * 0.5;
            
        };

        Boxed.prototype.x2 = function () {
            
            return this.pos.x + this.size * 0.5;
            
        };

        Boxed.prototype.y1 = function () {
            
            return this.pos.y - this.size * 0.5;
            
        };

        Boxed.prototype.y2 = function () {
            
            return this.pos.y + this.size * 0.5;
            
        };

        Boxed.prototype.applyForce = function (force) {
            
            //console.log("applyforce");
            //this.acc.div(this.size);
            this.acc.add( force );
            
        };

        Boxed.prototype.update = function () {
            
            if ( !this.pressed ) {
                this.vel.add( this.acc );
                this.vel.limit( Boxed.MAXSPEED );
                this.pos.add( this.vel );
                this.vel.scale( 0.9999 );
                this.acc.scale( 0 );
            }
        };

        Boxed.prototype.seek = function ( vector ) {
            
            this.applyForce( Vect2d.subtract( vector, this.pos )
                    .setMag( Boxed.MAXSPEED )
                    .sub( this.vel )
                    .limit( Boxed.MAXFORCE )
                    );
        };

        Boxed.prototype.avoid = function ( vector ) {
            
            this.applyForce(
                    Vect2d.subtract( this.pos, vector )
                    .setMag( Boxed.MAXSPEED )
                    .sub( this.vel )
                    .limit( Boxed.MAXFORCE ));
            
        };

        Boxed.prototype.separate = function ( movers ) {
            var steer = new Vect2d();
            var count = 0;

            for (var i = 0; i < movers.length; i++) {
                var other = movers[i];
                var d = Vect2d.prototype.dist(this.pos, other.pos);
                var desiredsep = (this.size + other.size) * 0.5;
                if (d > 0 && d < desiredsep) {
                    this.immortal = true;
                    if (!other.immortal)
                        other.onImpact();

                    steer.add(Vect2d.prototype.subtract(this.pos, other.pos).setMag(1 / d));
                    count++;
                }


            }
            if (count > 0) {
                //if(!other.immortal) other.onImpact();
                this.applyForce(steer.div(count).setMag(Boxed.MAXSPEED)
                        .sub(this.vel).limit(Boxed.MAXSPEED * this.size));
            } else {
                this.immortal = false;
                // else -> it goes away using vel set already! hence it moves !
            }


        };

        Boxed.prototype.onImpact = function () {
            //console.log("onImpact()");
            if (this.isMutable()) {
                var n = this.size;

                if (n > Boxed.MINSIZE) {
                    //console.log("this.size > 4");
                    //var p = random(1);

                    for (var i = 0; i < random(2, n * 0.5); i++) {
                        //console.log("forloop impact");
                        var bx = new Boxed(this.x() + random(1, -1), this.y() + random(1, -1), random(n * 0.5, n * 0.8));
                        bx.immortal = true;
                        addons[addons.length] = bx;
                    }
                }
                //console.log("added");
                //removals[removals.length]= other;
                removals[removals.length] = this;
                //boxes.remove(this);
            }
        };

        Boxed.prototype.stayWithin = function (border) {
            if (this.x1() <= border.x1()) {
                this.applyForce(new Vect2d(Boxed.MAXSPEED, this.vel.y)
                        .sub(this.vel).limit(Boxed.MAXFORCE));

            } else if (this.x2() >= border.x2()) {
                this.applyForce(new Vect2d(-Boxed.MAXSPEED, this.vel.y)
                        .sub(this.vel).limit(Boxed.MAXFORCE));

            } else if (this.y1() <= border.y1()) {
                this.applyForce(new Vect2d(this.vel.x, Boxed.MAXSPEED)
                        .sub(this.vel).limit(Boxed.MAXFORCE));

            } else if (this.y2() >= border.y2()) {
                this.applyForce(new Vect2d(this.vel.x, -Boxed.MAXSPEED)
                        .sub(this.vel).limit(Boxed.MAXFORCE));

            }
        };
    };

    var SingleQuad = function(x_, y_, w_, h_, opt_parent) {
        
        // static variables
        SingleQuad.EMPTY = 0;
        SingleQuad.LEAF = 1;
        SingleQuad.POINTER = 2;
        
        // public variables
        this.x = x_ || 0;
        this.y = y_ || 0;
        this.w = w_ ;
        this.h = h_ ;
        this.parent = opt_parent || null;
        this.nw = {};
        this.ne = {};
        this.sw = {};
        this.se = {};
        this.value = null;
        this.type = SingleQuad.EMPTY;

        SingleQuad.prototype.size = function () {
            switch (this.type) {
                case SingleQuad.EMPTY:
                case SingleQuad.LEAF:
                    return 1;
                case SingleQuad.POINTER :
                    var v = 0;
                    v += this.nw.size();
                    v += this.ne.size();
                    v += this.sw.size();
                    v += this.se.size();
                    return v;
            }
        };
        
        SingleQuad.prototype.add = function (b) {

            if (!this.contains(b.x(), b.y())) {
                   return false;
            }
            switch (this.type) {
                case SingleQuad.EMPTY:
                    this.put(b);
                    return true;

                case SingleQuad.LEAF:
                    this.subdivide();
                case SingleQuad.POINTER:
                    if (this.nw.contains(b.x(), b.y()))
                        return this.nw.add(b);
                    else if (this.ne.contains(b.x(), b.y()))
                        return this.ne.add(b);
                    else if (this.sw.contains(b.x(), b.y()))
                        return this.sw.add(b);
                    else if (this.se.contains(b.x(), b.y()))
                        return this.se.add(b);
            }
        };

        SingleQuad.prototype.put = function (boxed) {
            this.value = boxed;
            this.type = SingleQuad.LEAF;
        };

        SingleQuad.prototype.subdivide = function () {
            var halfw = this.w * 0.5,
                    halfh = this.h * 0.5,
                    x = this.x,
                    y = this.y;

            this.nw = new SingleQuad(x, y, halfw, halfh, this);

            this.ne = new SingleQuad(x + halfw, y, halfw, halfh, this);

            this.sw = new SingleQuad(x, y + halfh, halfw, halfh, this);

            this.se = new SingleQuad(x + halfw, y + halfh, halfw, halfh, this);

            var b = this.value;
            this.value = null;
            this.type = SingleQuad.POINTER;

            if (this.nw.contains(b.x(), b.y())) {
                this.nw.put(b);
            } else if (this.ne.contains(b.x(), b.y())) {
                this.ne.put(b);
            } else if (this.sw.contains(b.x(), b.y())) {
                this.sw.put(b);
            } else if (this.se.contains(b.x(), b.y())) {
                this.se.put(b);
            }
        };

        SingleQuad.prototype.remove = function (boxed) {
            // not used (quad redone each frame)
        };

        SingleQuad.prototype.balance = function () {
            // not used (quad redone each frame)
        };

        SingleQuad.prototype.resizeQuad = function (w_, h_) {
            this.w = w_;
            this.h = h_;
        };

        SingleQuad.prototype.clear = function () {
            this.value = null;
            this.nw = null;
            this.ne = null;
            this.sw = null;
            this.se = null;
            this.type = SingleQuad.EMPTY;
            this.parent = null;
        };

        // polluted with external P5 functionality
        SingleQuad.prototype.display = function () {
            fill( 0, settings.quadShade);
            switch (this.type) {
                case SingleQuad.POINTER:
                    this.nw.display();
                    this.ne.display();
                    this.sw.display();
                    this.se.display();
                case SingleQuad.LEAF:
                case SingleQuad.EMPTY:
                    rect(this.x, this.y, this.w, this.h);

            }
        };

        SingleQuad.prototype.traverse = function (f) {
            if (this.type === SingleQuad.POINTER) {
                if (this.nw !== null)
                    this.nw.traverse(f);
                if (this.ne !== null)
                    this.ne.traverse(f);
                if (this.sw !== null)
                    this.sw.traverse(f);
                if (this.se !== null)
                    this.se.traverse(f);
            } else {
                f(this);
            }
        };

        SingleQuad.prototype.getObjectAt = function (xx, yy) {
            //        return this.getQuadAt(xx,yy).getValue(); // wrong
            switch (type) {
                case SingleQuad.EMPTY : { return null; }
                
                case SingleQuad.POINTER:
                {
                    if (this.nw.getObjectAt(x_, y_) !== null)
                        return nw.getObjectAt(x_, y_);
                    if (this.ne.getObjectAt(x_, y_) !== null)
                        return ne.getObjectAt(x_, y_);
                    if (this.sw.getObjectAt(x_, y_) !== null)
                        return sw.getObjectAt(x_, y_);
                    if (this.se.getObjectAt(x_, y_) !== null)
                        return se.getObjectAt(x_, y_);
                }
                
                case SingleQuad.LEAF:
                {
                    if (this.value !== null && this.value.getBox().contains(x_, y_)) {
                        return this.value;
                    }

                    return null;
                }

                default:
                    return null;

            }
        };

        SingleQuad.prototype.getQuadAt = function (xx, yy) {
            if (this.contains(xx, yy)) {
                if (this.type === SingleQuad.LEAF) {
                    return this;
                } else if (this.type === SingleQuad.POINTER) {
                    if (this.nw.contains(xx, yy))
                        return this.nw.getQuadAt(xx, yy);
                    if (this.ne.contains(xx, yy))
                        return this.ne.getQuadAt(xx, yy);
                    if (this.sw.contains(xx, yy))
                        return this.sw.getQuadAt(xx, yy);
                    if (this.se.contains(xx, yy))
                        return this.se.getQuadAt(xx, yy);
                }
            }
        };

        SingleQuad.prototype.getObjectsUnder = function (box) {
            var toUse = [];
            return this.getObjectsUnderInternal(toUse, box);
        };

        SingleQuad.prototype.getObjectsUnderInternal = function (toUse, box) {
            if (this.intersectsBoxed(box)) {
                if (this.type === SingleQuad.LEAF) {
                    toUse[toUse.length] = this.value;
                } else if (this.type === SingleQuad.POINTER) {
                    this.nw.getObjectsUnderInternal(toUse, box);
                    this.ne.getObjectsUnderInternal(toUse, box);
                    this.sw.getObjectsUnderInternal(toUse, box);
                    this.se.getObjectsUnderInternal(toUse, box);
                }
            }
            return toUse;
        };

        SingleQuad.prototype.getQuadsUnder = function (box) {
            var toUse = [];
            return this.getQuadsUnderInternal(toUse, box);
        };

        SingleQuad.prototype.getQuadsUnderInternal = function (toUse, box) {
            if (this.intersectsBoxed(box)) {
                if (this.type === SingleQuad.LEAF) {
                    toUse[toUse.length] = this;
                } else if (this.type === SingleQuad.POINTER) {
                    this.nw.getQuadsUnderInternal(toUse, box);
                    this.ne.getQuadsUnderInternal(toUse, box);
                    this.sw.getQuadsUnderInternal(toUse, box);
                    this.se.getQuadsUnderInternal(toUse, box);
                }
            }
            return toUse;
        };

        SingleQuad.prototype.getRoot = function () {
            return this.parent === null ? this : this.parent.getRoot();
        };

        SingleQuad.prototype.getValue = function () {
            return this.value;
        };

        SingleQuad.prototype.getType = function () {
            return this.type;
        };

        SingleQuad.prototype.getParent = function () {
            return this.parent;
        };

        SingleQuad.prototype.xcenter = function () {
            return this.x + this.w * 0.5;
        };

        SingleQuad.prototype.ycenter = function () {
            return this.y + this.h * 0.5;
        };

        SingleQuad.prototype.width = function () {
            return this.w;
        };

        SingleQuad.prototype.height = function () {
            return this.h;
        };

        SingleQuad.prototype.getDimension = function() {
            return new Vect2d( this.w, this.h );
        }

        SingleQuad.prototype.x1 = function () {
            return this.x;
        };

        SingleQuad.prototype.y1 = function () {
            return this.y;
        };

        SingleQuad.prototype.x2 = function () {
            return this.x + this.w;
        };

        SingleQuad.prototype.y2 = function () {
            return this.y + this.h;
        };

        SingleQuad.prototype.contains = function (xx, yy) {
            return xx >= this.x1() && yy >= this.y1() && xx <= this.x2() && yy <= this.y2();
        };

        SingleQuad.prototype.containsBoxed = function (boxed) {
            return boxed.x1() >= this.x1() && boxed.y1() >= this.y1() && boxed.x2() <= this.x2() && boxed.y2() <= this.y2();
        };

        SingleQuad.prototype.intersects = function (x1, y1, x2, y2) {
            return !(this.x2() < x1 || x2 < this.x1() || this.y2() < y1 || y2 < this.y1());
        };

        SingleQuad.prototype.intersectsBoxed = function (boxed) {
            return !(this.x2() < boxed.x1() || boxed.x2() < this.x1() || this.y2() < boxed.y1() || boxed.y2() < this.y1());
        };
    };

    var Vect2d = function (x, y) {
        this.x = x || 0;
        this.y = y || 0;


        Vect2d.prototype.set = function (x_, y_) {
            this.x = x_;
            this.y = y_;
            return this;
        };

        Vect2d.prototype.add = function (v) {
            this.x += v.x;
            this.y += v.y;
            return this;
        };

        Vect2d.prototype.sub = function (v) {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        };

        Vect2d.prototype.subtract = function (v1, v2) {
            return new Vect2d(v1.x - v2.x, v1.y - v2.y);
        };

        Vect2d.prototype.dist = function (v1, v2) {
            var dx = v1.x - v2.x;
            var dy = v1.y - v2.y;
            return Math.sqrt(dx * dx + dy * dy);
        };

        Vect2d.prototype.distSq = function (v1, v2) {
            var dx = v1.x - v2.x;
            var dy = v1.y - v2.y;
            return dx * dx + dy * dy;
        };

        Vect2d.prototype.mult = function (v) {
            this.x *= v.x;
            this.y *= v.y;
            return this;
        };

        Vect2d.prototype.scale = function (num) {
            this.x *= num;
            this.y *= num;
            return this;
        };

        Vect2d.prototype.div = function (num) {
            this.x /= num;
            this.y /= num;
            return this;
        };

        Vect2d.prototype.normalize = function () {
            var m = this.mag();
            if (m > 1)
                this.div(m);
            return this;
        };

        Vect2d.prototype.setMag = function (len) {
            this.normalize();
            this.scale(len);
            return this;
        };

        Vect2d.prototype.mag = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };

        Vect2d.prototype.magSq = function () {
            return this.x * this.x + this.y * this.y;
        };

        Vect2d.prototype.theta = function () {
            return atan2(y, x);
        };

        Vect2d.prototype.limit = function (max) {
            if (this.magSq() > max * max) {
                this.normalize();
                this.scale(max);
            }
            return this;
        };
    };

    return {
        setup : setup,
        draw : draw,
        mouseMoved : mouseMoved,
        mouseEntered : mouseEntered,
        mouseExited : mouseExited,
        mousePressed: mousePressed,
        mouseReleased: mouseReleased,
        mouseDragged : mouseDragged,
        mouseWheel : mouseWheel,
        windowResized : windowResized,
    };
} )( settings );

window.onload = ( function( w ){
    w.setup = PIXELOZE.setup;
    w.draw = PIXELOZE.draw; 
    w.mouseMoved = PIXELOZE.mouseMoved;
    w.mouseEntered = PIXELOZE.mouseEntered;
    w.mouseExited = PIXELOZE.mouseExited;
    w.mousePressed = PIXELOZE.mousePressed;
    w.mouseReleased = PIXELOZE.mouseReleased;
    w.mouseDragged = PIXELOZE.mouseDragged;
    w.mouseWheel =  PIXELOZE.mouseWheel;
    w.windowResized =  PIXELOZE.windowResized;
} )( window ); 

