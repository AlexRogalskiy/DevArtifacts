App.ListView = App.UiPhoneControl.extend({
    listViewCells: DS.hasMany('listViewCell', {inverse: 'parentListView'}),
    navigations: DS.hasMany('navigation', {inverse: null}),
    minWidth: 270,
    minHeight: 60,
    defaultWidth: 270,
    defaultHeight: 270,
    widthFixed: DS.attr('number', {defaultValue: 270}),
    heightFixed: DS.attr('number', {defaultValue: 270}),

    backgroundColor: DS.attr('string', {defaultValue: ''}),
    listType: DS.attr('string', {defaultValue: 'simple'}),

    xmlName: 'listViews',

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
        var listViewCells = this.get('listViewCells');

        listViewCells.forEach(function (listViewCell) {
            Ember.run.once(self, function () {
                listViewCell.deleteRecord();
                listViewCell.save();
            });
        });

        var navigation = this.get('navigation');

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

        elem.setAttribute('backgroundColor', this.get('backgroundColor'));
        elem.setAttribute('listType', this.get('listType'));

        var navigations = this.get('navigations');
        navigations.forEach(function(nav) {
            elem.appendChild(nav.toXml(xmlDoc));
        });

        self.get('listViewCells').map(function (item) {
            elem.appendChild(item.toXml(xmlDoc));
        });

        return elem;
    }
});
/*
 App.ListView.FIXTURES = [
 {
 id: 8,
 name: 'ListView',
 listViewCells: [1],
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
 alignParentTop: true,
 alignParentBottom: false,
 alignParentStart: true,
 alignParentEnd: true,
 width: 300,
 height: 300,
 viewController: 2,
 parentContainer: null
 }
 ];*/
