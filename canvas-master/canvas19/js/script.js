// Using canvas to draw image sprites
// @Vestride

(function() {
  var canvas = document.createElement('canvas'),
      ctx,
      img = document.createElement('img'),
      //size = devicePixelRatio > 1 ? 32 : 16,
      size = 32,
      numFrames = 21,
      framesPerAnimation = 7,
      currentFrame = 0,
      thirtyFPS = 1000 / 30,
      animationDelay = 1000 * 1;

  if ( !canvas.getContext ) {
    return;
  }
  
  // Add canvas to the page and set its dimensions
  document.getElementById('wrapper').appendChild( canvas );
  ctx = canvas.getContext('2d');
  canvas.height = canvas.width = size;
  
  // Assuming horizontal sprite
  function Sprite( img, width, height, frameWidth, frameHeight ) {
    this.img = img;
    this.width = width;
    this.height = height;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
  }
  
  Sprite.prototype.getFrame = function( frame ) {
    return {
      x: frame * this.frameWidth,
      y: 0
    };
  };
  
  Sprite.prototype.clearCanvas = function() {
    ctx.clearRect( 0, 0, size, size );
  };
  
  Sprite.prototype.drawFrame = function( frameNumber, x, y ) {
    
    if ( !x ) x = 0;
    if ( !y ) y = 0;
    
    var frame = this.getFrame( frameNumber );
    
    // Clear out the last frame
    this.clearCanvas();
    
    // Draw to the context. This method is really confusing...
    ctx.drawImage(
      this.img,
      frame.x,
      frame.y,
      this.width,
      this.height,
      x,
      y,
      this.width,
      this.height
    );
  };
  
  // Create a new sprite 32x32 size with 32x32 sprites
  var sprite = new Sprite( img, 32, 32, 32, 32 );
  
  function loop() {
    var delay;
      
    // Increment current frame
    currentFrame += 1;
    if ( currentFrame === numFrames ) {
      currentFrame = 0;
    }
      
    // Completed an animation state
    delay = currentFrame % framesPerAnimation === 0 ? animationDelay : thirtyFPS;
      
    // Draw current frame from sprite
    sprite.drawFrame( currentFrame );
    
    // Set a timeout to draw again
    setTimeout( loop, delay );
  }
  
  // Draw the first frame when the image loads
  img.onload = function () {
    sprite.drawFrame( currentFrame );
    setTimeout( loop, thirtyFPS );
  };
      
    
  // Trigger image to load
  img.src = 'data:image/png;base64,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';
  // Original image is here: https://i.imgur.com/VHN53mB.png
  // imgur no longer allows hotlinking on CodePen.
}());