module Shot {
	export module Models {
		/**
		 * Progress bar model
		 */
		export class ProgressBar {
			el: JQuery;
			template: string;

			constructor() {
				this.template = $('#template-progressbar').html();
			}

			/**
			 * Render
			 */
			render(): ProgressBar {
				this.el = $(Handlebars.compile(this.template)({}));

				return this;
			}

			/**
			 * Update progress bar value
			 */
			set(percentage: number, callback?: () => void): ProgressBar {
				this.el.find('.progressbar').stop(true, true).animate({ width: percentage + '%' }, 200, () => {
					if ( percentage === 100 ) {
						this.el.fadeOut('fast');
					}

					if ( typeof callback === 'function' ) {
						callback();
					}
				});

				return this;
			}
		}
	}
}
