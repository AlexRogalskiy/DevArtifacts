canvas = document.getElementById("life");
context = canvas.getContext("2d");
var x = canvas.width, y = canvas.height;
var massiv = [];
var generation = 1;
for (var i = 0; i < x; i++){
	massiv[i] = [];
  for (var j = 0; j < y; j++){
    massiv[i][j]=0;
  }
}
for (var i = 0; i < x; i++){
  for (var j = 0; j < y; j++){
    if(Math.random()>0.965){
      massiv[i][j] = 1;
    }else{
      massiv[i][j] = 0;
    }		
  }
}
function getSiblings(i,j){
  siblingsCount = 0;
  siblingsCount = massiv[i-1][j-1]+massiv[i-1][j]+massiv[i-1][j+1]+massiv[i][j-1]+massiv[i][j+1]+massiv[i+1][j-1]+massiv[i+1][j]+massiv[i+1][j+1];
  return siblingsCount
}

function drawFrame(){
  $(".generation").html('Generation: '+generation);
  generation++;
  context.fillStyle = "rgba(45,44,42,0.05)";
  context.fillRect(0,0,500,500);
   for (var i = 1; i < 499; i++){
     for (var j = 1; j < 499; j++){
       siblings = getSiblings(i,j);
       //console.log(i+'|'+j+'='+siblings);
       if(massiv[i][j]==1){
         if((siblings==2)||(siblings==3)){
           context.fillStyle = "#c7b479";
           context.fillRect(i, j, 1, 1);
         }else{
           massiv[i][j]=0;
         }
       }else{
         if(siblings==3){
           massiv[i][j]=1;
           context.fillStyle = "#c7b479";
           context.fillRect(i, j, 1, 1);
         }
       }
     }
   }
  setTimeout(drawFrame,50);
}
drawFrame();