var maxSideNum = 24,
    maxRectangleNum = 24;

// Dat.gui setup
var Options = function() {
    this.height = 400;
    this.radius = 185;
    this.sideCount = 12;
    this.rotSpeed = -0.3;
    
    this.rectangleCount = 12;
    this.rectangleWidth = 80;
    this.vertMargin = 10;
    this.borderWidth = 3;
    
    this.color = 200;
    this.solidBG = false;
    this.rainbowMode = false;
    this.animateThroughSpectrum = false;
    this.fade = false;
};


window.onload = function() {
    // dat.gui setup
    var myOptions = new Options(),
        gui = new dat.GUI(),
        f1 = gui.addFolder('Prism Controls'),
        f2 = gui.addFolder('Rectangle Controls'),
        f3 = gui.addFolder('Color Controls'),
        
        mySideCount = f1.add(myOptions, 'sideCount', 3, maxSideNum).step(1),
        myRadius = f1.add(myOptions, 'radius', 30, 600).step(15),
        myHeight = f1.add(myOptions, 'height', 50, 750).step(50),
        myRotSpeed = f1.add(myOptions, 'rotSpeed', -1, 1).step(0.1),
        
        myRectangleCount = f2.add(myOptions, 'rectangleCount', 3, maxRectangleNum).step(1),
        myRectangleWidth = f2.add(myOptions, 'rectangleWidth', 1, 100).step(5),
        myVertMargin = f2.add(myOptions, 'vertMargin', 0, 15).step(1),
        myBorderWidth = f2.add(myOptions, 'borderWidth', 0, 15).step(1),
        
        myColor = f3.add(myOptions, 'color', 0, 360).step(1),
        mySolidBG = f3.add(myOptions, 'solidBG'),
        myRainbow = f3.add(myOptions, 'rainbowMode'),
        myAnimateThroughSpectrum = f3.add(myOptions, 'animateThroughSpectrum'),
        myFade = f3.add(myOptions, 'fade');
    
    f2.open();
    
    var audio,
        analyser,
        audioctx,
        sourceNode,
        stream;

    var audioInput = document.getElementById('audiofile'),
        listenButton = document.querySelector(".listenButton"),
        playPauseButton = document.querySelector(".playPauseButton");

    var c = 0, // Used to change color over time
        paused = true;
  
    /*var myMusic = [
        "https://zachsaucier.com/music/Initiation.mp3",
        "https://zachsaucier.com/music/High%20Tide.mp3",
        "https://zachsaucier.com/music/Dolphin%20Style.mp3",
        "https://zachsaucier.com/music/King.mp3"
    ];*/
    
    var prism = document.querySelector(".prism"),
        sides = document.querySelectorAll(".side"),
        rectangleArray = [maxSideNum],
        lastTime = Date.now(),
        timeGap = 50,
        rotAmt = 0; // Starting rotation of prism in degrees
    
    function rectangleSetup() {
        for(var i = 0; i < maxSideNum; i++) {
            rectangleArray[i] = sides[i].querySelectorAll(".rectangle");
        }
    }
    rectangleSetup();
    
    
    
    // dat.gui listeners
    
    // f1 listeners
    function sideCountChange(newCount) {
        [].forEach.call(sides, function(elem, i) {
            if(i < myOptions.sideCount) {
                // The circle is inscribed inside of the prism, so we can use this formula to calculate the side length
                var sideLength = 2 * (myOptions.radius) * Math.tan(Math.PI / newCount);
                prism.style.width = sideLength + "px";
                prism.style.left = "calc(50% - " + sideLength / 2 + "px)";
                
                sides[i].style.transform = "rotateY(" + i * (360 / newCount) + "deg) translateZ(" + myOptions.radius + "px) rotateX(180deg)";
                sides[i].classList.remove("hide");
            } else {
                sides[i].classList.add("hide");
            }
        });
    }
    mySideCount.onFinishChange(sideCountChange);
    sideCountChange(myOptions.sideCount);
    
    function radiusChange(newRadius) {
        sideCountChange(myOptions.sideCount);
    }
    myRadius.onFinishChange(radiusChange);
    radiusChange(myOptions.radius);
    
    function heightChange(newHeight) {
        prism.style.height = newHeight + "px";
        prism.style.top = "calc(50% - " + newHeight / 2 + "px)"
        rectangleCountChange(myOptions.rectangleCount);
    }
    myHeight.onFinishChange(heightChange);
    heightChange(myOptions.height);
    
    // f2 listeners 
    function rectangleCountChange(newCount) {
        [].forEach.call(rectangleArray, function(side, i) {
            [].forEach.call(side, function(rect, i) {
                if(i < myOptions.rectangleCount) {
                    rect.style.height = (myOptions.height - myOptions.vertMargin) / newCount - myOptions.vertMargin + "px";
                    rect.classList.remove("hide");
                } else {
                    rect.classList.add("hide");
                }
            });
        });
    }
    myRectangleCount.onFinishChange(rectangleCountChange);
    rectangleCountChange(myOptions.rectangleCount);
    
    function rectangleWidthChange(newWidth) {
        [].forEach.call(rectangleArray, function(side, i) {
            [].forEach.call(side, function(rect, i) {
                rect.style.width = newWidth + "%";
            });
        });
    }
    myRectangleWidth.onFinishChange(rectangleWidthChange);
    rectangleWidthChange(myOptions.rectangleWidth);
    
    function vertMarginChange(newMargin) {
        [].forEach.call(rectangleArray, function(side, i) {
            [].forEach.call(side, function(rect, i) {
                rect.style.margin = newMargin + "px auto";
            });
        });
        rectangleCountChange(myOptions.rectangleCount);
    }
    myVertMargin.onFinishChange(vertMarginChange);
    vertMarginChange(myOptions.vertMargin);
    
    function borderWidthChange(newWidth) {
        [].forEach.call(rectangleArray, function(side, i) {
            [].forEach.call(side, function(rect, i) {
                rect.style.borderWidth = newWidth + "px";
            });
        });
    }
    myBorderWidth.onFinishChange(borderWidthChange);
    borderWidthChange(myOptions.borderWidthChange);
    
    // f3 listeners
    function colorChange(value) {
        if(!myOptions.rainbowMode)
            [].forEach.call(sides, function(elem, i) {
                sides[i].style.color = "hsl(" + value + ", 55%, " + (20 + (i / myOptions.sideCount) * 40) + "%)";
            });
    }
    myColor.onFinishChange(colorChange);
    colorChange(myOptions.color);
    
    mySolidBG.onFinishChange(function(value) {
        if(value === true)
            prism.classList.add("solid");
        else
            prism.classList.remove("solid");
    });
    
    function goRainbowMode(value) {
        [].forEach.call(sides, function(elem, i) {
            if(value === true)
                sides[i].style.color = "hsl(" + 360 * (i / myOptions.sideCount) + ", 80%, 55%)";
            else
                colorChange(myOptions.color);
        });
    }
    myRainbow.onFinishChange(goRainbowMode);
    
    function checkAnimateThroughSpectrum() {
        if(myOptions.animateThroughSpectrum)
            [].forEach.call(sides, function(elem, i) {
                sides[i].style.color = "hsl(" + c + ", 80%, " + (20 + (i / myOptions.sideCount) * 40) + "%)";
            });
        else if(myOptions.rainbowMode)
            goRainbowMode(true);
        else
            colorChange(myOptions.color);
    }
    
    
    
    // The music player listeners
    audioInput.addEventListener('change', function(event) {
        if(event.target.files[0]) {
            // No error checking of file here, could be added
            stream = URL.createObjectURL(event.target.files[0]);
            
            loadSong(stream);
        }
    }, false);
    
    if(listenButton)
        listenButton.addEventListener('click', chooseOneOfMine, false);
    
    playPauseButton.addEventListener('click', togglePlayPause, false);
    
    
    // The music functions
    function setup() {
        // Stop the previous song if there is one
        if(audio)
            togglePlayPause();
        
        audio = new Audio();
        audioctx = new AudioContext();
        analyser = audioctx.createAnalyser();
        analyser.smoothingTimeConstant = 0.75;
        analyser.fftSize = 512;
        
        audio.addEventListener('ended', songEnded, false);
        
        sourceNode = audioctx.createMediaElementSource(audio);
        sourceNode.connect(analyser);
        sourceNode.connect(audioctx.destination);
    }
    
    function loadSong(stream) {
        setup();

        audio.src = stream;

        togglePlayPause();
        document.body.classList.add('loaded');
        update();
    }
    
    function songEnded() {
        document.body.classList.remove('loaded');
        togglePlayPause();
    }
    
    function togglePlayPause() {
        if(paused) {
            document.body.classList.add('loaded');
            audio.play();
            playPauseButton.innerText = "▮▮";
        } else if(!audio.paused && !audio.ended) {
            audio.pause();
            playPauseButton.innerText = "▶";
        }
        
        paused = !paused;
    }
    
    function chooseOneOfMine() {
        var num = Math.round(Math.random() * (myMusic.length - 1)) + 1;
        loadSong(myMusic[num]);
    }

    
    
    // The drawing functions 
    function drawSide(freqSequence, freqPercent) {   
        // Get the number of rectangles based on the freqValue
        drawRectangles(freqSequence, Math.floor(freqPercent * myOptions.rectangleCount / 100))
    }
    
    function drawRectangles(sideNum, numRectanglesShowing) {
        for(var i = 0; i < myOptions.rectangleCount; i++) {
            var cl = rectangleArray[sideNum][i].classList;
            if(i <= numRectanglesShowing) {
                cl.remove("hide");
                cl.remove("faded");
            } else {
                if(!myOptions.fade)
                    cl.add("hide");
                else
                    cl.add("faded");
            }
        }
    }

    var sectionsAveraged = [maxSideNum],
        countSinceLast = [maxSideNum];
    
    function update() {
        var currTime = Date.now();
        
        var freqArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteTimeDomainData(freqArray);

        // Find the average of the values near to each other (grouping)
        var average = 0,
            count = 0,
            numPerSection = 256 / (myOptions.sideCount + 1),
            nextSection = numPerSection;

        for (var i = 0; i < freqArray.length; i++) {
            var v = freqArray[i];
            average += Math.abs(128 - v); // 128 is essentially 0
            count++;
            
            if(i > nextSection) {
                var currentSection = Math.floor(i / numPerSection - 1);
                
                sectionsAveraged[currentSection] += average / count;
                countSinceLast[currentSection]++;
                
                average = 0;
                count = 0;
                nextSection += numPerSection;
            }
        }
        
        // Find the average of the values since the last time checked per section (smoothing)
        if(currTime - lastTime > timeGap) {  
            for (var i = 0; i < myOptions.sideCount; i++) {
                drawSide(i, (sectionsAveraged[i] / countSinceLast[i] * 2.75), c);
                sectionsAveraged[i] = 0;
                countSinceLast[i] = 0;
            }
            
            lastTime = currTime;
        } 
        
        checkAnimateThroughSpectrum();
        
        
            
        c += 0.5;
        requestAnimationFrame(update);
    }
    
    // Rotate the prism
    function rotate() {
        prism.style.transform = "rotateY(" + rotAmt + "deg)";
        rotAmt += 3 * myOptions.rotSpeed;
        if(rotAmt > 360 || rotAmt < -360)
            rotAmt = 0
        requestAnimationFrame(rotate);
    }
    
    rotate();
};