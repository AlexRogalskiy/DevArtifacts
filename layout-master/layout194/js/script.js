var sliderF, sliderS, sliderT, sliderFR, sliderFV, sliderSX, sliderSV, sliderFVT;
var speed = 1000;
var pause = 3000;
var option1 = {
	pager: false,
	controls: false,
	useCSS: false,
	easing: 'easeOutExpo',
	speed: speed,
	pause: pause,
	oneToOneTouch: false,
	touchEnabled: false,
	auto: true
}
var option2 = {
	mode: 'vertical',
	pager: false,
	controls: false,
	useCSS: false,
	easing: 'easeOutExpo',
	speed: speed,
	pause: pause,
	oneToOneTouch: false,
	touchEnabled: false,
	auto: true
}

$(window).load(function(){

});

$(function(){
	slideEvent();
});

$(window).resize(function(){
	sliderF.reloadSlider();
	sliderS.reloadSlider();
	sliderT.reloadSlider();
	sliderFR.reloadSlider();
	sliderFV.reloadSlider();
	sliderSX.reloadSlider();
	sliderSV.reloadSlider();
	sliderFVT.reloadSlider();
  sliderET.reloadSlider();
});

function slideEvent(){
	sliderF = $('.slide_number ul').bxSlider(option2);
	sliderS = $('.section1 .cont2 .box1 ul').bxSlider(option1);
	sliderT = $('.section1 .cont2 .box2 ul').bxSlider(option1);
	sliderFR = $('.section1 .cont3 ul').bxSlider(option1);
	sliderFV = $('.section2 .cont1 > ul').bxSlider(option1);
	sliderFVT = $('.section2 .cont1 .box2 ul').bxSlider(option2);
	sliderSX = $('.section2 .cont2 .box2 ul').bxSlider(option1);
	sliderSV = $('.section2 .cont2 .box4 ul').bxSlider(option1);
	sliderET = $('.section2 .cont3 ul').bxSlider(option1);

	$("#bxControlNav .btn_next").on("click", function(){
		sliderF.goToNextSlide();
		sliderS.goToNextSlide();
		sliderT.goToNextSlide();
		sliderFR.goToNextSlide();
		sliderFV.goToNextSlide();
		sliderFVT.goToNextSlide();
		sliderSX.goToNextSlide();
		sliderSV.goToNextSlide();
		sliderET.goToNextSlide();    
	});
	$("#bxControlNav .btn_prev").on("click", function(){
		sliderF.goToPrevSlide();
		sliderS.goToPrevSlide();
		sliderT.goToPrevSlide();
		sliderFR.goToPrevSlide();
		sliderFV.goToPrevSlide();
		sliderFVT.goToPrevSlide();
		sliderSX.goToPrevSlide();
		sliderSV.goToPrevSlide();
		sliderET.goToPrevSlide();    
	});

	$("#bxControlNav").on("mouseenter", function(){
		sliderF.stopAuto();
		sliderS.stopAuto();
		sliderT.stopAuto();
		sliderFR.stopAuto();
		sliderFV.stopAuto();
		sliderFVT.stopAuto();
		sliderSX.stopAuto();
		sliderSV.stopAuto();
		sliderET.stopAuto();
	});

	$("#bxControlNav").on("mouseleave", function(){
		sliderF.startAuto();
		sliderS.startAuto();
		sliderT.startAuto();
		sliderFR.startAuto();
		sliderFV.startAuto();
		sliderFVT.startAuto();
		sliderSX.startAuto();
		sliderSV.startAuto();
		sliderET.startAuto();
	});
}