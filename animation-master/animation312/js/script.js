//sample background images by zabbyallen.com
// edit: js images are mine
var images = [
"http://res.cloudinary.com/spoiledkidneybeans-squarespace-com/image/upload/v1500576529/pinkSliderbg_noaplt.png",
"http://res.cloudinary.com/spoiledkidneybeans-squarespace-com/image/upload/a_hflip/a_0/v1500576517/greenSliderbg_oajxnz.png", 
"http://res.cloudinary.com/spoiledkidneybeans-squarespace-com/image/upload/v1500576499/beaBG1_padkuu.png",
"http://res.cloudinary.com/spoiledkidneybeans-squarespace-com/image/upload/a_hflip/a_0/v1500576517/greenSliderbg_oajxnz.png"]
    
    var rugImages = document.getElementById("rugBackground");
    
    var i = 0;
        
      setInterval(function() {
      rugImages.style.backgroundImage = "url(" + images[i] + ")";
      i = i + 1;
      if (i == images.length) {
        i =  0;
      }
      }, 250); //seconds in ms 

// pen by beatrize