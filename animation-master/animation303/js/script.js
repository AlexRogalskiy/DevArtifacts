var [xpos,targetX,ypos,targetY, velX, velY] = [0,0,0,0,0,0];

const docStyle = document.documentElement.style;
const drag = 0.8;
const strength = 0.12;

function springItOn() {

  var diffX = targetX - xpos; 
  diffX *= strength;
  velX *=drag;
  velX += diffX;
	xpos += velX;
  
  var diffY = targetY - ypos; 
  diffY *= strength;
  velY *=drag;
  velY += diffY;
	ypos += velY;
  
  //apply the newly calculated positions via CSS custom properties each frame. SO FANCY
  docStyle.setProperty('--mouse-x', xpos);
  docStyle.setProperty('--mouse-y', ypos);
  
  //set the halo scale property baesd on some arbitrary math for kicks
  docStyle.setProperty('--scale', (velY + velX)*strength);

  requestAnimationFrame(springItOn);
}

springItOn();

//update the target position based on where the mouse is
 document.addEventListener('mousemove', (e) => {
  targetX = e.clientX;
  targetY = e.clientY;
});