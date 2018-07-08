var boxes = document.querySelector(".boxes")
var numClicks = document.querySelector(".js-num-clicks")
var boxWidth = 70;
boxes.style.width = (boxWidth * 4) + 20 + 'px'
  var open = {}
  for(var i = 0; i < 16; i++){
    var box = document.createElement("div")
    if(i == 15){
      box.className = 'open'
    }else{
      box.style.background = i % 2 === 0 ? "#FF4136" : "#111111"
      box.innerHTML = i
    }
    box.setAttribute("data-id", i)
    box.style.width = boxWidth + "px"
    box.style.height = boxWidth + "px"
    boxes.appendChild(box)
  }
  shuffle( boxes.querySelectorAll('div') )
  var openDiv = document.querySelector(".open")
  var pckry = new Packery( boxes, {
    itemSelector: 'div',
    transitionDuration: '0.2s',
    columnWidth: parseInt(openDiv.style.width.replace("px",""))
  });
  document.body.addEventListener("click", move)
  markMovables()
  function markMovables(){
    open.top = parseInt(openDiv.style.top.replace("px",""))
    open.left = parseInt(openDiv.style.left.replace("px",""))
    return Array.prototype.filter.call(document.querySelectorAll(".boxes div"), function(div){
      div.classList.remove('movable')
      var condition =
      /* top */ div.style.top == (open.top - boxWidth) + "px" && div.style.left == open.left + "px" ||
      /* left */ div.style.top == open.top + "px" && div.style.left == (open.left - boxWidth)+"px" ||
      /* right */ div.style.top == open.top + "px" && div.style.left == (open.left + boxWidth)+"px" ||
      /* bottom */ div.style.top == open.top + boxWidth + "px" && div.style.left == open.left+"px"
      if(condition) div.classList.add('movable')
      return condition
    })
  }
  function move(e){
    if(e.target.classList.contains('movable')){
      var div = e.target
      numClicks.innerHTML = parseInt(numClicks.innerHTML) + 1
      var l = parseInt(div.style.left.replace("px",""))
      var t = parseInt(div.style.top.replace("px",""))
      pckry.fit(openDiv, l, t)
      pckry.fit(div, open.left, open.top)
      open.top = t
      open.left = l
      setTimeout(function(){
        if(won()){
          alert('Nice Job!')
        }
        markMovables()
      }, 300)
    }
  }
  function won(){
    var ret = true
    pckry.items.forEach(function(e,i){
      if(e.element.getAttribute("data-id") != i) ret = false
    })
    return ret
  }
  // http://james.padolsey.com/snippets/shuffling-the-dom/
  function shuffle(elems) {
    allElems = (function(){
      var ret = [], l = elems.length
      while (l--) { ret[ret.length] = elems[l]; }
      return ret
    })()
    var shuffled = (function(){
      var l = allElems.length, ret = []
      while (l--) {
        var random = Math.floor(Math.random() * allElems.length),
        randEl = allElems[random].cloneNode(true)
        allElems.splice(random, 1)
        ret[ret.length] = randEl
      }
      return ret
    })(), l = elems.length
    while (l--) {
      elems[l].parentNode.insertBefore(shuffled[l], elems[l].nextSibling)
      elems[l].parentNode.removeChild(elems[l])
    }
  }