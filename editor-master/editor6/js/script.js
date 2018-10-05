// WIP by beatrize
/*
  - Removed form input for height and width and just made the power button autopopulate the grid.
  - Made power button and screen light up to indicate that it turns on. 
  - Replaced eraser icon with a garbage can so people know they're clearing the entire grid lol.
*/

  let canvas = $("#pixelCanvas"); // targets canvas
  var globalColor;
  let isClicked = false;

  // creates grid
  function makeGrid() {
 /* event.preventDefault(); // prevents reload
    const heightInput = $("#inputHeight").val(); // gets user input value from #inputHeight
    const widthInput = $("#inputWidth").val(); // gets user input value from #inputWidth

    canvas.empty(); // resets canvas */

      for (let i = 0; i < 16; i++) {
      // creates rows and columns
        const row = canvas.append("<tr></tr>"); // rows
      for (let j = 0; j < 29; j++) {
        row.children().last().append('<td><div class="cell-container"><div class="circle-cell"></div><div></td>'); // appends columns with divs
        }
      }
    }

   // Selects color
  $(".colorSelection").on("click", function() {
    let color = $(this).attr("value");
    window["globalColor"] = color;
  });

  canvas.on("click", ".circle-cell", function(evt) {
    isClicked = false;
     $(this).css("background", globalColor);
  });
    canvas.on("click mousedown mouseenter", ".circle-cell", function(evt) {
    if (evt.buttons == 1) {
      $(this).css("background", globalColor);
   }
    
  });

  // erases individual pixels
  canvas.on("dblclick", ".circle-cell", function(evt) {
  $(this).css("background", "");
  });

  // quick erase drag function
  canvas.on("click mouseover", ".circle-cell", function(evt) {
  if (evt.shiftKey) {
//    if (evt.buttons === 1) { 
      $(this).css("background", "");
// } 
    }
  });

  // clears entire canvas
  function clearCanvas() {
    canvas.find(".circle-cell").css("background-color", "");
  }

  // animation
  $("#blinker").on("click", function() {
    $(this).toggleClass("toggled");
      
    if ($(this).hasClass("toggled")) {
     
      let tl = new TimelineMax()
      // lights up color cells
      tl.fromTo(
        ".circle-cell",
        0.7,
        {
          ease: Power3.easeIn,
          opacity: 1,
          pause: false
        },
        {
          ease: Power3.easeIn,
          opacity: 0.6,
          repeat: -1,
          repeatDelay: 0.3
        }, 0.5
      )
      // lights up power button
      tl.fromTo(
      ".blink-button",
      0.5,
      {
        ease: Power1.easeOut,
        css: { color:"#fff" },
        reversed: true
      },
      {
        ease: Power1.easeOut,
        css: { color: "#3CFF2A" }
      }, 0.1
      )
      // lights up canvas area
       tl.fromTo(
      ".canvas-area",
      1,
      {
        ease: RoughEase.ease.config({ 
          template: 
            Power0.easeNone, 
            strength: 1.5, 
            points: 20, 
            taper: "none", 
            randomize: true,
            clamp: true}),
        backgroundColor: "#272729",
        reversed: true
      },
      {
        ease: RoughEase.ease.config({ 
          template: 
            Power0.easeNone, 
            strength: 1.5, 
            points: 20, 
            taper: "none", 
            randomize: true,
            clamp: true}),
        backgroundColor: "#2F2E22"
      }, 0.1
      )
      /* lights up input areas
       tl.fromTo(
      ["#inputHeight", "#inputWidth"],
      0.5,
      {
        ease: Power4.easeIn,
        backgroundColor: "#244218",
        reversed: true
      },
      {
        ease: Power4.easeIn,
        backgroundColor: "#3A7714"
      }, 0.1
      ); */
    } else {
        // kills all tweens and empties canvas
        TweenMax.killAll(true);
     /* TweenMax.reverse(); */
    /*  $("#sizePicker").trigger("reset"); */
        canvas.empty();
    }
  });
