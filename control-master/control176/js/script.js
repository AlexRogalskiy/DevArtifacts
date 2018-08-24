var radios = document.querySelectorAll('input[type="radio"]');
var current = 0;

function clear(){
  for(var i=0, m=radios.length; i<m; i++){
   radios[i].removeAttribute('checked');
  }
}

setInterval(function(){
  if(current >= radios.length - 1){
    current = 0
  } else {
    current++;
  }
  
clear();  radios[current].setAttribute('checked');
}, 300);
