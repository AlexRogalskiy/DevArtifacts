          $(function(){
            $('.spritespin').spritespin({
              // Set a single image url as source
              source: 'http://spritespin.ginie.eu/images/bike6x6_big.jpg',
              // Define the size of the display. 
              width: 480,
              height: 327,
              // The total number of frames to show. Here it is 34 although 
              // 36 images might fit into the sprite. But the last two are 
              // missing as you can see in the image
              frames: 34,
              // The number of frames in one row of the sprite sheet
              // This can often be omitted. Spritespin might calculate the right number by its own.
              framesX: 6,
              // Interaction sensitivity and direction
              sense: 1
            });
          });