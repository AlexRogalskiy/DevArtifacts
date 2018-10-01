( function( $, undefined ) {
	
	'use strict';
	
	// GridGallery obj
	$.GridGallery 			= function( options, element ) {
		
		this.$list = $( element );
		this._init( options );
		
	};
	
	$.GridGallery.defaults 	= {
		lines		: true,
		speed		: 900, // speed for the boxes / content transitions
		hideSpeed	: 700, // speed to hide the current slide
		lineSpeed	: 700, // speed for the grid lines transitions
		fadeSpeed	: 1000 // transition speed for navigation and grid lines
	};
	
	$.GridGallery.prototype = {
		_init				: function( options ) {
			
			var _self = this;
			
			// the options
			this.options		= $.extend( true, {}, $.GridGallery.defaults, options );
			// current slide
			this.current		= 0;
			this.isAnimating	= false;
			this.support		= Modernizr.csstransforms3d && Modernizr.csstransitions;
			this._layout();
			// preload images
			this.$list.imagesLoaded( function() {
				
				// remove original structure
				_self.$list.remove();
				// keep reference to images and config
				_self._saveSlides();
				// add the 4 "boxes"
				_self._grid();
				// add navigation buttons
				_self._addNavigation();
				// init some events
				_self._initEvents();
				
				setTimeout( function() {
					
					// now show the first slide
					_self._showSlide( _self.current );
					
				}, 500 );
				
				// remove loader div
				_self.$loader.hide();
			
			} );
			
		},
		_saveSlides			: function() {
			
			var $theSlides	= this.$list.children( 'li' );
			
			this.slidesCount = $theSlides.length;
			// save each slide's properties inside this array
			this.slides	= [];
			
			for( var i = 0; i < this.slidesCount; ++i ) {
				
				var $theSlide 	= $theSlides.eq( i ),
					$content		= $theSlide.children();
				
				this.slides[ i ] = {
					w 			: $theSlide.data( 'w' ),
					h 			: $theSlide.data( 'h' ),
					boxesCount	: $content.length,
					content		: $content.map( function() { 
						
						var $this = $( this );
						return {
							title 		: $this.attr( 'title' ),
							src 		: $this.attr( 'src' ),
							inner		: $this.html(),
							rotateX		: $this.data( 'rotateX' ) | 0,
							rotateY		: $this.data( 'rotateY' ) | 0,
							rotateZ		: $this.data( 'rotateZ' ) | 0,
							translateX	: $this.data( 'translateX' ) | 0,
							translateY	: $this.data( 'translateY' ) | 0,
							translateZ	: $this.data( 'translateZ' ) | 0,
							isImage		: $this.is( 'img' )
						};
						
					} )
				};
			
			}
		
		},
		_layout				: function() {
			
			// main wrapper
			this.$gridWrapper	= $( '<div class="sg-wrapper"></div>' );
			this.$gridWrapper.insertBefore( this.$list );
			this.$loader		= $( '<div class="sg-loading"></div> ').appendTo( this.$gridWrapper );
			
		},
		_grid				: function() {
		
			// 4 (maximum) "boxes"
			this.$box1 = $( '<div class="sg-box sg-box-1"></div>' );
			this.$box2 = $( '<div class="sg-box sg-box-2"></div>' );
			this.$box3 = $( '<div class="sg-box sg-box-3"></div>' );
			this.$box4 = $( '<div class="sg-box sg-box-4"></div>' );
			
			this.$gridWrapper.append( this.$box1, this.$box2, this.$box3, this.$box4 );
			
			this.$gridBoxes = this.$gridWrapper.children( 'div.sg-box' );
			
			if( this.options.lines ) {
			
			// add the vertical and horizontal lines
			this._addGridLines();
			// position the lines
			this._moveGridLines( '50%', '50%' );
			
			}
			
		},
		_addGridLines		: function() {
			
			var commonStyle			= { opacity : 0 },
				commonTransition	= { opacity : 1 };
			this.$gridLineH	= $( '<div class="sg-line-hor"></div>' ).css( commonStyle );
			this.$gridLineV	= $( '<div class="sg-line-ver"></div>' ).css( commonStyle );
			this.$gridWrapper.append( this.$gridLineH.transition( commonTransition, this.options.fadeSpeed ), this.$gridLineV.transition( commonTransition, this.options.fadeSpeed ) );
			
		},
		_moveGridLines		: function( x, y, anim ) {
			
			var _self = this;
			return $.Deferred( function( dfd ) {
			
				if( _self.options.lines ) {
				
				if( anim ) {
					
					var cx 	= _self.$gridLineV.css( 'left' ),
						cy	= _self.$gridLineH.css( 'top' );
					
					if( cx === x && cy === y ) {
						
						dfd.resolve();
					
					}
					else if( cx === x && cy !== y ) {
						
						_self.$gridLineV.transition( { 'left' : x }, _self.options.lineSpeed );
						_self.$gridLineH.transition( { 'top' : y }, _self.options.lineSpeed, dfd.resolve );
					
					}
					else {
						
						_self.$gridLineV.transition( { 'left' : x }, _self.options.lineSpeed, dfd.resolve );
						_self.$gridLineH.transition( { 'top' : y }, _self.options.lineSpeed );
					
					}
					
				}
				else {
				
					_self.$gridLineV.css( 'left', x );
					_self.$gridLineH.css( 'top', y );
					dfd.resolve();
					
				}
			
				}
				else {
					
					dfd.resolve();
				
				}
			
			} ).promise();
		
		},
		_addNavigation		: function() {
		
			// only add if this.slidesCount > 1
			if( this.slidesCount > 1 ) {
			
				this.$nav 		= $( '<nav class="sg-nav"></nav>' ).css( 'opacity', 0 );
				this.$navPrev	= $( '<span class="sg-prev"></span>' ).appendTo( this.$nav );
				for( var i = 0; i < this.slidesCount; ++i ) {
					
					var className = 'sg-dot';
					if( i === 0 ) className += ' sg-dot-current';
					this.$nav.append( '<span class="' + className + '"></span>' );
				
				}
				this.$navNext	= $( '<span class="sg-next"></span>' ).appendTo( this.$nav );
				this.$gridWrapper.append( this.$nav.transition( { 'opacity' : 1 }, this.options.fadeSpeed ) );
				
				this.$dots		= this.$nav.children( 'span.sg-dot' );
			
			}
			
		},
		_showSlide			: function( idx ) {
			
			this.isAnimating= true;
			
			var _self			= this,
				slide 			= this.slides[ idx ],
				w				= slide.w,
				h				= slide.h,
				boxesCount		= slide.boxesCount,
				content			= slide.content,
				gridLineW, gridLineH,
				resetBoxStyle 	= { width : '0%', height : '0%' };
			
			switch( boxesCount ) {
				
				case 4 : case 3 :
				
					gridLineW = w + '%';
					gridLineH = h + '%';
					break;
				
				case 2 :
					if( w === 100 ) { 	// x should actually be set to 100 in the data attr
						
						gridLineW = '105%';
						gridLineH = h + '%';
						this.$box2.css( resetBoxStyle );
						this.$box4.css( resetBoxStyle );
						
					}
					else if( h === 100 ) {			// y should actually be set to 50 in the data attr
					
						gridLineW = w + '%';
						gridLineH = '105%';
						this.$box3.css( resetBoxStyle );
						this.$box4.css( resetBoxStyle );
						
					}
					break;
				
				case 1 :
					gridLineW = w + 5 + '%';
					gridLineH = h + 5 + '%';
					this.$box2.css( resetBoxStyle );
					this.$box3.css( resetBoxStyle );
					this.$box4.css( resetBoxStyle );
					break;
				
			}
			
			
			this._hideSlide();
			
			$.when( _self._moveGridLines( gridLineW, gridLineH, true ) ).done( function() {
			
				for( var i = 0; i < boxesCount; ++i ) {
					
					var item			= content[ i ],
						$wrapper		= $( '<div/>' ),
						transformation	= 'translateX(' + item.translateX + 'px) translateY(' + item.translateY + 'px) translateZ(' + item.translateZ + 'px) rotateX(' + item.rotateX + 'deg) rotateY(' + item.rotateY + 'deg) rotateZ(' + item.rotateZ + 'deg)',
						wrapperStyle 	= {
							'-webkit-transition': 'none',
							'-moz-transition' 	: 'none',
							'-o-transition' 	: 'none',
							'-ms-transition' 	: 'none',
							'transition' 		: 'none',
							'opacity' 			: 0,
							'-webkit-transform' : transformation,
							'-moz-transform' 	: transformation,
							'-o-transform' 		: transformation,
							'-ms-transform' 	: transformation,
							'transform' 		: transformation
						};
						
					if( item.isImage ) {
					
						wrapperStyle.backgroundImage = 'url(' + item.src + ')';
						$wrapper.append( '<h2>' + item.title + '</h2>' );
					
					}
					else {
					
						$wrapper.html( item.inner );
					
					}
					
					var $boxImage 	= $( '<div class="sg-panel"></div>' ).append( $wrapper.css( wrapperStyle ) ),
						$box, css;
					
					switch( i ) {
					
						case 0 :
							
							$box 	= _self.$box1;
							css		= {
								width 	: w + '%', 
								height 	: h + '%'
							};
							break;
							
						case 1 :
							
							if( boxesCount === 2 && w === 100 ) {
							
								$box 	= _self.$box3;
								css		= {
									width 	: w + '%',
									height 	: 100 - h + '%',
									top 	: h + '%'
								};
							
							}
							else {
								
								$box 	= _self.$box2;
								css		= {
									width 	: 100 - w + '%',
									height 	: h + '%',
									left 	: w + '%'
								};
							
							}
							break;
						
						case 2 :
						
							$box 	= _self.$box3;
							css		= {
								width 	: w + '%',
								height 	: 100 - h + '%',
								top 	: h + '%'
							};
							break;
						
						case 3 :
						
							$box 	= _self.$box4;
							css		= {
								width 	: 100 - w + '%',
								height 	: 100 - h + '%',
								left 	: w + '%',
								top 	: h + '%'
							};
							break;
							
					};
					
					$box.empty().css( css ).append( $boxImage );
					
					var resetTransformation = 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateX(0px) translateY(0px) translateZ(0px)',
						resetTransition		= 'all ' + _self.options.speed + 'ms ease';
					
					$wrapper.doTimeout( 1, function() {
					
						this.css( {
							'-webkit-transition': resetTransition,
							'-moz-transition' 	: resetTransition,
							'-o-transition' 	: resetTransition,
							'-ms-transition' 	: resetTransition,
							'transition' 		: resetTransition,
							opacity 			: 1,
							'-webkit-transform' : resetTransformation,
							'-moz-transform' 	: resetTransformation,
							'-o-transform' 		: resetTransformation,
							'-ms-transform' 	: resetTransformation,
							'transform' 		: resetTransformation
					} );
					
						( _self.support ) ? 
			
							this.on( 'webkitTransitionEnd.gridgallery transitionend.gridgallery oTransitionEnd.gridgallery', function() {
				
								$( this ).css( {
									'-webkit-transition': 'none',
									'-moz-transition' 	: 'none',
									'-o-transition' 	: 'none',
									'-ms-transition' 	: 'none',
									'transition' 		: 'none',
								} )
								_self.isAnimating = false;
			
							} ) :
				
							_self.isAnimating = false;
				
					} );
				
			}
		
			} );
				
		},
		_hideSlide			: function() {
			
			var _self = this;
			
			return $.Deferred( function( dfd ) {
				
				var $boxinner	= _self.$gridBoxes.children( 'div.sg-panel' );
				( $boxinner.length > 0 ) ? $boxinner.transition( { opacity : 0 }, _self.options.hideSpeed, dfd.resolve ) : dfd.resolve();
				
			} ).promise();
		
		},
		_initEvents			: function() {
		
			var _self = this;
			
			this.$navNext.on( 'click.gridgallery', function( event ) {
				
				if( !_self.isAnimating ) {
				
					( _self.current >= _self.slidesCount - 1 ) ? _self.current = 0 : ++_self.current;
					_self._showSlide( _self.current );
					_self._updateNavigation();
				
				}
			
			} );
			this.$navPrev.on( 'click.gridgallery', function( event ) {
				
				if( !_self.isAnimating ) {
				
					( _self.current === 0 ) ? _self.current = _self.slidesCount - 1 : --_self.current;
					_self._showSlide( _self.current );
					_self._updateNavigation();
				
				}
			
			} );
			this.$dots.on( 'click.gridgallery', function( event ) {
				
				if( !_self.isAnimating ) {
					
					var $dot 	= $( this ),
						idx		= $dot.index() - 1;
					_self._updateNavigation( $dot );
					if( _self.current === idx ) {
						
						return false;
					
					}
					_self.current = idx;
					_self._showSlide( _self.current );
					
				}
			
			} );
		
		},
		_updateNavigation	: function( $dot ) {
			
			var $dot = $dot || this.$dots.eq( this.current );
			this.$dots.removeClass( 'sg-dot-current' );
			$dot.addClass( 'sg-dot-current' );
		
		}
	};
	
	var logError 			= function( message ) {
		if ( this.console ) {
			console.error( message );
		}
	};
	
	$.fn.gridgallery		= function( options ) {
		
		if ( typeof options === 'string' ) {
			
			var args = Array.prototype.slice.call( arguments, 1 );
			
			this.each(function() {
			
				var instance = $.data( this, 'gridgallery' );
				
				if ( !instance ) {
					logError( "cannot call methods on gridgallery prior to initialization; " +
					"attempted to call method '" + options + "'" );
					return;
				}
				
				if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
					logError( "no such method '" + options + "' for gridgallery instance" );
					return;
				}
				
				instance[ options ].apply( instance, args );
			
			});
		
		} 
		else {
		
			this.each(function() {
			
				var instance = $.data( this, 'gridgallery' );
				if ( !instance ) {
					$.data( this, 'gridgallery', new $.GridGallery( options, this ) );
				}
			});
		
		}
		
		return this;
		
	};
	
} )( jQuery );