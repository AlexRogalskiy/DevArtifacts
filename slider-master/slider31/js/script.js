$(window).load(function(){
	cardSlider();
});

function cardSlider(){
	var speed = 300;
	var cont = $(".slider");
	var imgS = cont.find("img").size();
	var wrapW = cont.outerWidth();

	cont.css("height", wrapW/100*76/9*5);
	liClass();
	$(".btn_next").click(function(){
		var $cut = cont.find("img").eq(0).detach();
		cont.append($cut);
		liClass();
	});

	$(".btn_prev").click(function(){
		var $cut = cont.find("img").eq(imgS-1).detach();
		cont.prepend($cut);
		liClass();
	});

	$(window).resize(function(){
		liClass();
		wrapH = cont.find(".lifv").outerHeight();
		cont.css("height", wrapH);
	});

	function liClass(){
		cont.find("img").attr("class", "");
		cont.find("img").eq(5).addClass("lifr");
		cont.find("img").eq(6).addClass("lifv");
		cont.find("img").eq(7).addClass("lis");

		cont.find("img").each(function(){
			if($(this).attr("class") == ""){
				$(this).css("z-index", 1).stop().animate({"width": 60+"%", "top": 10+"%", "left": 0, "opacity": 0, "margin-top": 0, "margin-left": 0}, speed);
			} else {
				$(".lifr").css("z-index", 3).stop().animate({"width": 60+"%", "top": 10+"%", "left": 0, "opacity": .5, "margin-top": 0, "margin-left": 0}, speed);
				$(".lifv").css("z-index", 4).stop().animate({"width": 76+"%", "top": 0, "left": 50+"%", "opacity": 1, "margin-top": 0, "margin-left": -38+"%"}, speed);
				$(".lis").css("z-index", 2).stop().animate({"width": 60+"%", "top": 10+"%", "left": 40+"%", "opacity": .5, "margin-top": 0, "margin-left": 0}, speed);
			}
		});
	}
}