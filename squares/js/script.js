var list1 = [
50,35,29,
35,27,15,
29,25,33,
25,9,4,
9,2,16,
27,,8,
8,19,,
15,17,,
17,11,,
4,37,,
2,,7,
7,18,,
11,,6,
6,24,,
18,,42
];

var list2 = [
81,51,56,
51,43,30,
56,55,38,
43,,8,
8,35,,
30,29,,
29,,31,
35,,2,
2,33,,
31,,64,
38,18,,
18,,20,
55,,16,
16,39,3,
3,4,,
20,1,,
1,,5,
4,9,,
5,,14
]

var list3 = [
  60,50,24,
  24,22,26,
  22,14,2,
  50,,23,
  23,27,7,
  2,28,,
  14,,8,
  8,6,,
  7,16,,
  27,,12,
  12,15,,
  6,,13,
  13,,17,
  16,,4,
  4,21,,
  21,3,,
  3,,18
  
 ]


var canvas = document.getElementById("c");
var ctx = canvas.getContext("2d");
ctx.font="10px Georgia";
ctx.strokeStyle= "#000000";
drawPerfectRect(list1,400 / (50+35+27),0,0);
drawPerfectRect(list2,400 / (81+51+43),410,0);
drawPerfectRect(list3,400 / (60+50),820,0);
function drawPerfectRect(l,scale,ox,oy)
{
var squares = [];


ctx.strokeRect( ox,oy,l[0] * scale,l[0]* scale );
ctx.fillText(l[0],ox+l[0]*0.5*scale-3,oy+l[0]*0.5*scale+2);
squares[l[0]] = {x:0,y:0};
  
for ( var i = 0; i < l.length; i+=3 )
{
    var parent = squares[l[i]];
    var right = l[i+1];
    if ( right != null )
    {
        squares[right] = {x:parent.x + l[i],y:parent.y };
        ctx.strokeRect( ox+(parent.x + l[i])*scale,oy+parent.y * scale,right*scale,right*scale );
       ctx.fillText(right,ox+(parent.x + l[i] + right*0.5)*scale-3,oy+(parent.y + right*0.5)*scale+2);
    }
    var down = l[i+2];
    if ( down != null )
    {
      squares[down] = {x:parent.x,y:parent.y + l[i]};
      ctx.strokeRect( ox+parent.x*scale ,oy+(parent.y + l[i])*scale,down*scale,down*scale );
     ctx.fillText(down,ox+(parent.x +  down*0.5)*scale-3,oy+(parent.y +l[i] + down*0.5)*scale+2);
    }
}
}
