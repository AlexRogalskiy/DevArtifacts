
var ElasticModal = function(el, options) {
  var options = options || {};
  this.topFill =  options.topFill || "black"; //color of top svg strap
  this.bottomFill =  options.bottomFill || this.topFill; //color of bottom svg strap
  this.background =  options.background || "white";
  this.cornerOffset =  options.cornerOffset || 0; //used so svg stuff doesn't exceed border radius
  this.el = el;
  this.velocity = 0;
  this.position = 0;
  this.friction = options.friction || .5;
  this.elasticity = options.elasticity || .75;
  this.init();
}

ElasticModal.prototype.init = function() {
  this.addElasticStraps(); //adds SVG elements to top/bottom
  this.startAnimationLoop(); //begins requestAnimationFrame loop
}

ElasticModal.prototype.addElasticStraps = function() {
  
  this.bottomStrap = new ElasticStrap(this); //each 'strap' is its own object
  this.bottomStrap.el.css('bottom', Math.floor(-this.bottomStrap.el.height()/2)); //attach to bottom of modal
  this.bottomStrap.fill = this.bottomFill; //different colors are to account for gradients
  this.bottomStrap.direction = -1; // used to effect direction the strap moves when the modal moves 
  
  this.topStrap = new ElasticStrap(this);
  this.topStrap.fill = this.topFill; //different colors are to account for gradients
  this.topStrap.el.css('top', Math.floor(-this.bottomStrap.el.height()/2)); //attach to top
  // direction is 1 by default (top strap doesn't need to be inverted)
  
  this.straps = [this.bottomStrap, this.topStrap]; //so I can easily modify/call methods on both
  
}


ElasticModal.prototype.moveTo = function(newY) {
  var currentY = this.el.offset().top;
  this.velocity = ( (Math.floor(newY - currentY)) / (this.friction / (1 - this.friction) ) ); // some math stuff I stole from Mr. David Desandro (thxpal)
  var strapVelocity = -this.velocity; //straps move the opposite direction
  $.each(this.straps, function(){
    this.velocity = strapVelocity ;
  })
}

ElasticModal.prototype.render = function() {
  this.el.css('transform', "translateY(" + this.position + "px)"); //controls the actual position of the modal
}

ElasticModal.prototype.applyPhysics = function() {
  this.velocity *= this.friction;
  this.position += this.velocity;
}

ElasticModal.prototype.startAnimationLoop = function() {
  function loop() {
    this.applyPhysics();
    this.render();
    $.each(this.straps, function(){
      this.applyPhysics();
      this.render();
    })
    window.requestAnimationFrame(loop.bind(this));
  }
  window.requestAnimationFrame(loop.bind(this));
}

var ElasticStrap = function(modal) {
  this.modal = modal;
  this.elasticity = modal.elasticity;
  this.offset = 0; // literal how far offset the strap is
  this.stretch = 0; // basically just potential energy
  this.velocity = 0; // current speed
  this.direction = 1; //used to flip bg/fg colors depending on if the strap is on top or bottom
  this.el = $("<svg class='elastic-modal__elastic' viewBox = '0 0 "
              + this.modal.el.width() + " " 
              + this.modal.el.height()/2 +"'>");
  
  this.addToModal();
}

ElasticStrap.prototype.render = function() {
  var currentFill = this.direction * this.offset <= 0 ? this.fill : this.modal.background; 
  var path =  "<path d='M"+this.modal.cornerOffset+"," // x coord start point
              + this.el.height()/2 // y coord start point
              + " Q"+this.el.width()/2+"," // x coord for quad (bezier quad is the thing that's animated)
              + (this.el.height()/2 + this.offset) +" " // y coord for quad
              + (this.el.width() - this.modal.cornerOffset) // x coord for end point
              + ","+this.el.height()/2+"'>"; //y coord for end point
  
  this.el.css('fill', currentFill);
  this.el.html(path); // actually renders the dang thing
}

ElasticStrap.prototype.applyPhysics = function() {
  this.offset += this.velocity; 
  this.velocity = -this.stretch;
  this.velocity *= this.elasticity;
  this.capOffsetAmounts();
  this.stretch = this.offset; 
}

ElasticStrap.prototype.capOffsetAmounts = function() {
  // makes sure the straps don't break out of their view box
  if ( this.offset > 0 ) {
    this.offset = Math.min(this.offset, this.el.height()/2);
  }
  else {
    this.offset = Math.max(this.offset, -this.el.height()/2);
  }
}

ElasticStrap.prototype.addToModal = function() {
  this.render(); 
  this.modal.el.prepend(this.el);
  //only needs to be done once, once it's attached every time render() is called it will update
}

var $content = $('.elastic-modal__content');
var cornerOffset = parseInt( $content.css('border-radius'),10 );
var $modalEl = $('.elastic-modal');

options = {
  topFill: '#f8971d',
  bottomFill: '#f57e20',
  cornerOffset: cornerOffset,
  friction: .57, // higher = less friction = decelerates slower  = slower initial veloicty = longer animation (won't ever move at >=1)
  elasticity: .68 // how elastic the svg bits are. higher = snappier animation (continues infinitely at >=1)
}

var modal = new ElasticModal( $modalEl, options );
$(document).click(function(e){
  modal.moveTo(e.pageY - $modalEl.height()/2);
  $('.directions').css('display','none');
});

if (!!window.location.pathname.match(/fullcpgrid/)) {
  setTimeout(function(){
    var mid = $(document).height()/2;
    modal.moveTo(mid/3);
  }, 2500)
}