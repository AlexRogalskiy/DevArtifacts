		$( function() {
			$( '.checkAll' ).live( 'change', function() {
				$( '.cb-element' ).attr( 'checked', $( this ).is( ':checked' ) ? 'checked' : '' );
				$( this ).next().text( $( this ).is( ':checked' ) ? 'Uncheck All' : 'Check All' );
			});
			$( '.invertSelection' ).live( 'click', function() {
				$( '.cb-element' ).each( function() {
					$( this ).attr( 'checked', $( this ).is( ':checked' ) ? '' : 'checked' );
				}).trigger( 'change' );

			});
			$( '.cb-element' ).live( 'change', function() {
				$( '.cb-element' ).length == $( '.cb-element:checked' ).length ? $( '.checkAll' ).attr( 'checked', 'checked' ).next().text( 'Uncheck All' ) : $( '.checkAll' ).attr( 'checked', '' ).next().text( 'Check All' );

			});
		});