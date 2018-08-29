App.ViewControllerRoute = Ember.Route.extend({
    zIndex: 5,

    actions: {

        // Sets view controller's activeScene and activeContainer
        didTransition: function() {
            var vc = this.get('context');
            if(vc.get('activeScene') || vc.get('activeContainer')) {
                vc.set('activeScene', null);
                vc.set('activeContainer', null);
            }
        },

        increaseZoom: function () {
            this.set('controller.zoomLevel', Math.round((this.get('controller.zoomLevel') + 0.1) * 100) / 100);
        },

        decreaseZoom: function () {
            this.set('controller.zoomLevel', Math.round((this.get('controller.zoomLevel') - 0.1) * 100) / 100);
        },

        rotate: function() {
            if(this.get('controller.isRotated')) {
                this.set('controller.isRotated', false);
            } else {
                this.set('controller.isRotated', true);
            }
        },

        addUiPhoneControl: function (receiver, controlType) {
            var container;
            if(receiver.constructor.toString() === 'App.ViewControllerController') {
                container = receiver.get('model');
            } else if(receiver.constructor.toString() === 'App.ViewController') {
                container = receiver;
            }
            console.log('Receiver of drop event: ' + container.get('name'));
            console.log('Type of receiver: ' + container.constructor.toString());

            /*
             Multiple VideoViews or AudioPlayers
             May not work for some devices
             */
            var videoViewAlert = false;
            var audioPlayerAlert = false;
            container.get('uiPhoneControls').forEach(function (item) {
                if (item.toString().indexOf('VideoView') > -1 && controlType === 'videoView') {
                    videoViewAlert = true;
                } else if (item.toString().indexOf('AudioPlayer') > -1 && controlType === 'audioPlayer') {
                    audioPlayerAlert = true;
                }
            });

            if (videoViewAlert) {
                alert('Multiple VideoViews in the same ViewControl, may not work within your real device!');
            } else if (audioPlayerAlert) {
                alert('Multiple AudioPlayers in the same ViewControl, may not work within your real device!');
            }

            var canInstantiate = true;

            /*
             Photo/Videocamera Controller, Audio Recorder and Map
             Must be instantiated at most once per ViewController
             */
            container.get('uiPhoneControls').forEach(function (item) {
                if (item.toString().indexOf('PhotocameraController') > -1 && controlType === 'photocameraController') {
                    alert('Only a single Photocamera Controller per each view is allowed!');
                    canInstantiate = false;
                } else if (item.toString().indexOf('VideocameraController') > -1 && controlType === 'videocameraController') {
                    alert('Only a single Videocamera Controller per each view is allowed!');
                    canInstantiate = false;
                } else if (item.toString().indexOf('AudioRecorder') > -1 && controlType === 'audioRecorder') {
                    alert('Only a single Audio Recorder per each view is allowed!');
                    canInstantiate = false;
                } else if (item.toString().indexOf('Map') > -1 && controlType === 'map') {
                    alert('Only a single Map per each view is allowed!');
                    canInstantiate = false;
                }
            });

            if (canInstantiate) {
                var uiPhoneControl = this.store.createRecord(controlType, {
                    viewController: container,
                    weightInChain: 1,
                    ratioWidth: 1,
                    ratioHeight: 1
                });

                uiPhoneControl.save().then(function (control) {
                    container.get('uiPhoneControls').addObject(control);
                    container.save();
                });
            }
        }
    }
});
