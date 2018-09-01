$( function() {
			$('#auto_box input').bind('keyup',function( e ){
		if( e.keyCode == 40 ) {
			if( $( '.highlight' ).length < 1 ) {
				$('.list_name p:first' ).addClass( 'highlight' );
			} else {
				if( $( '.highlight' ).next().length < 1 ) {
					$( '.highlight' ).removeClass( 'highlight' );
					$('.list_name p:first' ).addClass( 'highlight' );
				} else {
					var itsNext = $( '.highlight' ).removeClass( 'highlight' ).next().addClass( 'highlight' );
					if( itsNext.is( ':hidden' ) ) {
						$( this ).trigger( { type : 'keyup', keyCode : 40 });
					} else {
						$( '.highlight' )[0].scrollIntoView();
					}
				}
			}
			return;
		}
		if( e.keyCode == 38 ) {
			if( $( '.highlight' ).length < 1 ) {
				$('.list_name p:last' ).addClass( 'highlight' );
			} else {
				if( $( '.highlight' ).prev().length < 1 ) {
					$( '.highlight' ).removeClass( 'highlight' );
					$('.list_name p:last' ).addClass( 'highlight' );
				} else {
					var itsPrev = $( '.highlight' ).removeClass( 'highlight' ).prev().addClass( 'highlight' );
					if( itsPrev.is( ':hidden' ) ) {
						$( this ).trigger( { type : 'keyup', keyCode : 38 });
					} else {
						$( '.highlight' )[0].scrollIntoView();
					}
				}
			}
			return;
		}
		if( e.keyCode == 13 ) {
			$( '.highlight' ).trigger( 'click' );
			return;
		}
		if( $.trim( this.value ) == '' ) {
			$( '.list_name' ).hide();
			return;
		}
		var strToMatch = this.value;
		$( '.list_name' ).show();
		$( '.list_name p' ).each( function() {
			if( this.innerHTML.toLowerCase().indexOf( strToMatch.toLowerCase() ) > -1 ) {
				$( this ).show();
			} else {
				$( this ).hide();
			}
		});
	});	

	function fixScroll() {
		var listContainer = $('#auto_box .list_name' )[ 0 ];
		listContainer.scrollTo( 0, 40 * $( '.highlight' ).prevAll().length );
	}

	$('#auto_box' ).click( function() {
		$( 'input', this ).focus();
	});

	$( 'span b' ).live( 'click', function() {
		$( '<p>' + $(this).parent().text().substr(1) + '</p>' ).appendTo( '.list_name' );
		$( this ).parent().remove();
	});

	$('.list_name p').live( 'click', function() {
		$('<span><b>x</b>'+this.innerHTML+'</span>').insertBefore('#auto_box input');
		$( this ).remove();
	}).live( 'mouseover', function() {
		$( '.highlight' ).removeClass('highlight');
		$( this ).addClass('highlight');
	});


	});