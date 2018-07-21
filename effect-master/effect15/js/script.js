window.onload = function() {

var elInput = document.querySelector("#typeRange");
var filterImg = document.querySelector("#filterImg"); 
var Img = document.querySelector("#filterImg img");
var ImgW = parseInt(window.getComputedStyle(Img,null).getPropertyValue("width"));


var RB = document.querySelectorAll(".radioDiv [type=radio]");

var oFilter ={
	Blur:{       minim:0, maxim:100,  val:50,   div:10,    u:'px', filter:"blur"},
	Brightness:{ minim:0, maxim:100, val:15,    div:10,   u:'',   filter:"brightness"},
	Contrast:{   minim:0, maxim:100, val:25,    div:10,   u:'',   filter:"contrast"},
	//DropShadow:{},
	Grayscale:{  minim:0, maxim:100, val:100,   div:100, u:'',   filter:"grayscale"},
	HueRotate:{  minim:0, maxim:360, val:230,   div:1,   u:'deg',filter:"hue-rotate"},
	Invert:{     minim:0, maxim:100, val:100,    div:100, u:'',   filter:"invert"},
	//Opacity:{    minim:0, maxim:100, val:100, div:100, u:'',   filter:"opacity"},
	Saturate:{   minim:0, maxim:100,  val:30,   div:10,   u:'',   filter:"saturate"},
	Sepia:{      minim:0, maxim:100, val:100,   div:100, u:'',   filter:"sepia"}

}

var oFilterKeys = Object.keys(oFilter);

var controlTypeRange = document.querySelectorAll("#control [type=range]");

// initial setting CSS FILTER
var radioChecked = document.querySelector("[type=radio]:checked");
var initialFilter = oFilter[radioChecked.value].filter;
var initialValue = oFilter[radioChecked.value].val;
var initialDiv = oFilter[radioChecked.value].div;
var initialU = oFilter[radioChecked.value].u; 

Img.style.webkitFilter = initialFilter+"("+initialValue/initialDiv +initialU+")";
Img.style.filter = initialFilter+"("+initialValue/initialDiv +initialU+")";
console.log(initialFilter+"("+initialValue+initialU+")")

// IMAGE width 
elInput.addEventListener('input',function(){ 
    var w = this.value;
	filterImg.style.width = ((ImgW * w)/100)+"px";
}, false);



for(var i = 0; i < oFilterKeys.length; i++){
	var filter = oFilter[oFilterKeys[i]].filter;
	
	var radio = document.querySelector("#"+oFilterKeys[i]+" [type=radio]");
	var range = document.querySelector("#"+oFilterKeys[i]+" [type=range]");
	
	if(radio.checked == true){range.disabled = false}else{range.disabled = true};
	    
	var display = document.querySelector("#"+oFilterKeys[i]+"span");
	
	// RADIO
	radio.addEventListener('change',function(){
		var elId = this.parentNode.parentNode.id;
		var range = document.querySelector("#"+elId+" [type=range]");
		
		var divisor = oFilter[elId].div;
		var rangeValue = (range.value)/divisor;
		var thisFilter = oFilter[elId].filter;
		var u = oFilter[elId].u; 
		
		Img.style.webkitFilter = thisFilter+"("+rangeValue+u+")";
		Img.style.filter = thisFilter+"("+rangeValue+u+")";
		
		for( var r= 0; r < controlTypeRange.length; r++ ){
			if(controlTypeRange[r].disabled == false){controlTypeRange[r].disabled = true;}
			range.disabled = false;
		}
		
	},false);
	
	// RANGE	
	range.addEventListener('input',function(){
		
		var divisor = oFilter[this.parentNode.id].div;
		var rangeValue = this.value/divisor;
		var thisFilter = oFilter[this.parentNode.id].filter;
		var u = oFilter[this.parentNode.id].u;
		
		
		var display = document.querySelector("#"+this.parentNode.id+" span");		
		
		Img.style.webkitFilter = thisFilter+"("+rangeValue+u+")";
		Img.style.filter = thisFilter+"("+rangeValue+u+")";
		
		display.innerHTML = this.value/divisor + u;	
	},false)
}
}