App.Navigable = Ember.Mixin.create({

    destinationSelected: null,

    modelObserver: function() {
        this.get('currentNavigation');
    }.observes('model', 'target.location.lastSetURL'),

    currentScene: function() {
        if(this.get('model')) {
            return this.get('model.viewController.activeScene');
        }
        return null;
    }.property('model.viewController.activeScene'),

    /*currentSceneId: function() {
        var path = this.get('target.location.lastSetURL');
        if(!path) {
            path = this.get('target.url');
        }
        if(path) {
            var splittedPath = path.split('/');
            return splittedPath[splittedPath.get('length') - 3];
        }
        return null;
    }.property('target.location.lastSetURL', 'target.url'),*/

    currentNavigation: function() {
        if(this.get('currentScene') && this.get('model')) {
            var sceneId = this.get('currentScene.id');
            var dest = this.get('model.navigations').find(function(nav) { return nav.get('contextId') === sceneId });
            if(dest) {
                if(dest.get('destinationScene')) {
                    this.set('destinationSelected', dest.get('destinationScene'));
                } else if(dest.get('destinationViewController')) {
                    this.set('destinationSelected', dest.get('destinationViewController'));
                } else {
                    this.set('destinationSelected', null);
                }
                return dest;
            } else {
                return null;
            }
        }
        return null;
    }.property('currentScene'),

    navigationArray: function() {
        if(this.get('model') && this.get('model.viewController') && this.get('model.viewController.application.scenes') && this.get('currentScene')) {
            var self = this;
            return DS.PromiseArray.create({
                promise: self.get('model.viewController.application.scenes').then(function(scenes) {
                    var array = [].addObjects(scenes.without(self.get('currentScene')));
                    array = array.addObjects(self.get('currentScene.viewControllers').without(self.get('model.viewController')));
                    return array;
                })
            });
        }
        return [];
    }.property(
        'model.viewController',
        'model.viewController.application.scenes.@each',
        'currentScene.viewControllers.@each'
    ),

    destinationObserver: function() {
        if(this.get('destinationSelected') && this.get('currentNavigation')) {
            var destination = this.get('destinationSelected');
            if(destination.constructor.toString() === 'App.Scene') {
                this.set('currentNavigation.destinationScene', this.get('destinationSelected'));
            } else {
                this.set('currentNavigation.destinationViewController', this.get('destinationSelected'));
            }
            this.get('currentNavigation').save();
        }
    }.observes('destinationSelected')
    
});
