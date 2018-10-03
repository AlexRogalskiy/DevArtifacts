playing = true;

// snake game credit to Gamkedo 
// https://www.youtube.com/watch?v=xGmXxpIj6vs
window.onload=function() {
	canv=document.getElementById("gc");
	ctx=canv.getContext("2d");
	document.addEventListener("keydown",keyPush);
	setInterval(game,1000/15);
}
px=py=10;
gs=tc=25;
ax=ay=15;
bx=by=18;
xv=yv=0;
trail=[];
tail = resetTail = 5;
function game() {
	updateVolume(tail);
	px+=xv;
	py+=yv;
	if(px<0) {
		px= tc-1;
	}
	if(px>tc-1) {
		px= 0;
	}
	if(py<0) {
		py= tc-1;
	}
	if(py>tc-1) {
		py= 0;
	}
	ctx.fillStyle="black";
	ctx.fillRect(0,0,canv.width,canv.height);

	ctx.fillStyle="white";
	for(var i=0;i<trail.length;i++) {
		ctx.fillRect(trail[i].x*gs,trail[i].y*gs,gs-2,gs-2);
		if(trail[i].x==px && trail[i].y==py) {
			tail = resetTail;
		}
	}
	trail.push({x:px,y:py});
	while(trail.length>tail) {
		trail.shift();
	}

	// increase volume
	if(ax==px && ay==py) {
		tail = tail < 21 ? tail+1 : tail;
		ax=Math.floor(Math.random()*tc);
		ay=Math.floor(Math.random()*tc);
	}
	ctx.fillStyle="green";
	ctx.fillRect(ax*gs,ay*gs,gs-2,gs-2);
	// decrease volume
	if(bx==px && by==py) {
		tail = tail > 1 ? tail-1 : tail;
		bx=Math.floor(Math.random()*tc);
		by=Math.floor(Math.random()*tc);
	}
	ctx.fillStyle="red";
	ctx.fillRect(bx*gs,by*gs,gs-2,gs-2);
}
function keyPush(evt) {
	switch(evt.keyCode) {
		case 37:
			xv=-1;yv=0;
			break;
		case 38:
			xv=0;yv=-1;
			break;
		case 39:
			xv=1;yv=0;
			break;
		case 40:
			xv=0;yv=1;
			break;
	}
}

//video player
function updateVolume(volLvl) {
  var vA = 	document.getElementById("volAmount");
  var vB =  document.getElementById("volButton");
  var vN =  document.getElementById("volNegative");
  var vS = 	document.getElementById("volume");
    var newVolIcon = "";
  vS.title = (volLvl-1)*5;
  if (volLvl-1 == 0) {
    newVolIcon = "<i class=\"material-icons\">volume_mute</i>";    
  } else if ((volLvl-1) * 5 < 50) {
    newVolIcon = "<i class=\"material-icons\">volume_down</i>";    
  } else {
    newVolIcon = "<i class=\"material-icons\">volume_up</i>";
  }
  vB.innerHTML = newVolIcon;
  var newWidth = (volLvl-1)*7;
  vA.style.width = newWidth + "px";
  vN.style.width = (140 - newWidth) + "px";
}

function toggleAudio(){
  if (playing){
    //Pause
  document.getElementById("playButton").innerHTML = "<i class=\"material-icons\">play_arrow</i>";
    playing=false;
  } else{
    //Play
     document.getElementById("playButton").innerHTML = "<i class=\"material-icons\">pause</i>";
    playing=true;
  }
}
