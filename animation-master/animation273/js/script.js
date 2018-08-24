$(function() {

			var border = margin = padding = 0;

			$( ".find" ).draggable({ 
				revert: function(event, ui) {
					var _that = $(event.context).data('check');
					var _this = $(this).data('find');
					var _container = $('#application-area');

					if (_this != _that) {return true;} 
					else {
						if(_this == 'margin-right' || _this == 'margin-left' || _this == 'margin-top' || _this == 'margin-bottom') {
							margin++;
						} else if (_this == 'padding-right' || _this == 'padding-left' || _this == 'padding-top' || _this == 'padding-bottom') {
							padding++;
						} else if (_this == 'border') {
							border++;
						}
						$(this).draggable("disable");
						_container.attr('data-margin', margin).attr('data-padding', padding).attr('data-border', border);
						return false;
					}
				}
			});

			$(".check").droppable();
		  });