/*
 templates/control_photocamera_controller/index.hbs
 */
App.ControlPhotocameraControllerIndexController = App.UiPhoneControlController.extend({

    imageViews: function() {
        if(this.get('model.viewController.uiPhoneControls')) {
            return this.get('model.viewController.uiPhoneControls').filter(function(control) {
                return control.constructor.toString() === 'App.ImageView';
            });
        }
        return [];
    }.property('model.viewController.uiPhoneControls.[]'),

    allowedImageViews: function () {
        return this.get('imageViews').filterBy('sourceType.type', 'hardwareFile');
    }.property('imageViews.@each.sourceType.type'),

    normalBackType: function (key, value) {
        return this.backgroundType(key, value, 'normal');
    }.property('model.backgroundType'),

    iconBackType: function (key, value) {
        return this.backgroundType(key, value, 'icon');
    }.property('model.backgroundType'),

    backgroundType: function (key, value, type) {
        // setter
        if (value !== undefined) {
            this.set('model.backgroundType', type);
            this.get('model').save();
        }

        // getter
        return this.get('model.backgroundType') === type;
    },

    actions: {
        acceptChanges: function () {
            this._super();

            if (this.get('model.imageView')) {
                this.get('model.imageView').save();
            }
        }
    }

});
