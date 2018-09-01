$( function() {
			$( '#create-post-form' ).ipValidate( {

				required : { //required is a class
					rule : function() {
						return $( this ).val() == '' ? false : true;
					},
					onError : function() {
						if( !$( this ).parent().hasClass( 'element_container' ) ) {
							$( this ).wrap( '<div class="element_container error_div"></div>' ).after( '<span>' + $( this ).attr( 'rel' ) + '</span>' );
						} else if( !$( this ).parent().hasClass( 'error_div' ) ) {
							$( this ).next().text( $( this ).attr( 'rel' ) ).parent().addClass( 'error_div' );
						}
					},
					onValid : function() {
						$( this ).next().text( '' ).parent().removeClass( 'error_div' );
						$(this).focus();
					}
				},


				nonzero : { //nonzero is a class

					rule : function() {
						return $( this ).val() == 0 ? false : true;
					},
					onError : function() {
						$( this ).css( 'border', '4px solid #F7ACAC' );
					},
					onValid : function() {
						$( this ).css( 'border', '4px solid #dbdbdb' );
					}
				},

				postOptions : {  //postOptions is a class

					rule : function() {
						return $( 'input[type=checkbox]:checked' ).length < 1 ? false : true;
					},
					onError : function() {
						$( '.chk_div', this ).css( 'border', '4px solid #F7ACAC' );
					},
					onValid : function() {
						$( '.chk_div', this ).css( 'border', '4px solid #dbdbdb' );
					}
				},

				submitHandler : function() {
					alert( 'Form is ready for submit.' );
					return false;
				}
			});
		});