/*
 templates/view_controller.hbs
 */
App.ViewControllerController = Ember.ObjectController.extend({
    needs: ['editor'],
    isActive: false,
    zoomLevel: 0.6,
    isRotated: false,
    isScene: false,

    viewControllerToShow: Ember.computed.alias('model'),
    device: Ember.computed.alias('controllers.editor.device'),

    currentDeviceIsSmartphone: function() {
        return this.get('device.type') === 'smartphone';
    }.property('device.type'),

    currentRouteIsViewController: function() {
        var path = this.get('target.location.lastSetURL');
        if(!path) {
            path = this.get('target.url');
        }
        if(path) {
            var splittedPath = path.split('/');
            return splittedPath[3] === 'viewController';
        }
        return false;
    }.property(
        'target.location.lastSetURL'
    ),

    isRotatedObserver: function() {
        if(!this.get('isDeleted') && this.get('device.type') === 'tablet') {
            var mustUpdate = (this.get('isRotated') && !this.get('device.isDirty')) ||
                (!this.get('isRotated') && this.get('device.isDirty'));
            if(mustUpdate) {
                var device = this.get('device');
                // Invert dimensions
                var temp = device.get('screenWidth');
                device.set('screenWidth', device.get('screenHeight'));
                device.set('screenHeight', temp);
                // Invert css dimensions
                temp = device.get('cssWidth');
                device.set('cssWidth', device.get('cssHeight'));
                device.set('cssHeight', temp);
                // Calculate view top and bottom
                if(device.get('platform') === 'ios') {
                    device.set('viewTop', 65);
                    device.set('viewBottom', device.get('screenHeight'));
                } else {
                    device.set('viewTop', 88); // 24 status_bar + 64 action_bar
                    device.set('viewBottom', device.get('screenHeight') - 47);
                }
            }
            if(this.get('model.varyForTablets') && this.get('isRotated')) {
                this.set('isRotated', false);
            }
        }
    }.observes('isRotated', 'device'),

    zoomLevelObserver: function() {
        if(!this.get('isDeleted')) {
            if(this.get('device.name') === 'iPhoneX') {
                this.set('zoomLevel', 0.6);
            } else if(this.get('device.name') === 'iPhone7Plus') {
                this.set('zoomLevel', 0.6);
            } else if(this.get('device.name') === 'iPhone7') {
                this.set('zoomLevel', 0.6);
            } else if(this.get('device.name') === 'iPhone6Plus') {
                this.set('zoomLevel', 0.6);
            } else if(this.get('device.name') === 'iPhone6') {
                this.set('zoomLevel', 0.6);
            } else if(this.get('device.name') === 'iPhone5') {
                this.set('zoomLevel', 0.7);
            } else if(this.get('device.name') === 'iPad12_9') {
                this.set('zoomLevel', 0.5);
            } else if(this.get('device.name') === 'iPad9_7') {
                this.set('zoomLevel', 0.6);
            } else if(this.get('device.name') === 'GooglePixel') {
                this.set('zoomLevel', 0.6);
            } else if(this.get('device.name') === 'Nexus6P') {
                this.set('zoomLevel', 0.6);
            } else if(this.get('device.name') === 'Nexus5') {
                this.set('zoomLevel', 0.8);
            } else if(this.get('device.name') === 'Nexus7') {
                this.set('zoomLevel', 0.8);
            } else if(this.get('device.name') === 'Nexus9') {
                this.set('zoomLevel', 0.7);
            } else if(this.get('device.name') === 'Nexus10') {
                this.set('zoomLevel', 0.6);
            }
        }
    }.observes('device.name'),

    actions: {
        transitionToRoute: function(route, model) {
            this.transitionToRoute(route, model);
        }
    }

});
