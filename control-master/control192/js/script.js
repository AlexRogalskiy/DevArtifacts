			jQuery( function( $ ) {
				$( '#myDropdown' ).selectify({
					arrowSymbol : 'V'
				});
				$( 'input[name=changeStyleAttr]' ).click( function() {
					if( this.value == 'Remove Style' ) {
						$( '#myDropdown' ).show().next().hide();
						this.value = 'Add Style';
					} else {
						$( '#myDropdown' ).hide().next().show();
						this.value = 'Remove Style';
					}
				});
			});