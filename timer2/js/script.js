

var clock = document.querySelector(".clock");
setInterval((function count(){
  var now = new Date();
  var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(),23,59,59);
  var pos = (100 * (now - startOfDay) / (endOfDay - startOfDay)).toFixed(3);
  clock.innerHTML = pos + "%";
  return count
})(),1000)