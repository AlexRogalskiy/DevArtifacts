(function($){
  //Author: Brady Sammons
  //URL: www.bradysammons.com
	/* -------------------------------------------------------- */ 
	/*	//set Global variables
	/* -------------------------------------------------------- */ 
	var cards = $(".card-drop"),
		toggler = cards.find(".toggle"),
		links = cards.find("ul>li>a"),
		li = links.parent('li'),
		count = links.length,
		width = 100;

		//set z-Index of drop Items
		li.each(function(i){
			$(this).css("z-index" , count - i); //invert the index values
		});

		//set top margins & widths of li elements
		function setClosed(){
			li.each(function(index){
				 $(this).css("top" , index * 4)
				 		.css("width" , (width - index * .5) + "%" )
				 		.css("margin-left" , (index * .25) + "%" )
			});
			li.addClass('closed');
			toggler.removeClass("active");
		}
		setClosed();

	/* -------------------------------------------------------- */ 
	/*	Toggler Click handler
	/* -------------------------------------------------------- */ 
	toggler.on("mousedown" , function(){
		var $this = $(this); //cache $(this)
		//if the menu is active:
		if($this.is(".active")){
			setClosed();
		}else{
			//if the menu is un-active:
			$this.addClass("active");
			li.removeClass('closed');
			//set top margins
			li.each(function(index){
				 $(this).css("top" , 60 * (index + 1))
				 		.css("width" , "100%")
				 		.css("margin-left" , "0px");
			});
		}
	});

	/* -------------------------------------------------------- */ 
	/*	Links Click handler
	/* -------------------------------------------------------- */ 
	links.on("click" , function(e){
		var $this = $(this),
			label = $this.data("label");
			icon = $this.children("i").attr("class");
			
			li.removeClass('active');
		if($this.parent("li").is("active")){
			$this.parent('li').removeClass("active");
		}else{
			$this.parent("li").addClass("active");
		}
		toggler.children("span").text(label);
		toggler.children("i").removeClass().addClass(icon);
		setClosed();
		e.preventDefault;
	});

})(jQuery);