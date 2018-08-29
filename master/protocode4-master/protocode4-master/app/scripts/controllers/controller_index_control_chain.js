/*
 templates/control_chain/index.hbs
 */
App.ControlChainIndexController = Ember.ObjectController.extend(App.Saveable, {
    needs: ['scenes'],
    axises: ['horizontal', 'vertical'],
    baseTypes: ['spread', 'spread_inside', 'packed', 'weighted'],
    uiControlTypes: [
        'button',
        'label',
        'editText',
        'spinner',
        'switch',
        'slider',
        'webView',
        'imageView',
        'videoView',
        'audioPlayer',
        'photocameraController',
        'videocameraController',
        'audioRecorder',
        'map',
        'datepicker',
        'timepicker',
        /*'listView',
        'gridView',
        'card'*/
    ],
    newControlType: null,

    types: function() {
        var canBeWeighted = true;
        if(this.get('axis') === 'horizontal') {
            this.get('model.uiPhoneControls').forEach(function(control) {
                if(control.get('isWidthConstrained') || control.get('isWidthPercentConstrained')) {
                    canBeWeighted = false;
                }
            });
        } else {
            this.get('model.uiPhoneControls').forEach(function(control) {
                if(control.get('isHeightConstrained') || control.get('isHeightPercentConstrained')) {
                    canBeWeighted = false;
                }
            });
        }
        if(canBeWeighted) {
            return this.get('baseTypes');
        }
        return this.get('baseTypes').without('weighted');
    }.property(
        'model.axis',
        'model.uiPhoneControls.@each.isWidthConstrained',
        'model.uiPhoneControls.@each.isHeightConstrained',
        'model.uiPhoneControls.@each.isWidthPercentConstrained',
        'model.uiPhoneControls.@each.isHeightPercentConstrained',
        'baseTypes'
    ),

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

    // USED by partial _invalid_report.hbs
    invalidReport: function() {
        if(this.get('model') && !this.get('model.valid')) {
            return 'ERROR: chain is invalid due to the number of phone controls: it contains only '
                + this.get('model.uiPhoneControls.length') +
                ' controls (control chains must have at least 2 phone controls).\nFor this reason it won\'t be exported in the model.';
        }
        return null;
    }.property(
        'model.valid',
        'model.uiPhoneControls.length'
    ),
    // END partial _invalid_report.hbs

    warningReport: function() {
        if(this.get('model') && this.get('types').find(function(type) { return type === 'weighted' }) === undefined) {
            if(this.get('model.axis') === 'horizontal') {
                return 'WARNING: chain type can\'t be \"weighted\" because one of the chain\'s controls has a constraint on width.';
            } else {
                return 'WARNING: chain type can\'t be \"weighted\" because one of the chain\'s controls has a constraint on height.';
            }
        }
        return null;
    }.property(
        'types',
        'model.axis'
    ),

    actions: {
        addControl: function() {
            var chain = this.get('model');
            if(this.get('newControlType')) {
                var newControlType = this.get('newControlType');
                var canInstantiate = true;
                /*
                 Photo/Videocamera Controller, Audio Recorder and Map
                 Must be instantiated at most once per ViewController
                 */
                this.get('model.viewController.uiPhoneControls').forEach(function (item) {
                    if (item.toString().indexOf('PhotocameraController') > -1 && newControlType === 'photocameraController') {
                        alert('Only a single Photocamera Controller per each view is allowed!');
                        canInstantiate = false;
                    } else if (item.toString().indexOf('VideocameraController') > -1 && newControlType === 'videocameraController') {
                        alert('Only a single Videocamera Controller per each view is allowed!');
                        canInstantiate = false;
                    } else if (item.toString().indexOf('AudioRecorder') > -1 && newControlType === 'audioRecorder') {
                        alert('Only a single Audio Recorder per each view is allowed!');
                        canInstantiate = false;
                    } else if (item.toString().indexOf('Map') > -1 && newControlType === 'map') {
                        alert('Only a single Map per each view is allowed!');
                        canInstantiate = false;
                    }
                });

                if(canInstantiate) {
                    var newControl = this.store.createRecord(newControlType, {
                        viewController: chain.get('viewController'),
                        controlChain: chain,
                        weightInChain: 1,
                        ratioWidth: 1,
                        ratioHeight: 1
                    });
                    chain.get('uiPhoneControls').pushObject(newControl);
                    newControl.save();
                    chain.get('viewController').save();
                    chain.save();
                }
            }
        }
    }
});
