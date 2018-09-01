		$(document).ready(function(){
			$( 'input.password-box' ).on( 'keyup', function() {
			var howStrong = passwordStrength( $( this ).val() );
			$( '.strength-text', $( this ).next() ).text( howStrong );
			var sColor = '#555';
			switch( howStrong ) {
				case 'Strong' :
					$( '.password-strength', $( this ).next() ).css( 'background-color', 'green' );
					break;
				case 'Medium' :
					$( '.password-strength', $( this ).next() ).css( 'background-color', 'lightgreen' );
					break;
				case 'Weak' :
					$( '.password-strength', $( this ).next() ).css( 'background-color', 'orange' );
					break;
				case 'Short' :
					$( '.password-strength', $( this ).next() ).css( 'background-color', 'red' );
					break;
				default :
					$( '.password-strength', $( this ).next() ).css( 'background-color', '#555' );
			}
			}).focusout( function() {
				$( this ).trigger( 'keyup' );
			});

	});