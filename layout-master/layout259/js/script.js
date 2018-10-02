var	$parent = $("#main"),
		$aside = $("#aside"),
		$asideTarget = $aside.find(".aside--details"),
		$asideClose = $aside.find(".close"),
		$tilesParent = $(".tiles-a"),
		$tiles = $tilesParent.find("a"),
		slideClass = "show-detail";

		// tile click
		$tiles.on("click", function(e){
			e.preventDefault();
			e.stopPropagation();
			if(!$("html").hasClass(slideClass)){
				$tiles.removeClass("active");
				$(this).addClass("active");
				$(this).attr("aria-expanded","true");
				loadTileData($(this));
			}else{
				killAside();
				$(this).attr("aria-expanded","false");
			}
		});

		// kill aside
		$asideClose.on("click", function(e){
			e.preventDefault();
			killAside();
		});

		// load data to aside
		function loadTileData(target){
			var $this = $(target),
					itemHtml = $this.find(".details").html();
					$asideTarget.html(itemHtml);
					showAside();
		}

		// show/hide aside
		function showAside(){
			if(!$("html").hasClass(slideClass)){
				$("html").toggleClass(slideClass);
				$aside.attr("aria-hidden","false");
				focusCloseButton();
			}
		}
		
		// handle esc key
		window.addEventListener("keyup", function(e){

			// grab key pressed
			var code = (e.keyCode ? e.keyCode : e.which);
			
			// escape
			if(code === 27){
				killAside();
			}

		}, false);

		// kill aside
		function killAside(){
			if($("html").hasClass(slideClass)){
				$("html").removeClass(slideClass);
				sendFocusBack();
				$aside.attr("aria-hidden","true");
				$tiles.attr("aria-expanded","false");
			}
		}

		// send focus to close button
		function focusCloseButton(){
			$asideClose.focus();	
		}

		// send focus back to item that triggered event
		function sendFocusBack(){
			$(".active").focus();
		}

		// handle body click to close off-canvas
		$parent.on("click",function(e){
			if($("html").hasClass(slideClass)){
				killAside();
			}
		});
