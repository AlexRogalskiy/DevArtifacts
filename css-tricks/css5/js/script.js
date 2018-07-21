// declare objects
prefixes = ['hue', 'sat', 'lum'];
sldrs = [];
rptrs = [];
blcks = [];
hslBlock = document.querySelector('.hslBlock');

// grab each slider, value reporter and color block
for (i = 0; i < 3; i++) {
  sldr = document.querySelector('.' + prefixes[i] + 'Slider');
  rptr = document.querySelector('.' + prefixes[i] + 'Reporter');
  blck = document.querySelector('.' + prefixes[i] + 'Block');  
  
  // push dom objects to arrays
  sldrs.push(sldr);
  rptrs.push(rptr);
  blcks.push(blck);
  
  // set initial value of reporter
  rptr.innerHTML = sldr.value;
}

// set initial block colors
colorMix();

// loop through each object and act on it
// can't be in the above loop for some weird scoping reason?
// http://stackoverflow.com/questions/6400320/javascript-array-addeventlistener
// variables? global scope? HOW DO I JAVASCRIPT
for (i = 0; i < 3; i++) {
  sldr = sldrs[i];
  rptr = rptrs[i];
  blck = blcks[i];
  setListeners(sldr,rptr, blck);
}

function setListeners (sldr,rptr, blck) {
  sldr.addEventListener('change', function(){
    updateValue(sldr,rptr);
    colorMix(sldr,blck);
  }, false);
};

function updateValue(sldr,rptr) { 
  rptr.innerHTML = sldr.value;
};

function colorMix() {
  hslBlock.style.background = 'hsl(' + sldrs[0].value + ',' + sldrs[1].value + '%,' + sldrs[2].value + '%)';
  
  blcks[0].style.backgroundColor = 'hsl(' + sldrs[0].value + ',90%, 50%)';
  blcks[1].style.backgroundColor = 'hsl(' + sldrs[0].value + ',' + sldrs[1].value + '%, 50%)';
  blcks[2].style.backgroundColor = 'hsl(1,0%,' + sldrs[2].value + '%)';
}

