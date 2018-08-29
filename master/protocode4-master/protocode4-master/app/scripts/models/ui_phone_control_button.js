App.Button = App.UiPhoneControl.extend({
    title: DS.attr('string', {defaultValue: 'Button'}),
    navigations: DS.hasMany('navigation', {inverse: null}),
    minWidth: 64,
    minHeight: 40,
    defaultWidth: 88,
    defaultHeight: 40,
    widthFixed: DS.attr('number', {defaultValue: 88}),
    heightFixed: DS.attr('number', {defaultValue: 40}),

    textColor: DS.attr('string', {defaultValue: ''}),
    backgroundColor: DS.attr('string', {defaultValue: ''}),
    clickColor: DS.attr('string', {defaultValue: ''}),
    borderRadius: DS.attr('number', {defaultValue: 2}),

    xmlName: 'buttons',

    addNavigation: function(id) {
        var self = this;
        this.store.createRecord('navigation', {
            contextId: id,
            destinationViewController: null,
            destinationScene: null
        }).save().then(function(nav) {
            self.get('navigations').addObject(nav);
            self.save();
        });
    },

    removeNavigation: function(id) {
        var navigationToDelete = this.get('navigations').find(function(nav) { return nav.get('contextId') === id });
        if(navigationToDelete) {
            this.get('navigations').removeObject(navigationToDelete);
            navigationToDelete.deleteRecord();
            navigationToDelete.save();
            this.save();
        }
    },

    didCreate: function() {
        this._super();
        var self = this;
        this.store.find('scene').then(function (scenes) {
            scenes.forEach(function(scene) {
                if(scene.get('viewControllers').findBy('id', self.get('viewController.id'))) {
                    self.addNavigation(scene.get('id'));
                }
            });
        });
    },

    deleteRecord: function () {
        var navigations = this.get('navigations');
        var self = this;
        navigations.forEach(function(nav) {
            Ember.run.once(self, function () {
                nav.deleteRecord();
                nav.save();
            });
        });

        this._super();
    },

    toXml: function (xmlDoc) {
        var button = xmlDoc.createElement(this.get('xmlName'));
        this.decorateXml(xmlDoc, button);
        button.setAttribute('title', this.get('title'));

        button.setAttribute('textColor', this.get('textColor'));
        button.setAttribute('backgroundColor', this.get('backgroundColor'));
        button.setAttribute('borderRadius', this.get('borderRadius'));
        button.setAttribute('clickColor', this.get('clickColor'));

        var navigations = this.get('navigations');
        navigations.forEach(function(nav) {
            button.appendChild(nav.toXml(xmlDoc));
        });

        return button;
    }
});
