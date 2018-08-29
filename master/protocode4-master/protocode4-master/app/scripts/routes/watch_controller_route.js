App.WatchControllerRoute = Ember.Route.extend({
    zIndex: 5,

    actions: {
        increaseZoom: function () {
            this.set('controller.zoomLevel', Math.round((this.get('controller.zoomLevel') + 0.2) * 100) / 100);
        },
        decreaseZoom: function () {
            this.set('controller.zoomLevel', Math.round((this.get('controller.zoomLevel') - 0.2) * 100) / 100);
        },
        addUiWatchControl: function (controlType, receiver) {
            console.log('Receiver of drop event: ' + receiver.get('context.name'));
            console.log('Type of receiver: ' + receiver.get('context').constructor.toString());

            var canInstantiate = true;

            /*
             WatchVoiceMessage
             Must be instantiated at most once per ViewController
             */
            this.get('context').get('uiWatchControls').forEach(function (item) {
                if (item.toString().indexOf('WatchVoiceMessage') > -1 && controlType === 'watchVoiceMessage') {
                    alert('Only a single Watch Voice Message per each view is allowed!');
                    canInstantiate = false;
                }
            });

            if (canInstantiate) {

                var uiWatchControl = this.store.createRecord(controlType, {
                    watchController: this.get('controller.model')
                });

                this.get('controller.model').save();
                if (receiver.get('context').constructor.toString() === 'App.Container') {
                    uiWatchControl.set('parentContainer', receiver.get('context'));
                    receiver.get('context').save();
                }
                uiWatchControl.save();


                //Force uiwatchcontrols to be one below the other
                var isFirst = this.get('context').get('uiWatchControls').get('lastObject') === undefined;
                if (isFirst) {
                    uiWatchControl.set('alignParentTop', true);
                    uiWatchControl.set('order', 1);
                    uiWatchControl.save();
                } else {
                    uiWatchControl.set(
                        'below',
                        this.get('context').get('uiWatchControls').get('lastObject')
                    );
                    uiWatchControl.set(
                        'order',
                        (parseInt(this.get('context').get('uiWatchControls').get('lastObject').get('order')) + 1)
                    );
                    uiWatchControl.save();
                }
            }

        }

    }

});
