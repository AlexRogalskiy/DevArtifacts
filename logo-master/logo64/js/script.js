function getValue($value){
  $opacity = 1;
  $fullPxCount = 0;
	$counter = 0;
	$param = [];
	$pixels = [];
  $input = $value.toLowerCase();
  $letterCount = $input.split("").length;
  $test = setInterval(function(){ drawWord($input,2,2); }, 50);
  $canvasWidth = $letterCount*50-8;
	$marginLeft = $canvasWidth*(-0.5);
	$logo.width=$canvasWidth;
	$('.logo').css('margin-left', $marginLeft+'px');
}
$input = "animated"; //the default word to pixelize x)
//$color = "rgba(0,0,0,0.1)"; //change the color
$opacity = 1;
$letterCount = $input.split("").length;
$test = setInterval(function(){ drawWord($input,2,2); }, 50);
$fullPxCount = 0;
$counter = 0;
$param = [];
$pixels = [];

var ctx = $('.logo')[0].getContext("2d");
$logo = $('.logo')[0];
$canvasWidth = $letterCount*50-8;
$marginLeft = $canvasWidth*(-0.5);
$logo.width=$canvasWidth;
$('.logo').css('margin-left', $marginLeft+'px');
function drawWord($word, $startX, $startY){
  $letter = $word.split("");
  $pX = $startX;
  $pY = $startY;
  for ($i = 0; $i < $letterCount; $i++) {
    animated($letter[$i], $pX, $pY);
	}
  //alert($fullPxCount);
  clearInterval($test);
  $testi = $pixels.toString();
  $testi = $testi.split(",");
  $loop = 0;
  ctx.beginPath();
	drawTheThing();
  ctx.closePath();
}

