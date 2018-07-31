var charList = [" ","0","1","2","3","4","5","6","7","8","9","!","\"","$","%","&","/","(",")","=","?","+","*","#","'",":",";","-",".","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

var randomAirportNames = ["EDINBURGH","DYCE","GLASGOW","LONDON HEATHROW","JFK INTERNATIONAL","FRANKFURT","BERLIN","PARIS","ROME","WASHINGTON DC","HONG KONG","SYDNEY","DUBLIN","MOON","SKIPHOL","WARSAW","HONOLULU","ZURICH"];

$(document).ready(function(){
  $(".flip").each(function(index){
    $(this).append("<ul></ul>");
    $(this).attr("value"," ");
    for(var i=0;i<charList.length;i++){
      var char = charList[i];
      $("ul", this).append("<li>"+char+"</li>");
    }
  });
  $("input").focus();
  var msg = "EDINBURGH";
  $("input").val(msg);
  var msgEx = msg.split("");
  for(var k=0;k<msgEx.length;k++){
    switchChar(msgEx[k],k); 
  }
  setInterval(function(){
    if($("input").val() == "EDINBURGH"){
      var random = Math.round(Math.random()*randomAirportNames.length);
      var msg = randomAirportNames[random]+"                                    ";
      var msgEx = msg.split("");
      for(var k=0;k<msgEx.length;k++){
        switchChar(msgEx[k],k); 
      }
    }
  },8000);
});

function switchChar(char,n){
  var current = $(".flip").eq(n).attr("value");
  var start = 0;
  for(var i=0;i<charList.length;i++){
    if(charList[i] == current){
      start = i;
      break;
    } 
  }
  var complete = false;
  for(var i=start;i<charList.length;i++){
    if(charList[i] == char){
      complete = true;
      break;
    }
    $(".flip").eq(n).attr("value",char);
    $(".flip").eq(n).find("ul").animate({top: "-=70px"},100);
  }
  if(complete == false){
    $(".flip").eq(n).find("ul").animate({top: "0px"},100);
    start = 0;
     for(var i=start;i<charList.length;i++){
      if(charList[i] == char){
        break;
        complete = true;
      }
      $(".flip").eq(n).attr("value",char);
      $(".flip").eq(n).find("ul").animate({top: "-=70px"},100);
    }
  }
}

$("input").keyup(function(event){
  var keycode = (event.keyCode ? event.keyCode : event.which);
	if(keycode == '13'){
    var msg = $("input").val().toUpperCase()+"                  ";
    var msgEx = msg.split("");
    for(var k=0;k<msgEx.length;k++){
      switchChar(msgEx[k],k); 
    }
	}
});