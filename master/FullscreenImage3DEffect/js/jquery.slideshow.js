/**
 * Fullscreen Image 3d effect
 * http://www.codrops.com/
 *
 * Copyright 2011, Pedro Botelho
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Date: Mon Oct 31 2011
 */
(function( window, $, undefined ) {
	
	// to keep track of window's width and height
	$.Window				= function() {
		this._getSize();
		this._initEvents();
	};
	
	$.Window.prototype 		= {
		_getSize			: function() {
		
			this.width	= $( window ).width();
			this.height	= $( window ).height();
		
		},
		_initEvents			: function() {
			
			var instance = this;
			
			$( window ).bind('resize.Window', function( event ) {
			
				instance._getSize();
				return false;
			
			});
		
		}
	}
	
	$.Slideshow 			= function( options, element ) {
		
		// the fd-wrapper.
		this.$el			= $( element );
		
		// the images.
		var $imgs			= this.$el.children('img');
		
		this.$imgs			= $imgs;
		
		// remove the images from the DOM.
		$imgs.remove();
		
		// total number of images.
		this.imagesCount	= this.$imgs.length;
		
		if( this.imagesCount === 0 ) 
			return;
		
		// initialize Window
		$.data( window, 'window', new $.Window() );
		
		// preload small images
		var instance	= this,
			loaded		= 0;
			
		for( var i = 0; i < this.imagesCount; ++i ) {
		
			$('<img/>').load( function() {
			
				++loaded;
				
				if( loaded === instance.imagesCount ) {
					
					// init..
					instance._create( options );
				
				}
				
			}).attr( 'src', this.$imgs.eq(i).attr('src') );
		
		}
		
	};
	
	$.Slideshow.defaults 	= {
		current		: 0,			// index of current image
		width		: 600,			// image's width
		height		: 400,			// image's height
		perspective	: 550,			// the webkit-perspective value
		speed		: 750,			// rotation transition speed
		easing		: 'ease-in-out',// rotation transition easing 	
		onLoad		: function() { return false; } // fired when the slideshow is initialized
	};
	
	$.Slideshow.prototype 	= {
		_validateOptions	: function() {
			
			if( this.options.current < 0 || this.options.current >= this.imagesCount )
				this.options.current = 0;
			
		},
		_create 			: function( options ) {
			
			this.options 	= $.extend( true, {}, $.Slideshow.defaults, options );
			
			this._validateOptions();
			
			new $.Slideshow3d( this.options, this.$imgs, this.$el );
			
		}
	};
	
	$.Slideshow3d 			= function( options, $imgs, $el ) {
		this._create( options, $imgs, $el );
	};
	
	$.Slideshow3d.prototype = {
		_create 			: function( options, $imgs, $el ) {
			
			// the options.
			this.options 	= options;
			
			// the fd-wrapper.
			this.$wrapper	= $el;
			
			// index of current image.
			this.current	= options.current;
			
			// the slideshow's images.
			this.$imgs		= $imgs;
			
			// build the page template.
			this._construct();
			
			// initialize some events.
			this._initEvents( options );
			
			// show the current image.
			this._showImage( options.current );
			
			// start preloading the large images.
			this.$imgs.each( function(i) {
				
				var $img	= $(this);
				$('<img/>').attr( 'src', $img.data('bgimg') );
				
			});
			
		},
		_construct			: function() {
			
			$('#pageTmpl').tmpl({}).appendTo( this.$wrapper );
			
			var instance = this;
			
			this.$wrapper.children('div.fd-box-wrapper').css( '-webkit-perspective', this.options.perspective );
			
			this.$boxes				= this.$wrapper.find('div.fd-box-upper, div.fd-box-lower');
			this.$upperBox			= this.$boxes.eq(0);
			this.$lowerBox			= this.$boxes.eq(1);
			
			this.$description		= this.$wrapper.find('h2.fd-title');				
				
			// fd-image.
			this.$boxes.find('div.fd-image').css({
				width		: this.options.width,
				height		: this.options.height / 2,
				marginLeft	: - this.options.width / 2
			});	
				
			this.$FDNav				= this.$lowerBox.find('ul.fd-nav');
			
			this.$FDNav.find('a').bind('click.Slideshow', function( event ) {
				
				instance.current	= $(this).parent().index();
				instance._showImage( instance.current );
				return false;
				
			});
			
			this.$triggerFullscreenOn	= this.$upperBox.find('a.fd-option-fullscreen');
			this.$loading				= this.$upperBox.find('div.fd-loading');
			this.$triggerFullscreenOff	= this.$upperBox.find('a.fd-option-zoomout');
			
			if( !Modernizr.backgroundsize )
				this.$triggerFullscreenOn.remove();
			
			// set the size for each side of the 3d boxes.
			this._setSidesDim();
			
			// position the navigation list correctly.
			this.$FDNav.css({
				marginLeft	: - this.$FDNav.width() / 2
			});
			
			this.$upperBoxWrapper	= this.$upperBox.parent();
			this.$lowerBoxWrapper	= this.$lowerBox.parent();
			
			// position the lower box.
			// set sizes for the outer wrapper.
			// show front sides for both boxes.
			this._retouch();
			
			if( Modernizr.backgroundsize ) {
			
				// show fullscreen image
				this.$triggerFullscreenOn.bind('click.Slideshow', function( event ) {
				
					instance._showImageFullscreen();
					return false;
			
				});
				
				// close fullscreen image
				this.$triggerFullscreenOff.bind('click.Slideshow', function( event ) {
				
					instance._hideImageFullscreen();
					return false;
					
				});	
				
				// after rotating, remove the transition property.
				this.$upperBox.bind( 'webkitTransitionEnd.Slideshow', function( event ) { 
						
					instance._removeTransition();
				
				});
			
			}
			
			this.options.onLoad();
			
		},
		_retouch			: function() {
			
			var win					= $.data( window, 'window' )
			
			// show front face for both boxes.
			this.$boxes.css({
				'-webkit-transform' : 'translate3d(0px, 0px, -' + Math.floor( win.height / 2 ) / 2 + 'px)'
			});
			
			// the lower box wrapper has top = window's height / 2.
			this.$lowerBoxWrapper.css({
				top		: Math.floor( win.height / 2 )
			});
			
			this.$wrapper.css({
				width	: win.width,
				height	: win.height
			});
		
		},
		_setSidesDim		: function() {
			
			var win			= $.data( window, 'window' ),
				frontCss	= {
					'width'				: win.width,
					'height'			: win.height / 2,
					'-webkit-transform'	: 'rotate3d(0,1,0,0deg) translate3d(0,0,' + Math.floor( win.height / 2 ) / 2 + 'px)'
				},
				backCss		= {
					'width'				: win.width,
					'height'			: win.height / 2,
					'-webkit-transform'	: 'rotate3d(0,1,0,180deg) translate3d(0,0,' + Math.floor( win.height / 2 ) / 2 + 'px)'
				},
				rightCss	= {
					'width'				: win.height / 2,
					'height'			: win.height / 2,
					'-webkit-transform'	: 'rotate3d(0,1,0,90deg) translate3d(0,0,' + Math.floor( win.width / 2 ) + 'px)',
					'left'				: win.width / 2 - win.height / 4
				},
				leftCss		= {
					'width'				: win.height / 2,
					'height'			: win.height / 2,
					'-webkit-transform'	: 'rotate3d(0,1,0,-90deg) translate3d(0,0,' + Math.floor( win.width / 2 ) + 'px)',
					'left'				: win.width / 2 - win.height / 4
				},
				topCss		= {
					'width'				: win.width,
					'height'			: win.height / 2,
					'-webkit-transform'	: 'rotate3d(1,0,0,90deg) translate3d(0,0,' + Math.floor( win.height / 2 ) / 2 + 'px)'
				},
				bottomCss	= {
					'width'				: win.width,
					'height'			: win.height / 2,
					'-webkit-transform'	: 'rotate3d(1,0,0,-90deg) translate3d(0,0,' + Math.floor( win.height / 2 ) / 2 + 'px)'
				};
			
			this.$boxes.find('div.fd-front').css(frontCss);
			this.$boxes.find('div.fd-back').css(backCss);
			this.$boxes.find('div.fd-right').css(rightCss);
			this.$boxes.find('div.fd-left').css(leftCss);
			this.$boxes.find('div.fd-top').css(topCss);
			this.$boxes.find('div.fd-bottom').css(bottomCss);
			
			if( !Modernizr.csstransforms3d ) {
				this.$boxes.find('div.fd-back, div.fd-right, div.fd-left, div.fd-top, div.fd-bottom').hide();
			}
			
		},
		_initEvents			: function() {
			
			var instance = this;
			
			// resize window event
			$(window).bind('resize.Slideshow', function( event ) {
				
				var win			= $.data( window, 'window' );
				
				// set the size for each side of the 3d boxes
				instance._setSidesDim();
				
				instance._retouch();
				
				if( !Modernizr.csstransforms3d ) {
					
					instance.$boxes.find('div.fd-front').show();
					
				}
				
			});
		
		},
		_showImage			: function( pos ) {
			
			// sets the current image (small image);
			
			var $currentImg	= this.$imgs.eq( pos );
			
			// set the current navigation's element
			this.$FDNav
				.children( 'li' )
				.removeClass( 'fd-nav-current' )
				.eq( pos )
				.addClass( 'fd-nav-current' );
			
			// set the right image for both boxes' fd-image
			this.$boxes.find('div.fd-image').css({
				'background-image'	: 'url(' + $currentImg.attr('src') + ')'
			});
			
			// set description
			this.$description.text( $currentImg.attr('title') );
			
		},
		_showImageFullscreen: function() {
			
			// sets the bg image for the bottom side of the upper box and the top side of the lower box.
			
			var $currentImg	= this.$imgs.eq( this.current ),
				bgImg		= $currentImg.data('bgimg'),
				instance	= this;
			
			// preload large image
			
			// show loading status
			this.$loading.show();
			
			$('<img/>').load( function() {
				
				// hide loading status
				instance.$loading.hide();
				
				// gets the right sizes for the fullscreen image
				var imgdim 		= instance._getImageDim( bgImg ),
					
					$sideTop	= instance.$lowerBox.find('div.fd-top'),
					$sideBottom	= instance.$upperBox.find('div.fd-bottom');
					
				// set the bg image for the correct sides of each box
				$sideTop.css({
					'background-image'		: 'url(' + bgImg + ')',
					'background-position'	: imgdim.left + 'px ' + ( - ( instance.$lowerBoxWrapper.offset().top - imgdim.top ) ) + 'px',
					'background-size'		: imgdim.width + 'px ' + imgdim.height + 'px'
				});
				$sideBottom.css({
					'background-image'		: 'url(' + bgImg + ')',
					'background-position'	: imgdim.left + 'px ' + ( - ( instance.$upperBoxWrapper.offset().top - imgdim.top ) ) + 'px',
					'background-size'		: imgdim.width + 'px ' + imgdim.height + 'px'
				});
				
				var win			= $.data( window, 'window' );
				
				if( Modernizr.csstransforms3d ) {
				
					// adds the transition property to the boxes
					instance._addTransition();
					
					// rotate both boxes to reveal the fullscreen image
					instance.$upperBox.css({
						'-webkit-transform': 'rotate3d(1,0,0,90deg) translate3d(0,0,' + Math.floor( win.height / 2 ) / 2 + 'px)'
					});
					
					instance.$lowerBox.css({
						'-webkit-transform': 'rotate3d(1,0,0,-90deg) translate3d(0,0,' + Math.floor( win.height / 2 ) / 2 + 'px)'
					});
				
				}
				else {
					
					instance.$boxes.find('div.fd-front').hide(),
					$sideTop.show();
					$sideBottom.show();
				
				}
				
			}).attr( 'src', bgImg );
			
		},
		_hideImageFullscreen: function() {
			
			var win			= $.data( window, 'window' );
			
			if( Modernizr.csstransforms3d ) {
				
				this._addTransition();
				
				// rotate the boxes back to the front side
				this.$boxes.css({
					'-webkit-transform': 'translate3d(0,0,-' + Math.floor( win.height / 2 ) / 2 + 'px)'
				});
				
			}
			else {
				
				this.$boxes.find('div.fd-front').show();
				this.$lowerBox.find('div.fd-top').hide();
				this.$upperBox.find('div.fd-bottom').hide();
			
			}
		
		},
		_addTransition		: function() {
			
			var transition	= '-webkit-transform ' + this.options.speed + 'ms ' + this.options.easing;
			this.$boxes.css( '-webkit-transition', transition );
		
		},
		_removeTransition	: function() {
		
			this.$boxes.css( '-webkit-transition', '' );
			
		},
		// gets the image size and position in order to make it fullscreen and centered.
		_getImageDim		: function( img ) {
			
			var $img    = new Image();
			
			$img.src    = img;
			
			var win		= $.data( window, 'window' ),
				w_w		= win.width,
				w_h		= win.height,
				r_w		= w_h / w_w,
				i_w		= $img.width,
				i_h		= $img.height,
				r_i		= i_h / i_w,
				new_w, new_h, new_left, new_top;
					
			if( r_w > r_i ) {
				
				new_h	= w_h;
				new_w	= w_h / r_i;
			
			}
			else {
			
				new_h	= w_w * r_i;
				new_w	= w_w;
			
			}
					
			return {
				width	: new_w,
				height	: new_h,
				left	: ( w_w - new_w ) / 2,
				top		: ( w_h - new_h ) / 2
			};
		
		}
	};
	
	var logError 				= function( message ) {
		
		if ( this.console ) {
			
			console.error( message );
			
		}
		
	};
	
	$.fn.slideshow 				= function( options ) {
	
		if ( typeof options === 'string' ) {
		
			var args = Array.prototype.slice.call( arguments, 1 );

			this.each(function() {
			
				var instance = $.data( this, 'slideshow' );
				
				if ( !instance ) {
					logError( "cannot call methods on slideshow prior to initialization; " +
					"attempted to call method '" + options + "'" );
					return;
				}
				
				if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
					logError( "no such method '" + options + "' for slideshow instance" );
					return;
				}
				
				instance[ options ].apply( instance, args );
			
			});
		
		} 
		else {
		
			this.each(function() {
				
				var instance = $.data( this, 'slideshow' );
				
				if ( !instance ) {
					
					$.data( this, 'slideshow', new $.Slideshow( options, this ) );
					
				}
				
			});
		
		}
		
		return this;
		
	};
	
})( window, jQuery );