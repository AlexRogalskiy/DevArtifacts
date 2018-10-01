(function($){
	var dropper = $("a#drop"),
		menu = $("nav>ul");
		subMenu = $("nav>ul>li.submenu");
		link = menu.find("li"),

		dropper.on("click" , function(e){
			menu.slideToggle();
			e.preventDefault();
		});

		$(window).resize(function(){
			var winWidth = $(this).width();
			if(winWidth > 800 && menu.is(":hidden")){
				menu.removeAttr("style");
			}
		});

		link.on("click" , function(){
			var winWidth = $(window).width();
			if(winWidth < 800 && !$(this).hasClass("submenu")){
				menu.slideToggle();	
			}
		});
		subMenu.hover(function(){
			$(this).children("ul").stop().slideDown();
		},function(){
			$(this).children("ul").stop().slideUp();
		});
})(jQuery);