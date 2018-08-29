/*
 templates/scene/constraint.hbs
 */
App.SceneConstraintController = App.ConstraintIndexController.extend({

    actions: {
        delete: function() {
            var constraintToDelete = this.get('model');
            var uiPhoneControl = constraintToDelete.get('uiPhoneControl');
            if(constraintToDelete.get('referenceElement') !== null) {
                uiPhoneControl.get('bindedControls').removeObject(constraintToDelete.get('referenceElement'));
            }
            uiPhoneControl.get('constraints').removeObject(constraintToDelete);
            uiPhoneControl.save();
            this.get('model').deleteRecord();
            this.get('model').save();
            this.transitionToRoute('scene.dispatchUiPhoneControl', uiPhoneControl);
        }
    }
});
