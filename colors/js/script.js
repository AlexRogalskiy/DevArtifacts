var Color = function(r,g,b){
  this.r = Math.abs(r)
  this.g = Math.abs(g)
  this.b = Math.abs(b)
  if(typeof r === "string"){
    var v = fromHex(r)
    this.r = v[0]
    this.g = v[1]
    this.b = v[2]
  }
}
Color.prototype.diff = function(c){
  return new Color(
    this.r - c.r,
    this.g - c.g,
    this.b - c.b
  )
}
Color.prototype.dividedBy = function(n){
  return new Color(
    this.r / n,
    this.g / n,
    this.b / n
  )
}
Color.prototype.approach = function(c,c2){
  return new Color(
    this.r > c.r ? this.r - c2.r : this.r + c2.r,
    this.g > c.g ? this.g - c2.g : this.g + c2.g,
    this.b > c.b ? this.b - c2.b : this.b + c2.b
  )
}
Color.prototype.toHex = function(){
  return "#" + 
    pad(Math.round(this.r).toString(16)) +
    pad(Math.round(this.g).toString(16)) +
    pad(Math.round(this.b).toString(16))
}
function fromHex(str){
  return str
    .substr(1)
    .match(/.{1,2}/g)
    .map(n => parseInt(n, 16))
}
function pad(n){
  var str = "" + n
  var pad = "00"
  return pad.substring(0, pad.length - str.length) + str
}
function colorsBetween(c1,c2, n){
  c1 = new Color(c1)
  c2 = new Color(c2)
  var diff = c1.diff(c2).dividedBy(n + 1)
  var out = [c1]
  for(var i = 0; i < n; i++){
    out.push(out[i].approach(c2, diff))
  }
  out.push(c2)
  return out.map(c => c.toHex())
}
function reset(){
  var cols = colorsBetween(c1.value,c2.value,parseInt(n.value))
  ex.innerHTML = ''
  pre.innerHTML = 'colorsBetween("'+c1.value+'","'+c2.value+'",'+n.value+')'
  cols.map(col => {
    ex.innerHTML += "<div style='background:"+col+"'><span>"+ col +"</span></div>"
  })
}
reset()