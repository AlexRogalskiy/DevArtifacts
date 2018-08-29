App.Navigation = DS.Model.extend({
    contextId: DS.attr('string'),
    destinationViewController: DS.belongsTo('viewController', {default: null}),
    destinationScene: DS.belongsTo('scene', {default: null}),

    toXml: function (xmlDoc) {
        var elem = null;
        // Case of buttons, listViews and gridViews
        if(this.get('contextId')) {
            elem = xmlDoc.createElement('navigations');
            elem.setAttribute('id', this.get('id'));
            elem.setAttribute('contextScene', '//@scenes[id=\'' + this.get('contextId') + '\']');
            if(this.get('destinationViewController')) {
                elem.setAttribute('destinationViewController', this.get('destinationViewController').getRefPath(''));
            } else if(this.get('destinationScene')) {
                elem.setAttribute('destinationScene', this.get('destinationScene').getRefPath(''));
            }
        } else {
            // Case of menuItems
            elem = xmlDoc.createElement('navigation');
            elem.setAttribute('id', this.get('id'));
            if(this.get('destinationScene')) {
                elem.setAttribute('destinationScene', this.get('destinationScene').getRefPath(''));
            }
        }

        return elem;
    }
});
