/*
 templates/app_menu_item/index.hbs
 */
App.AppMenuItemIndexController = Ember.ObjectController.extend({
    needs: ['application'],
    dirty: false,

    navigationArray: function() {
        if(this.get('controllers.application.model.scenes')) {
            var self = this;
            return DS.PromiseArray.create({
                promise: self.get('controllers.application.model.scenes').then(function(scenes) {
                    return scenes;
                })
            });
        }
        return [];
    }.property(
        'controllers.application.model.scenes.[]'
    ),

    isDirtyOverride: function() {
        if(this.get('model.isDirty') || this.get('dirty')) {
            return true;
        }
        return false;
    }.property('model.isDirty', 'dirty'),

    dirtyObserver: function() {
        if(this.get('model')) {
            this.set('dirty', true);
        }
    }.observes('model.navigation.destinationScene.id'),

    actions: {
        acceptChanges: function() {
            this.get('model').save();
            this.get('model.navigation').save();
            this.set('dirty', false);
        },

        delete: function () {
            var menuItemToDelete = this.get('model');
            var menu = menuItemToDelete.get('parentMenu');
            this.get('parentMenu.menuItems').removeObject(menuItemToDelete);
            menu.save();
            this.get('model').deleteRecord();
            this.get('model').save();
            this.transitionToRoute('viewController');
        }
    }

});
