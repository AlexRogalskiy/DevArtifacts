App.Scene = DS.Model.extend({
    application: DS.belongsTo('application', {inverse: 'scenes'}),
    parentVCSmartphone: DS.belongsTo('viewController'),
    parentVCTablet: DS.belongsTo('viewController'),

    name: DS.attr('string'),
    launcher: DS.attr('boolean', {defaultValue: false}),
    typeSmartphone: DS.attr('string', {defaultValue: 'singleVC'}),
    typeTablet: DS.attr('string', {defaultValue: 'singleVC'}),

    xmlName: 'scenes',

    viewControllers: function() {
        if(this.get('parentVCSmartphone')) {
            var vcs = [];
            this.get('parentVCSmartphone.containers').forEach(function(c) {
                if(!vcs.contains(c.get('childViewController'))) {
                    vcs.addObject(c.get('childViewController'));
                }
            });
            return vcs;
        }
        return [];
    }.property(
        'parentVCSmartphone',
        'parentVCSmartphone.containers.[]'
    ),

    valid: function() {
        if(this.get('viewControllers.length') === 0) {
            return false;
        }
        return true;
    }.property('viewControllers.length'),

    type: function() {
        if(this.get('application.device.type') === 'smartphone') {
            return this.get('typeSmartphone');
        } else {
            return this.get('typeTablet');
        }
    }.property(
        'application.device.type',
        'typeSmartphone',
        'typeTablet'
    ),

    hasMenu: function() {
        var self = this;
        var hasMenu = false;
        this.get('application.menu.menuItems').forEach(function(mi) {
            if(mi.get('navigation.destinationScene') === self) {
                hasMenu = true;
            }
        });
        return hasMenu;
    }.property('application.menu.menuItems.@each.navigation.destinationScene'),

    activeParentVC: function() {
        if(this.get('application.device.type') === 'smartphone') {
            return this.get('parentVCSmartphone');
        } else {
            return this.get('parentVCTablet');
        }
    }.property('application.device.type', 'parentVCSmartphone', 'parentVCTablet'),

    mustShowTabMenu: function() {
        if((this.get('viewControllers.length') > 1) && this.get('type') === 'singleVCTab') {
            return true;
        }
        return false;
    }.property(
        'viewControllers.length',
        'type'
    ),

    isNotComposed: function() {
        return this.get('type') !== "multiVC";
    }.property(
        'type'
    ),

    didCreate: function() {
        var self = this;
        this.store.createRecord('viewController', {
            application: self.get('application'),
            name: 'parentVCSmartphone',
            isParent: true,
            scene: this
        }).save().then(function(vc) {
            self.set('parentVCSmartphone', vc);
            self.save();
        });
        this.store.createRecord('viewController', {
            application: self.get('application'),
            name: 'parentVCTablet',
            isParent: true,
            scene: this
        }).save().then(function(vc) {
            self.set('parentVCTablet', vc);
            self.save();
        });
    },

    updateNavigations: function(isVC, removedItemId) {
        this.get('viewControllers').forEach(function(vc) {
            vc.updateNavigations(isVC, removedItemId);
        });
        this.get('parentVCSmartphone').updateNavigations(isVC, removedItemId);
        this.get('parentVCTablet').updateNavigations(isVC, removedItemId);
    },

    toXml: function (xmlDoc) {
        var scene = xmlDoc.createElement(this.get('xmlName'));
        scene.setAttribute('id', this.get('id'));
        scene.setAttribute('name', this.get('name'));
        scene.setAttribute('launcher', this.get('launcher'));
        scene.setAttribute('typeSmartphone', this.get('typeSmartphone'));
        scene.setAttribute('typeTablet', this.get('typeTablet'));
        if(this.get('typeSmartphone') === 'multiVC') {
            scene.appendChild(this.get('parentVCSmartphone').toXml(xmlDoc));
        }
        if(this.get('typeTablet') === 'multiVC') {
            scene.appendChild(this.get('parentVCTablet').toXml(xmlDoc));
        }
        // if there will be 2 parent view controllers, the first is the smartphone parent vc, the second is the tablet one
        this.get('viewControllers').forEach(function(vc) {
            var vcInfo = xmlDoc.createElement('childViewControllers');
            vcInfo.setAttribute('viewController', vc.getRefPath(''));
            scene.appendChild(vcInfo);
        });

        return scene;
    },

    getRefPath: function (path) {
        return '//@' + this.get('xmlName') + '[id=\'' + this.get('id') + '\']' + path;
    }
});
