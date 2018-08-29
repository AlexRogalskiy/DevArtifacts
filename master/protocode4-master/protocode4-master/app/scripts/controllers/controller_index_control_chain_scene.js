/*
 templates/scene/control_chain.hbs
 */
App.SceneControlChainController = App.ControlChainIndexController.extend({

    actions: {
        delete: function () {
            var self = this;
            var chainToDelete = this.get('model');
            var viewController = chainToDelete.get('viewController');
            var uiPhoneControls = [].addObjects(chainToDelete.get('uiPhoneControls'));
            uiPhoneControls.forEach(function(c) {
                viewController.get('uiPhoneControls').removeObject(c);
            });
            viewController.get('controlChains').removeObject(chainToDelete);
            viewController.save().then(function(vc) {
                chainToDelete.deleteRecord();
                chainToDelete.save().then(function(chain) {
                    uiPhoneControls.forEach(function(c) {
                        c.deleteRecord();
                        c.save();
                    });
                    self.transitionToRoute('vc', vc);
                });
            });
        }
    }
});
