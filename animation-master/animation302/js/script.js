const cat = document.querySelector('.space-cat'),
      width = window.innerWidth;

var currentTime, //current time into the progression of the animation
    startValue, //the begining value of property that is animating
    changeInValue, //the change between the start and destination value
    totalTime; // the total time of the animation

// we'll use iterations to keep track of the animation's progression
var currentIteration = 0,
    totalIterations = 0;

//calculate our total iterations based on 60fps
totalTime = 2; //in seconds
totalIterations = totalTime * 60; //runs 60 times a second*

startValue = 0;
endValue = 800;
changeInValue = endValue - startValue;

const moveCat = () => {
  if (currentIteration < totalIterations) {
    var progress = currentIteration / totalIterations
    currentValue = changeInValue * progress + startValue
    cat.style.transform = `translate3d(${currentValue}px, 0, 0)`
    currentIteration++
  } else {
    currentIteration = currentIteration
  }

  requestAnimationFrame(moveCat)
}

moveCat()
