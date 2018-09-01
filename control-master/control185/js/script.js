		$(document).ready(function(){
		jQuery.fn.center = function () {return this.css({position :"absolute",top: ( $(window).height() - this.height() ) / 2+$(window).scrollTop() + "px",left: ( $(window).width() - this.width()) / 2+$(window).scrollLeft() + "px"});}

		$(window).bind('resize' , function(){$('.element').center()})

		});