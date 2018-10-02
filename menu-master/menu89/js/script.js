/**
 * @name: Navbar
 * @description: Class nav for controlling the navbar
 */
var Navbar = function(container) {
	var that = this;
	
	this.dom = {};
	this.dom.container = container;
	
	/**
	 * @name: init
	 * @description: Initialize elements
	 */
	this.init = function() {
		this.dom.dropdown = {};
		this.dom.dropdown.elem = this.dom.container.find('.dropdown');
		this.dom.dropdown.toggle = this.dom.container.find('.dropdown-toggle');
		
		/** icons in header-nav */
		this.dom.toggleNavbar = this.dom.container.find('.toggle-navbar');
		
		/** navbar */
		this.dom.navbar = {};
		this.dom.navbar.all = this.dom.container.find('.navbar');
		this.dom.navbar.elem = this.dom.container.find('#navbar');
		
		
		/**
		 * Listen to click on dropdown-toggle item on navbar
		 */
		this.dom.dropdown.toggle.on('click', function(e) {
			e.preventDefault();
			
			var $parent = $(this).parent();
			
			if($parent.hasClass('open')) {
				$parent.removeClass('open');
			}
			else {
				/** Hide all dropdown-menus */
				that.dom.dropdown.elem.removeClass('open');
				
				$parent.addClass('open');
			}
		});
		/**
		 * Listen to click event on burger-icon
		 */
		this.dom.toggleNavbar.on('click', function(e) {
			e.preventDefault();
			
			that.showNavbar('navbar');
		});
		/**
		 * @name: showNavbar
		 * @param:
		 * @description: display the targetted element
		 */
		this.showNavbar = function() {
			if(that.dom.navbar.elem.hasClass('open')) {
				that.dom.navbar.elem.removeClass('open');
				that.dom.toggleNavbar.removeClass('open');
			}
			else {
				that.hideNavbar();
				that.dom.navbar.elem.addClass('open');
				that.dom.toggleNavbar.addClass('open');
			}
		};
		/**
		 * @name: hideNavbar
		 * @param: -
		 * @description: hide all navbars
		 */
		this.hideNavbar = function() {
			that.dom.navbar.all.removeClass('open');
			/** close burger-icon */
			that.dom.toggleNavbar.removeClass('open');
		};
	};
};

var navbar = new Navbar($('#main-navbar'));
navbar.init();