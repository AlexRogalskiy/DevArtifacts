/*
 templates/app_menu/index.hbs
 */
App.AppMenuIndexController = Ember.ObjectController.extend({
    isCreating: false,
    newNameMenuItem: 'newMenuItem',
    needs: ['scene'],

    actions: {
        setCreating: function (value) {
            this.set('isCreating', value);
        },

        createMenuItem: function () {
            var name = this.get('newNameMenuItem').trim();

            if (!name) {
                return;
            }

            var menuItem = this.store.createRecord('menuItem', {
                name: name.replace(/ /g, ''),
                title: name,
                parentMenu: this.get('model')
            });

            this.set('newNameMenuItem', 'newMenuItem');
            this.set('isCreating', false);

            menuItem.save();
        }
    }
});
