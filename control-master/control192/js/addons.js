( function( window, $ ) {
	if( typeof $.selectify == 'undefined' ) {
		$.selectify = {};
	}

	$.selectify.defaults = {
		maxHeight : '400px',
		arrowSymbol : '▼'
	};

	$( document ).bind( 'click', function() {
		$( 'li.generated' ).hide();
	});

	$.fn.selectify = function( options ) {

		if( options ) {
			for( var property in $.selectify.defaults ) {
				if( typeof options[ property ] != 'undefined' ) {
					$.selectify.defaults[ property ] = options[ property ];
				}
			}
		}

		return this.each( function() {
			if( this.nodeName != 'SELECT' ) {
				return true;
			}
			var me = $( this ).hide(), itsId = this.id, itsName = this.name, dropdownHtml = '<ul class="uploadifyDropdown processClick" style="list-style:none;max-height:' + $.selectify.defaults.maxHeight + ';overflow-y:auto" name="' + itsName + '_ul" id="' + itsId + '_id"><li name="selected" class="processClick" rel=""><span class="selectText processClick"></span><a class="changeValue processClick" href="javascript:void(0);">' + $.selectify.defaults.arrowSymbol + '</a></li>';
			$( 'option', this ).each( function() {
				dropdownHtml += '\n<li style="display:none;cursor:pointer" class="generated" rel="' + this.value + '">' + this.innerHTML + '</li>';
			});
			dropdownHtml += '\n</ul>';
			this.cssDropDown = $( dropdownHtml ).insertAfter( this );
			this.updateInterval = setInterval( function() {
				$( 'li[name=selected]', me[ 0 ].cssDropDown ).attr( 'rel', me.val() ).find( 'span.selectText' ).html( $( 'option:selected', me ).html());
			}, 200 );
			$( 'li[name=selected]', this.cssDropDown ).click( function( e ) {
				e.stopPropagation();
				$( this ).nextAll().toggle();
			});
			$( 'li.generated', this.cssDropDown ).click( function() {
				me.val( $( this ).attr( 'rel' ) ).trigger( 'change' );
				$( 'a.changeValue', $( this ).parent() ).trigger( 'click' );
			});
			$( this.cssDropDown ).css({
				width : $( this ).width() + 'px'
			});
		});
	};
})( window, jQuery );