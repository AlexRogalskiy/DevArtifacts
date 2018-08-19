/* By Joseph Shenton @JosephShenton */
var degree = 0;
var degreeFlag = 0;     
var endAngle = 0;
var ball = document.getElementById("ball");
var rotatingTimer = 0;

function crossBrowserTransform(ele,deg){
    ele.style.webkitTransform  = 'rotate('+deg+'deg)'; 
    ele.style.mozTransform    = 'rotate('+deg+'deg)'; 
    ele.style.msTransform     = 'rotate('+deg+'deg)'; 
    ele.style.oTransform      = 'rotate('+deg+'deg)'; 
    ele.style.transform       = 'rotate('+deg+'deg)'; 
}
    
function  startAnimation(){       
  rotatingTimer = setInterval(function(){
    if(degreeFlag>360){
      degreeFlag = 0;
    }
    else{
      degreeFlag = degreeFlag+1;
    } 
    crossBrowserTransform(ball,degree);
    degree = ++degree;                
  }, 4);       
}

function stopAnimation(){
  clearInterval(rotatingTimer);
  endAngle = Math.round((degreeFlag/90))*90;
  console.log(endAngle,degreeFlag);
  crossBrowserTransform(ball,endAngle);
}

startAnimation();
document.body.onclick = function(){
  stopAnimation();
}



