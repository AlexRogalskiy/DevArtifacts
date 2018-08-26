$test = setInterval(function(){ drawKhaos(2, 2); }, 50);
$x = 1;
$rgb = 0;
$opacity = 1;

var ctx = $('.logo')[0].getContext("2d");

function drawKhaos($startCoordX, $startCoordY){
  ctx.beginPath();
  switch($x){
    case 1:
      ctx.rect($startCoordX, $startCoordY, 8, 8);
      break;
    case 2:
      ctx.rect($startCoordX, $startCoordY+10, 8, 8);
      break;
    case 3:
      ctx.rect($startCoordX, $startCoordY+20, 8, 8);
      break;
    case 4:
      ctx.rect($startCoordX, $startCoordY+30, 8, 8);
      break;
    case 5:
      ctx.rect($startCoordX, $startCoordY, 8, 8);
      break;
    case 6:
      ctx.rect($startCoordX, $startCoordY+40, 8, 8);
      break;
    case 7:
      ctx.rect($startCoordX+30, $startCoordY, 8, 8);
      break;
    case 8:
      ctx.rect($startCoordX+20, $startCoordY+10, 8, 8);
      break;
    case 9:
      ctx.rect($startCoordX+10, $startCoordY+20, 8, 8);
      break;
    case 10:
      ctx.rect($startCoordX+20, $startCoordY+30, 8, 8);
      break;
    case 11:
      ctx.rect($startCoordX+30, $startCoordY+40, 8, 8);
      break;
    case 12:
      ctx.rect($startCoordX+30, $startCoordY, 8, 8);
      break;
      /* end k */
    case 13:
      ctx.rect($startCoordX+50, $startCoordY, 8, 8);
      break;
    case 14:
      ctx.rect($startCoordX+50, $startCoordY+10, 8, 8);
      break;
    case 15:
      ctx.rect($startCoordX+50, $startCoordY+20, 8, 8);
      break;
    case 16:
      ctx.rect($startCoordX+50, $startCoordY+30, 8, 8);
      break;
    case 17:
      ctx.rect($startCoordX+50, $startCoordY+40, 8, 8);
      break;
    case 18:
      ctx.rect($startCoordX+60, $startCoordY+20, 8, 8);
      break;
    case 19:
      ctx.rect($startCoordX+70, $startCoordY+20, 8, 8);
      break;
    case 20:
      ctx.rect($startCoordX+80, $startCoordY, 8, 8);
      break;
    case 21:
      ctx.rect($startCoordX+80, $startCoordY+10, 8, 8);
      break;
    case 22:
      ctx.rect($startCoordX+80, $startCoordY+20, 8, 8);
      break;
    case 23:
      ctx.rect($startCoordX+80, $startCoordY+30, 8, 8);
      break;
    case 24:
      ctx.rect($startCoordX+80, $startCoordY+40, 8, 8);
      break;
      /* end h */
    case 25:
      ctx.rect($startCoordX+100, $startCoordY+40, 8, 8);
      break;
    case 26:
      ctx.rect($startCoordX+100, $startCoordY+30, 8, 8);
      break;
    case 27:
      ctx.rect($startCoordX+100, $startCoordY+20, 8, 8);
      break;
    case 28:
      ctx.rect($startCoordX+100, $startCoordY+10, 8, 8);
      break;
    case 29:
      ctx.rect($startCoordX+110, $startCoordY, 8, 8);
      break;
    case 30:
      ctx.rect($startCoordX+120, $startCoordY, 8, 8);
      break;
    case 31:
      ctx.rect($startCoordX+130, $startCoordY+10, 8, 8);
      break;
    case 32:
      ctx.rect($startCoordX+130, $startCoordY+20, 8, 8);
      break;
    case 33:
      ctx.rect($startCoordX+130, $startCoordY+30, 8, 8);
      break;
    case 34:
      ctx.rect($startCoordX+130, $startCoordY+40, 8, 8);
      break;
    case 35:
      ctx.rect($startCoordX+130, $startCoordY+40, 8, 8);
      break;
    case 36:
      ctx.rect($startCoordX+110, $startCoordY+20, 8, 8);
      break;
    case 37:
      ctx.rect($startCoordX+120, $startCoordY+20, 8, 8);
      break;
      /* end a */
    case 38:
      ctx.rect($startCoordX+150, $startCoordY+10, 8, 8);
      break;
    case 39:
      ctx.rect($startCoordX+150, $startCoordY+20, 8, 8);
      break;
    case 40:
      ctx.rect($startCoordX+150, $startCoordY+30, 8, 8);
      break;
    case 41:
      ctx.rect($startCoordX+160, $startCoordY+40, 8, 8);
      break;
    case 42:
      ctx.rect($startCoordX+170, $startCoordY+40, 8, 8);
      break;
    case 43:
      ctx.rect($startCoordX+180, $startCoordY+30, 8, 8);
      break;
    case 44:
      ctx.rect($startCoordX+180, $startCoordY+20, 8, 8);
      break;
    case 45:
      ctx.rect($startCoordX+180, $startCoordY+10, 8, 8);
      break;
    case 46:
      ctx.rect($startCoordX+170, $startCoordY, 8, 8);
      break;
    case 47:
      ctx.rect($startCoordX+160, $startCoordY, 8, 8);
      break;
      /* end o */
    case 48:
      ctx.rect($startCoordX+200, $startCoordY+40, 8, 8);
      break;
    case 49:
      ctx.rect($startCoordX+210, $startCoordY+40, 8, 8);
      break;
    case 50:
      ctx.rect($startCoordX+220, $startCoordY+40, 8, 8);
      break;
    case 51:
      ctx.rect($startCoordX+230, $startCoordY+30, 8, 8);
      break;
    case 52:
      ctx.rect($startCoordX+220, $startCoordY+20, 8, 8);
      break;
    case 53:
      ctx.rect($startCoordX+210, $startCoordY+20, 8, 8);
      break;
    case 54:
      ctx.rect($startCoordX+200, $startCoordY+10, 8, 8);
      break;
    case 55:
      ctx.rect($startCoordX+210, $startCoordY, 8, 8);
      break;
    case 56:
      ctx.rect($startCoordX+220, $startCoordY, 8, 8);
      break;
    case 57:
      ctx.rect($startCoordX+230, $startCoordY, 8, 8);
      break;
    
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba('+$rgb+','+$rgb+','+$rgb+','+$opacity+')';
  $opacity /= 1.05;
  ctx.fill();
  $x++;
  if ($x > 57){
    clearInterval($test);
  }
}