function animated($letter, $posX, $posY){
  switch ($letter){
    case 'a':
      $pxCount = 12;
  		$pixel = [($posX+0)+','+($posY+40), 
                ($posX+0)+','+($posY+30), 
                ($posX+0)+','+($posY+20), 
                ($posX+0)+','+($posY+10), 
                ($posX+10)+','+($posY+0), 
                ($posX+20)+','+($posY+0), 
                ($posX+30)+','+($posY+10), 
                ($posX+30)+','+($posY+20), 
                ($posX+30)+','+($posY+30), 
                ($posX+30)+','+($posY+40), 
                ($posX+10)+','+($posY+20), 
                ($posX+20)+','+($posY+20)];
      break;
    case 'b':
      $pxCount = 14;
      $pixel = [($posX+0)+','+($posY+0), 
                ($posX+0)+','+($posY+10), 
                ($posX+0)+','+($posY+20), 
                ($posX+0)+','+($posY+30), 
                ($posX+0)+','+($posY+40), 
                ($posX+10)+','+($posY+40), 
                ($posX+20)+','+($posY+40), 
                ($posX+30)+','+($posY+30), 
                ($posX+20)+','+($posY+20), 
                ($posX+10)+','+($posY+20), 
                ($posX+10)+','+($posY+40), 
                ($posX+30)+','+($posY+10), 
                ($posX+20)+','+($posY+0), 
                ($posX+10)+','+($posY+0)];
      break;
    case 'c':
      $pxCount = 9;
      $pixel = [($posX+30)+','+($posY+10), 
                ($posX+20)+','+($posY+0), 
                ($posX+10)+','+($posY+0), 
                ($posX+0)+','+($posY+10), 
                ($posX+0)+','+($posY+20), 
                ($posX+0)+','+($posY+30), 
                ($posX+10)+','+($posY+40), 
                ($posX+20)+','+($posY+40), 
                ($posX+30)+','+($posY+30)];
      break;
    case 'd':
      $pxCount = 12;
      $pixel = [($posX+0)+','+($posY+0), 
                ($posX+0)+','+($posY+10), 
                ($posX+0)+','+($posY+20), 
                ($posX+0)+','+($posY+30), 
                ($posX+0)+','+($posY+40), 
                ($posX+10)+','+($posY+40), 
                ($posX+20)+','+($posY+40), 
                ($posX+30)+','+($posY+30), 
                ($posX+30)+','+($posY+20), 
                ($posX+30)+','+($posY+10), 
                ($posX+20)+','+($posY+0), 
                ($posX+10)+','+($posY+0)];
      break;
    case 'e':
      $pxCount = 14;
      $pixel = [($posX+30)+','+($posY+0), 
                ($posX+20)+','+($posY+0), 
                ($posX+10)+','+($posY+0), 
                ($posX+0)+','+($posY+0), 
                ($posX+0)+','+($posY+10), 
                ($posX+0)+','+($posY+20), 
                ($posX+0)+','+($posY+30), 
                ($posX+0)+','+($posY+40), 
                ($posX+10)+','+($posY+40), 
                ($posX+20)+','+($posY+40), 
                ($posX+30)+','+($posY+40), 
                ($posX+10)+','+($posY+20), 
                ($posX+20)+','+($posY+20), 
                ($posX+30)+','+($posY+20)];
      break;
    case 'f':
      $pxCount = 11;
      $pixel = [($posX+0)+','+($posY+40), 
                ($posX+0)+','+($posY+30), 
                ($posX+0)+','+($posY+20), 
                ($posX+0)+','+($posY+10), 
                ($posX+0)+','+($posY+0), 
                ($posX+10)+','+($posY+0), 
                ($posX+20)+','+($posY+0), 
                ($posX+30)+','+($posY+0), 
                ($posX+10)+','+($posY+20), 
                ($posX+20)+','+($posY+20), 
                ($posX+30)+','+($posY+20)];
      break;
    case 'g':
      $pxCount = 12;
      $pixel = [($posX+30)+','+($posY+0), 
                ($posX+20)+','+($posY+0), 
                ($posX+10)+','+($posY+0), 
                ($posX+0)+','+($posY+10), 
                ($posX+0)+','+($posY+20), 
                ($posX+0)+','+($posY+30), 
                ($posX+10)+','+($posY+40), 
                ($posX+20)+','+($posY+40), 
                ($posX+30)+','+($posY+40), 
                ($posX+30)+','+($posY+30), 
                ($posX+30)+','+($posY+20), 
                ($posX+20)+','+($posY+20)];
      break;
    case 'h':
      $pxCount = 12;
      $pixel = [($posX+0)+','+($posY+0), 
                ($posX+0)+','+($posY+10), 
                ($posX+0)+','+($posY+20), 
                ($posX+0)+','+($posY+30), 
                ($posX+0)+','+($posY+40), 
                ($posX+10)+','+($posY+20), 
                ($posX+20)+','+($posY+20), 
                ($posX+30)+','+($posY+0), 
                ($posX+30)+','+($posY+10), 
                ($posX+30)+','+($posY+20), 
                ($posX+30)+','+($posY+30), 
                ($posX+30)+','+($posY+40)];
      break;
    case 'i':
      $pxCount = 9;
      $pixel = [($posX+15)+','+($posY+0), 
                ($posX+15)+','+($posY+10), 
                ($posX+15)+','+($posY+20), 
                ($posX+15)+','+($posY+30), 
                ($posX+15)+','+($posY+40), 
                ($posX+5)+','+($posY+0), 
                ($posX+25)+','+($posY+0), 
                ($posX+5)+','+($posY+40), 
                ($posX+25)+','+($posY+40)];
      break;
    case 'j':
      $pxCount = 7;
      $pixel = [($posX+30)+','+($posY+0), 
                ($posX+30)+','+($posY+10), 
                ($posX+30)+','+($posY+20), 
                ($posX+30)+','+($posY+30), 
                ($posX+20)+','+($posY+40), 
                ($posX+10)+','+($posY+40), 
                ($posX+0)+','+($posY+30)];
      break;
    case 'k':
      $pxCount = 10;
      $pixel = [($posX+0)+','+($posY+0), 
                ($posX+0)+','+($posY+10), 
                ($posX+0)+','+($posY+20), 
                ($posX+0)+','+($posY+30), 
                ($posX+0)+','+($posY+40), 
                ($posX+30)+','+($posY+0), 
                ($posX+20)+','+($posY+10), 
                ($posX+10)+','+($posY+20), 
                ($posX+20)+','+($posY+30), 
                ($posX+30)+','+($posY+40)];
      break;
    case 'l':
      $pxCount = 8;
      $pixel = [($posX+0)+','+($posY+0), 
                ($posX+0)+','+($posY+10), 
                ($posX+0)+','+($posY+20), 
                ($posX+0)+','+($posY+30), 
                ($posX+0)+','+($posY+40), 
                ($posX+10)+','+($posY+40), 
                ($posX+20)+','+($posY+40), 
                ($posX+30)+','+($posY+40)];
      break;
    case 'm':
      $pxCount = 13;
      $pixel = [($posX+0)+','+($posY+40), 
                ($posX+0)+','+($posY+30), 
                ($posX+0)+','+($posY+20), 
                ($posX+0)+','+($posY+10), 
                ($posX+0)+','+($posY+0), 
                ($posX+10)+','+($posY+10), 
                ($posX+15)+','+($posY+20), 
                ($posX+20)+','+($posY+10), 
                ($posX+30)+','+($posY+0), 
                ($posX+30)+','+($posY+10), 
                ($posX+30)+','+($posY+20), 
                ($posX+30)+','+($posY+30), 
                ($posX+30)+','+($posY+40)];
      break;
    case 'n':
      $pxCount = 12;
      $pixel = [($posX+0)+','+($posY+40), 
                ($posX+0)+','+($posY+30), 
                ($posX+0)+','+($posY+20), 
                ($posX+0)+','+($posY+10), 
                ($posX+0)+','+($posY+0), 
                ($posX+10)+','+($posY+10), 
                ($posX+20)+','+($posY+20), 
                ($posX+30)+','+($posY+30), 
                ($posX+30)+','+($posY+40), 
                ($posX+30)+','+($posY+20), 
                ($posX+30)+','+($posY+10), 
                ($posX+30)+','+($posY+0)];
      break;
    case 'o':
      $pxCount = 10;
      $pixel = [($posX+0)+','+($posY+10), 
                ($posX+0)+','+($posY+20), 
                ($posX+0)+','+($posY+30), 
                ($posX+10)+','+($posY+40), 
                ($posX+20)+','+($posY+40), 
                ($posX+30)+','+($posY+30), 
                ($posX+30)+','+($posY+20), 
                ($posX+30)+','+($posY+10), 
                ($posX+20)+','+($posY+0), 
                ($posX+10)+','+($posY+0)];
      break;
    case 'p':
      $pxCount = 10;
      $pixel = [($posX+0)+','+($posY+40), 
                ($posX+0)+','+($posY+30), 
                ($posX+0)+','+($posY+20), 
                ($posX+0)+','+($posY+10), 
                ($posX+0)+','+($posY+0), 
                ($posX+10)+','+($posY+0), 
                ($posX+20)+','+($posY+0), 
                ($posX+30)+','+($posY+10), 
                ($posX+20)+','+($posY+20), 
                ($posX+10)+','+($posY+20)];
      break;
    case 'q':
      $pxCount = 13;
      $pixel = [($posX+0)+','+($posY+10), 
                ($posX+0)+','+($posY+20), 
                ($posX+0)+','+($posY+30), 
                ($posX+10)+','+($posY+40), 
                ($posX+20)+','+($posY+40), 
                ($posX+30)+','+($posY+30), 
                ($posX+30)+','+($posY+20), 
                ($posX+30)+','+($posY+10), 
                ($posX+20)+','+($posY+0), 
                ($posX+10)+','+($posY+0), 
                ($posX+20)+','+($posY+30), 
                ($posX+25)+','+($posY+35), 
                ($posX+30)+','+($posY+40)];
      break;
    case 'r':
      $pxCount = 12;
      $pixel = [($posX+0)+','+($posY+40), 
                ($posX+0)+','+($posY+30), 
                ($posX+0)+','+($posY+20), 
                ($posX+0)+','+($posY+10), 
                ($posX+0)+','+($posY+0), 
                ($posX+10)+','+($posY+0), 
                ($posX+20)+','+($posY+0), 
                ($posX+30)+','+($posY+10), 
                ($posX+20)+','+($posY+20), 
                ($posX+10)+','+($posY+20), 
                ($posX+30)+','+($posY+30), 
                ($posX+30)+','+($posY+40)];
      break;
    case 's':
      $pxCount = 10;
      $pixel = [($posX+0)+','+($posY+40), 
                ($posX+10)+','+($posY+40), 
                ($posX+20)+','+($posY+40), 
                ($posX+30)+','+($posY+30), 
                ($posX+20)+','+($posY+20), 
                ($posX+10)+','+($posY+20), 
                ($posX+0)+','+($posY+10), 
                ($posX+10)+','+($posY+0), 
                ($posX+20)+','+($posY+0), 
                ($posX+30)+','+($posY+0)];
      break;
    case 't':
      $pxCount = 8;
      $pixel = [($posX+15)+','+($posY+10), 
                ($posX+15)+','+($posY+20), 
                ($posX+15)+','+($posY+30), 
                ($posX+15)+','+($posY+40), 
                ($posX+0)+','+($posY+0), 
                ($posX+10)+','+($posY+0), 
                ($posX+20)+','+($posY+0), 
                ($posX+30)+','+($posY+0)];
      break;
    case 'u':
      $pxCount = 10;
      $pixel = [($posX+0)+','+($posY+0), 
                ($posX+0)+','+($posY+10), 
                ($posX+0)+','+($posY+20), 
                ($posX+0)+','+($posY+30), 
                ($posX+10)+','+($posY+40), 
                ($posX+20)+','+($posY+40), 
                ($posX+30)+','+($posY+30), 
                ($posX+30)+','+($posY+20), 
                ($posX+30)+','+($posY+10), 
                ($posX+30)+','+($posY+0)];
      break;
    case 'v':
      $pxCount = 9;
      $pixel = [($posX+0)+','+($posY+0), 
                ($posX+0)+','+($posY+10), 
                ($posX+5)+','+($posY+20), 
                ($posX+10)+','+($posY+30), 
                ($posX+15)+','+($posY+40), 
                ($posX+20)+','+($posY+30), 
                ($posX+25)+','+($posY+20), 
                ($posX+30)+','+($posY+10), 
                ($posX+30)+','+($posY+0)];
      break;
    case 'w':
      $pxCount = 13;
      $pixel = [($posX+0)+','+($posY+0), 
                ($posX+0)+','+($posY+10), 
                ($posX+0)+','+($posY+20), 
                ($posX+0)+','+($posY+30), 
                ($posX+0)+','+($posY+40), 
                ($posX+10)+','+($posY+30), 
                ($posX+15)+','+($posY+20), 
                ($posX+20)+','+($posY+30), 
                ($posX+30)+','+($posY+40), 
                ($posX+30)+','+($posY+30), 
                ($posX+30)+','+($posY+20), 
                ($posX+30)+','+($posY+10), 
                ($posX+30)+','+($posY+0)];
      break;
    case 'x':
      $pxCount = 9;
      $pixel = [($posX+0)+','+($posY+0), 
                ($posX+10)+','+($posY+10), 
                ($posX+15)+','+($posY+20), 
                ($posX+20)+','+($posY+30), 
                ($posX+30)+','+($posY+40), 
                ($posX+0)+','+($posY+40), 
                ($posX+10)+','+($posY+30), 
                ($posX+20)+','+($posY+10), 
                ($posX+30)+','+($posY+0)];
      break;
    case 'y':
      $pxCount = 7;
      $pixel = [($posX+0)+','+($posY+0), 
                ($posX+10)+','+($posY+10), 
                ($posX+20)+','+($posY+10), 
                ($posX+30)+','+($posY+0), 
                ($posX+15)+','+($posY+20), 
                ($posX+15)+','+($posY+30), 
                ($posX+15)+','+($posY+40)];
      break;
    case 'z':
      $pxCount = 12;
      $pixel = [($posX+0)+','+($posY+0), 
                ($posX+10)+','+($posY+0), 
                ($posX+20)+','+($posY+0), 
                ($posX+30)+','+($posY+0), 
                ($posX+30)+','+($posY+10), 
                ($posX+20)+','+($posY+20), 
                ($posX+10)+','+($posY+20), 
                ($posX+0)+','+($posY+30), 
                ($posX+0)+','+($posY+40), 
                ($posX+10)+','+($posY+40), 
                ($posX+20)+','+($posY+40), 
                ($posX+30)+','+($posY+40)];
      break;
      case '1':
      $pxCount = 8;
      $pixel = [($posX+5)+','+($posY+10), 
                ($posX+15)+','+($posY+0), 
                ($posX+15)+','+($posY+10), 
                ($posX+15)+','+($posY+20), 
                ($posX+15)+','+($posY+30), 
                ($posX+15)+','+($posY+40), 
                ($posX+5)+','+($posY+40), 
                ($posX+25)+','+($posY+40)];
      break;
    case '2':
      $pxCount = 11;
      $pixel = [($posX+0)+','+($posY+5), 
                ($posX+10)+','+($posY+0), 
                ($posX+20)+','+($posY+0), 
                ($posX+30)+','+($posY+10), 
                ($posX+20)+','+($posY+20), 
                ($posX+10)+','+($posY+20), 
                ($posX+0)+','+($posY+30), 
                ($posX+0)+','+($posY+40), 
                ($posX+10)+','+($posY+40), 
                ($posX+20)+','+($posY+40), 
                ($posX+30)+','+($posY+40)];
      break;
    case '3':
      $pxCount = 10;
      $pixel = [($posX+0)+','+($posY+5), 
                ($posX+10)+','+($posY+0), 
                ($posX+20)+','+($posY+0), 
                ($posX+30)+','+($posY+10), 
                ($posX+20)+','+($posY+20), 
                ($posX+10)+','+($posY+20), 
                ($posX+30)+','+($posY+30), 
                ($posX+20)+','+($posY+40), 
                ($posX+10)+','+($posY+40), 
                ($posX+0)+','+($posY+35)];
      break;
    case '4':
      $pxCount = 10;
      $pixel = [($posX+0)+','+($posY+0), 
                ($posX+0)+','+($posY+10), 
                ($posX+0)+','+($posY+20), 
                ($posX+10)+','+($posY+20), 
                ($posX+20)+','+($posY+20), 
                ($posX+30)+','+($posY+10), 
                ($posX+30)+','+($posY+0), 
                ($posX+30)+','+($posY+20), 
                ($posX+30)+','+($posY+30), 
                ($posX+30)+','+($posY+40)];
      break;
    case '5':
      $pxCount = 12;
      $pixel = [($posX+0)+','+($posY+0), 
                ($posX+0)+','+($posY+10), 
                ($posX+0)+','+($posY+20), 
                ($posX+10)+','+($posY+20), 
                ($posX+20)+','+($posY+20), 
                ($posX+30)+','+($posY+30), 
                ($posX+20)+','+($posY+40), 
                ($posX+10)+','+($posY+40), 
                ($posX+0)+','+($posY+35), 
                ($posX+10)+','+($posY+0), 
                ($posX+20)+','+($posY+0), 
                ($posX+30)+','+($posY+0)];
      break;
    case '6':
      $pxCount = 11;
      $pixel = [($posX+30)+','+($posY+5), 
                ($posX+20)+','+($posY+0), 
                ($posX+10)+','+($posY+0), 
                ($posX+0)+','+($posY+10), 
                ($posX+0)+','+($posY+20), 
                ($posX+0)+','+($posY+30), 
                ($posX+10)+','+($posY+40), 
                ($posX+20)+','+($posY+40), 
                ($posX+30)+','+($posY+30), 
                ($posX+20)+','+($posY+20), 
                ($posX+10)+','+($posY+20)];
      break;
    case '7':
      $pxCount = 8;
      $pixel = [($posX+0)+','+($posY+0), 
                ($posX+10)+','+($posY+0), 
                ($posX+20)+','+($posY+0), 
                ($posX+30)+','+($posY+0), 
                ($posX+25)+','+($posY+10), 
                ($posX+20)+','+($posY+20), 
                ($posX+15)+','+($posY+30), 
                ($posX+15)+','+($posY+40)];
      break;
    case '8':
      $pxCount = 10;
      $pixel = [($posX+10)+','+($posY+0), 
                ($posX+0)+','+($posY+10), 
                ($posX+10)+','+($posY+20), 
                ($posX+20)+','+($posY+20), 
                ($posX+30)+','+($posY+30), 
                ($posX+20)+','+($posY+40), 
                ($posX+10)+','+($posY+40), 
                ($posX+0)+','+($posY+30), 
                ($posX+30)+','+($posY+10), 
                ($posX+20)+','+($posY+0)];
      break;
    case '9':
      $pxCount = 11;
      $pixel = [($posX+20)+','+($posY+20), 
                ($posX+10)+','+($posY+20), 
                ($posX+0)+','+($posY+10), 
                ($posX+10)+','+($posY+0), 
                ($posX+20)+','+($posY+0), 
                ($posX+30)+','+($posY+10), 
                ($posX+30)+','+($posY+20), 
                ($posX+30)+','+($posY+30), 
                ($posX+20)+','+($posY+40), 
                ($posX+10)+','+($posY+40), 
                ($posX+0)+','+($posY+35)];
      break;
    case '0':
      $pxCount = 12;
      $pixel = [($posX+10)+','+($posY+0), 
                ($posX+0)+','+($posY+10), 
                ($posX+0)+','+($posY+20), 
                ($posX+0)+','+($posY+30), 
                ($posX+10)+','+($posY+40), 
                ($posX+20)+','+($posY+40), 
                ($posX+30)+','+($posY+30), 
                ($posX+30)+','+($posY+20), 
                ($posX+30)+','+($posY+10), 
                ($posX+20)+','+($posY+0), 
                ($posX+10)+','+($posY+22.5), 
                ($posX+20)+','+($posY+17.5)];
      break;
    
    case '.':
      $pxCount = 1;
      $pixel = [($posX+15)+','+($posY+40)];
      break;
    case '?':
      $pxCount = 7;
      $pixel = [($posX+0)+','+($posY+10), 
                ($posX+10)+','+($posY+0), 
                ($posX+20)+','+($posY+0), 
                ($posX+30)+','+($posY+10), 
                ($posX+20)+','+($posY+15), 
                ($posX+15)+','+($posY+25), 
                ($posX+15)+','+($posY+40)];
      break;
    case '!':
      $pxCount = 4;
      $pixel = [($posX+15)+','+($posY+0), 
                ($posX+15)+','+($posY+10), 
                ($posX+15)+','+($posY+20), 
                ($posX+15)+','+($posY+40)];
      break;
    
  }
  $pixels.push($pixel);
  $pX += 50;
  $fullPxCount += $pxCount;
}

function drawTheThing() {
    $param[0] = $testi[$counter];
  	$param[0] = parseInt($param[0]);
  	$counter++;
  	$param[1] = $testi[$counter];
  	$param[1] = parseInt($param[1]);
  	$counter++;
  	ctx.beginPath();
    ctx.rect($param[0], $param[1], 8, 8);
  	ctx.fillStyle = "rgba(0,0,0,"+$opacity+")";
  	$opacity -= (1/$fullPxCount) 
  	ctx.fill();
  	ctx.closePath();
    setTimeout(function() {
      $loop++;
      if ($loop < $fullPxCount) {
        drawTheThing();
      }
    }, 50);
};