App.GridView = App.UiPhoneControl.extend({
    gridViewCells: DS.hasMany('gridViewCell', {inverse: 'parentGridView'}),
    navigations: DS.hasMany('navigation', {inverse: null}),

    minHeight: 408,
    defaultHeight: 408,
    heightFixed: DS.attr('number', {defaultValue: 408}),

    gridType: DS.attr('string', {defaultValue: 'simple'}),

    xmlName: 'gridViews',

    defaultWidth: function() {
        return this.get('viewController.scene.application.device.screenWidth');
    }.property('viewController.scene.application.device.screenWidth'),

    minWidth: function() {
        return this.get('defaultWidth');
    }.property('defaultWidth'),

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
    var self = this;
        var gridViewCells = this.get('gridViewCells');

        gridViewCells.forEach(function (gridViewCell) {
            Ember.run.once(self, function () {
                gridViewCell.deleteRecord();
                gridViewCell.save();
            });
        });

        var navigations = this.get('navigations');
        navigations.forEach(function(nav) {
            Ember.run.once(self, function () {
                nav.deleteRecord();
                nav.save();
            });
        });

        this._super();
    },

    toXml: function (xmlDoc) {
        var self = this;

        var elem = xmlDoc.createElement(self.get('xmlName'));
        self.decorateXml(xmlDoc, elem);

        elem.setAttribute('gridType', this.get('gridType'));

        var navigation = self.get('navigation');

        navigations.forEach(function(nav) {
            elem.appendChild(nav.toXml(xmlDoc));
        });

        self.get('gridViewCells').map(function (item) {
            elem.appendChild(item.toXml(xmlDoc));
        });

        return elem;
    }
});
/*
 App.GridView.FIXTURES = [
 {
 id: 9,
 name: 'GridView1',
 gridViewCells: [1],
 posX: 10,
 posY: 10,
 paddingTop: 0,
 paddingBottom: 0,
 paddingStart: 0,
 paddingEnd: 0,
 marginTop: 0,
 marginBottom: 0,
 marginStart: 0,
 marginEnd: 0,
 alignParentTop: false,
 alignParentBottom: true,
 alignParentStart: true,
 alignParentEnd: true,
 width: 300,
 height: 200,
 viewController: 2,
 parentContainer: null
 }
 ];*/
