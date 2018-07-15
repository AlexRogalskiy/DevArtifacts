module Shot {
	export module Models {
		/**
		 * Album model
		 */
		export class Album extends Editable {
			private template: string;

			constructor(public data: {
				id?: number;
				title?: string;
				image_count?: number;
				cover_image_id?: number;
				link?: string;
				pending?: boolean;
				error?: boolean;
				draggable?: boolean
			}) {
				super();

				if ( !this.data.id ) {
					this.data.pending = true;
					this.data.image_count = 0;
				}

				this.template = $('#template-album').html();
			}

			/**
			 * Render
			 */
			render(): Album {
				var el = $(Handlebars.compile(this.template)(this.data));

				if ( this.el ) {
					this.el.replaceWith(el);
				}

				this.el = el;

				super.render();

				this.select(this.isSelected());

				return this;
			}

			/**
			 * Save
			 */
			save = function(): JQueryDeferred<any> {
				var deferred = $.Deferred();

				this.data.pending = true;
				this.data.error = false;

				this.render();

				$.post(SHOT.rootPath + 'ajax/saveAlbum', {
					id: this.data.id,
					title: new Helpers().htmlDecode(this.data.title),
					cover_image_id: this.data.cover_image_id
				})
				.done((data) => {
					this.data.id = data.id;
					this.data.pending = false;
					this.data.error = false;

					deferred.resolve(data);
				})
				.fail((e) => {
					this.data.pending = false;
					this.data.error = true;

					deferred.reject(e);
				});

				return deferred;
			}
		}
	}
}
