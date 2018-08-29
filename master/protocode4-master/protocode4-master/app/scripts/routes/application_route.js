/*
 templates/application.hbs
 */
App.ApplicationRoute = Ember.Route.extend({

    setupController: function (controller, model) {
        this._super(controller, model);
        controller.set('model', model.application);
    },

    model: function () {
        return Ember.RSVP.hash({
            application: this.store.find('application').then(function (dataArray) {
                return dataArray.objectAt(0);
            }),

            //data part
            dataHandler: this.store.find('dataHandler'),
            prefHandler: this.store.find('prefHandler'),
            storageHandler: this.store.find('storageHandler'),
            databaseHandler: this.store.find('databaseHandler'),
            cloudHandler: this.store.find('cloudHandler'),

            prefRecords: this.store.find('prefRecord'),
            storageRecords: this.store.find('storageRecord'),
            cloudObjects: this.store.find('cloudObject'),
            entities: this.store.find('entity'),

            objectAttributes: this.store.find('objectAttribute'),
            entityAttributes: this.store.find('entityAttribute'),

            entityRelationships: this.store.find('entityRelationship'),

            // view part
            scenes: this.store.find('scene'),
            viewControllers: this.store.find('viewController'),
            watchControllers: this.store.find('watchController'),

            smartphones: this.store.find('smartphone'),
            smartwatches: this.store.find('smartwatch'),
            tablets: this.store.find('tablet'),

            menu: this.store.find('menu'),
            menuItems: this.store.find('menuItem'),

            listViewCells: this.store.find('listViewCell'),
            gridViewCells: this.store.find('gridViewCell'),

            asyncTasks: this.store.find('asyncTask'),
            alertDialogs: this.store.find('alertDialog'),
            progressDialogs: this.store.find('progressDialog'),

            watchClickListeners: this.store.find('watchClickListener'),
            navigations: this.store.find('navigation'),
            watchNavigations: this.store.find('watchNavigation'),
            sourceTypes: this.store.find('sourceType'),

            // UiPhoneControls
            audioPlayers: this.store.find('audioPlayer'),
            audioRecorders: this.store.find('audioRecorder'),
            buttons: this.store.find('button'),
            cards: this.store.find('card'),
            editTexts: this.store.find('editText'),
            gridViews: this.store.find('gridView'),
            imageViews: this.store.find('imageView'),
            labels: this.store.find('label'),
            listViews: this.store.find('listView'),
            maps: this.store.find('map'),
            datepickers: this.store.find('datepicker'),
            timepickers: this.store.find('timepicker'),
            photocameraControllers: this.store.find('photocameraController'),
            sliders: this.store.find('slider'),
            spinners: this.store.find('spinner'),
            switches: this.store.find('switch'),
            videoViews: this.store.find('videoView'),
            videocameraControllers: this.store.find('videocameraController'),
            webViews: this.store.find('webView'),
            containers: this.store.find('container'),
            constraints: this.store.find('constraint'),
            chains: this.store.find('controlChain'),

            // UiWatchControls
            watchButtons: this.store.find('watchButton'),
            watchLabels: this.store.find('watchLabel'),
            watchSliders: this.store.find('watchSlider'),
            watchSwitches: this.store.find('watchSwitch'),
            watchVoiceMessages: this.store.find('watchVoiceMessage')

        });
    },

    actions: {

        deleteApp: function () {
            if (confirm('Are you sure to delete the app?')) {
                var self = this;

                var models = [
                    'application',
                    'dataHandler',
                    'cloudHandler',
                    'prefHandler',
                    'storageHandler',
                    'databaseHandler',
                    'entity',
                    'cloudObject',
                    'prefRecord',
                    'storageRecord',
                    'entityRelationship',
                    'entityAttribute',
                    'objectAttribute',
                    'scene',
                    'viewController',
                    'watchController',
                    'smartphone',
                    'tablet',
                    'smartwatch',
                    'uiPhoneControlTemplate',
                    'uiWatchControlTemplate'
                ];

                models.map(function (model) {
                    Ember.run.once(self, function () {
                        self.store.findAll(model).then(function (array) {
                            array.forEach(function (data) {
                                Ember.run.once(self, function () {
                                    data.deleteRecord();
                                    data.save();
                                });
                            });
                        });
                    });
                });

                this.transitionTo('application');
                this.get('controller').set('model', null);
            }
        },

        createApp: function (model) {
            var self = this;

            this.store.createRecord('smartphone', {
                name: 'iPhoneX',
                label: 'Phone: iOS (375x812) iPhone X',
                type: 'smartphone',
                platform: 'ios',
                //Altezza status bar in points
                viewTop: 50, // 87 - 37 status_bar
                //Altezza schermo in points
                viewBottom: 775, // 812 - 37 status bar
                //Dimensioni in points
                screenWidth: 375,
                screenHeight: 775, // 812 - 37 status bar
                //Dimensioni in px - padding css
                cssWidth: 375,
                cssHeight: 775 // 812 - 37 status bar
            }).save().then(function (smartphone) {
                self.store.createRecord('smartwatch', {
                    name: 'AppleWatch',
                    label: 'WatchOS (156x195) Apple Watch 42mm',
                    type: 'smartwatch',
                    platform: 'watchos',
                    viewTop: 22,
                    viewBottom: 195,
                    screenWidth: 156,
                    screenHeight: 195,
                    cssWidth: 156,
                    cssHeight: 195
                }).save().then(
                    function (smartwatch) {
                        self.store.createRecord('menu').save().then(
                            function (newMenu) {
                                self.store.createRecord('dataHandler', {id: 'dH1'}).save().then(
                                    function (dataHandler) {
                                        self.store.createRecord('application', {id: 'newAppId'}).save().then(
                                            function (app) {

                                                dataHandler.set('application', app);
                                                app.set('dataHandler', dataHandler);
                                                app.set('smartphone', smartphone);
                                                app.set('smartwatch', smartwatch);
                                                app.set('menu', newMenu);
                                                app.save();
                                                newMenu.save();
                                                smartwatch.save();
                                                smartphone.save();
                                                dataHandler.save();

                                                self.store.createRecord('smartwatch', {
                                                    name: 'AsusZenWatch',
                                                    label: 'AndroidWear (213x213) Asus Zen Watch',
                                                    type: 'smartwatch',
                                                    platform: 'androidwear',
                                                    viewTop: 0,
                                                    viewBottom: 213,
                                                    //Dimensioni in dp
                                                    screenWidth: 213,
                                                    screenHeight: 213,
                                                    //Dimensioni in px - padding css
                                                    cssWidth: 213,
                                                    cssHeight: 213
                                                }).save();

                                                self.store.createRecord('smartwatch', {
                                                    name: 'Moto360',
                                                    label: 'AndroidWear (241x248) Moto 360',
                                                    type: 'smartwatch',
                                                    platform: 'androidwear',
                                                    viewTop: 0,
                                                    viewBottom: 248,
                                                    //Dimensioni in dp
                                                    screenWidth: 241,
                                                    screenHeight: 248,
                                                    //Dimensioni in px - padding css
                                                    cssWidth: 241,
                                                    cssHeight: 248
                                                }).save();

                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                );
            });

            this.store.createRecord('smartphone', {
                name: 'iPhone7Plus',
                label: 'Phone: iOS (414x736) iPhone 7 Plus',
                type: 'smartphone',
                platform: 'ios',
                //Altezza status bar in points
                viewTop: 64,
                //Altezza schermo in points
                viewBottom: 736,
                //Dimensioni in points
                screenWidth: 414,
                screenHeight: 736,
                //Dimensioni in px - padding css
                cssWidth: 414,
                cssHeight: 736
            }).save();

            this.store.createRecord('smartphone', {
                name: 'iPhone7',
                label: 'Phone: iOS (375x667) iPhone 7',
                type: 'smartphone',
                platform: 'ios',
                //Altezza status bar in points
                viewTop: 65,
                //Altezza schermo in points
                viewBottom: 667,
                //Dimensioni in points
                screenWidth: 375,
                screenHeight: 667,
                //Dimensioni in px - padding css
                cssWidth: 375,
                cssHeight: 667
            }).save();

            this.store.createRecord('smartphone', {
                name: 'iPhone6Plus',
                label: 'Phone: iOS (414x736) iPhone 6 Plus',
                type: 'smartphone',
                platform: 'ios',
                //Altezza status bar in points
                viewTop: 64,
                //Altezza schermo in points
                viewBottom: 736,
                //Dimensioni in points
                screenWidth: 414,
                screenHeight: 736,
                //Dimensioni in px - padding css
                cssWidth: 414,
                cssHeight: 736
            }).save();

            this.store.createRecord('smartphone', {
                name: 'iPhone6',
                label: 'Phone: iOS (375x667) iPhone 6',
                type: 'smartphone',
                platform: 'ios',
                //Altezza status bar in points
                viewTop: 65,
                //Altezza schermo in points
                viewBottom: 667,
                //Dimensioni in points
                screenWidth: 375,
                screenHeight: 667,
                //Dimensioni in px - padding css
                cssWidth: 375,
                cssHeight: 667
            }).save();

            this.store.createRecord('smartphone', {
                name: 'iPhone5',
                label: 'Phone: iOS (320x568) iPhone 5',
                type: 'smartphone',
                platform: 'ios',
                //Altezza status bar in points
                viewTop: 65,
                //Altezza schermo in points
                viewBottom: 568,
                //Dimensioni in points
                screenWidth: 320,
                screenHeight: 568,
                //Dimensioni in px - padding css
                cssWidth: 320,
                cssHeight: 568
            }).save();

            this.store.createRecord('tablet', {
                name: 'iPad12_9',
                label: 'Tablet: iOS (1366x1024) iPad Pro 12.9\"',
                type: 'tablet',
                platform: 'ios',
                //Altezza status bar in points
                viewTop: 65,
                //Altezza schermo in points
                viewBottom: 1024,
                //Dimensioni in points
                screenWidth: 1366,
                screenHeight: 1024,
                //Dimensioni in px - padding css
                cssWidth: 1366,
                cssHeight: 1024
            }).save();

            this.store.createRecord('tablet', {
                name: 'iPad9_7',
                label: 'Tablet: iOS (1024x768) iPad Air/Pro 9.7\"',
                type: 'tablet',
                platform: 'ios',
                //Altezza status bar in points
                viewTop: 65,
                //Altezza schermo in points
                viewBottom: 768,
                //Dimensioni in points
                screenWidth: 1024,
                screenHeight: 768,
                //Dimensioni in px - padding css
                cssWidth: 1024,
                cssHeight: 768
            }).save();

            this.store.createRecord('smartphone', {
                name: 'GooglePixel',
                label: 'Phone: Android (411x731) Google Pixel ',
                type: 'smartphone',
                platform: 'android',
                //Altezza status bar(30) + toolbar(64) in dp
                viewTop: 93,
                //Altezza schermo (731) - altezza command bar(55) in dp
                viewBottom: 675,
                //Dimensioni in dp
                screenWidth: 411,
                screenHeight: 731,
                //Dimensioni in px - padding css
                cssWidth: 411,
                cssHeight: 731
            }).save();

            this.store.createRecord('smartphone', {
                name: 'Nexus6P',
                label: 'Phone: Android (411x731) Nexus 6P ',
                type: 'smartphone',
                platform: 'android',
                //Altezza status bar(30) + toolbar(64) in dp
                viewTop: 93,
                //Altezza schermo (731) - altezza command bar(55) in dp
                viewBottom: 675,
                //Dimensioni in dp
                screenWidth: 411,
                screenHeight: 731,
                //Dimensioni in px - padding css
                cssWidth: 411,
                cssHeight: 731
            }).save();

            this.store.createRecord('smartphone', {
                name: 'Nexus5',
                label: 'Phone: Android (360x640) Nexus 5 ',
                type: 'smartphone',
                platform: 'android',
                //Altezza status bar(23) + toolbar(56) in dp
                viewTop: 79,
                //Altezza schermo (640) - altezza command bar(47) in dp
                viewBottom: 593,
                //Dimensioni in dp
                screenWidth: 360,
                screenHeight: 640,
                //Dimensioni in px - padding css
                cssWidth: 360,
                cssHeight: 640
            }).save();

            this.store.createRecord('tablet', {
                name: 'Nexus7',
                label: 'Tablet: Android (960x600) Nexus 7 ',
                type: 'tablet',
                platform: 'android',
                //Altezza status bar(24) + toolbar(64) in dp
                viewTop: 88,
                //Altezza schermo (600) - altezza command bar(47) in dp
                viewBottom: 553,
                //Dimensioni in points
                screenWidth: 960,
                screenHeight: 600,
                //Dimensioni in px - padding css
                cssWidth: 960,
                cssHeight: 600
            }).save();

            this.store.createRecord('tablet', {
                name: 'Nexus9',
                label: 'Tablet: Android (1024x768) Nexus 9 ',
                type: 'tablet',
                platform: 'android',
                //Altezza status bar(24) + toolbar(64) in dp
                viewTop: 88,
                //Altezza schermo (768) - altezza command bar(47) in dp
                viewBottom: 721,
                //Dimensioni in points
                screenWidth: 1024,
                screenHeight: 768,
                //Dimensioni in px - padding css
                cssWidth: 1024,
                cssHeight: 768
            }).save();

            this.store.createRecord('tablet', {
                name: 'Nexus10',
                label: 'Tablet: Android (1280x800) Nexus 10 ',
                type: 'tablet',
                platform: 'android',
                //Altezza status bar(24) + toolbar(64) in dp
                viewTop: 88,
                //Altezza schermo (800) - altezza command bar(47) in dp
                viewBottom: 753,
                //Dimensioni in points
                screenWidth: 1280,
                screenHeight: 800,
                //Dimensioni in px - padding css
                cssWidth: 1280,
                cssHeight: 800
            }).save();

            this.store.createRecord('uiPhoneControlTemplate', {
                label: 'Button',
                nameImg: 'button.png',
                type: 'button'
            }).save();
            this.store.createRecord('uiPhoneControlTemplate', {
                label: 'Label',
                nameImg: 'label.png',
                type: 'label'
            }).save();
            this.store.createRecord('uiPhoneControlTemplate', {
                label: 'Edit Text',
                nameImg: 'edittext.png',
                type: 'editText'
            }).save();
            this.store.createRecord('uiPhoneControlTemplate', {
                label: 'Spinner',
                nameImg: 'spinner.png',
                type: 'spinner'
            }).save();
            this.store.createRecord('uiPhoneControlTemplate', {
                label: 'Switch',
                nameImg: 'switch.png',
                type: 'switch'
            }).save();
            this.store.createRecord('uiPhoneControlTemplate', {
                label: 'Slider',
                nameImg: 'slider.png',
                type: 'slider'
            }).save();
            this.store.createRecord('uiPhoneControlTemplate', {
                label: 'Web View',
                nameImg: 'webview.png',
                type: 'webView'
            }).save();
            this.store.createRecord('uiPhoneControlTemplate', {
                label: 'Image View',
                nameImg: 'imageview.png',
                type: 'imageView'
            }).save();
            this.store.createRecord('uiPhoneControlTemplate', {
                label: 'Video View',
                nameImg: 'videoview.png',
                type: 'videoView'
            }).save();
            this.store.createRecord('uiPhoneControlTemplate', {
                label: 'Audio Player',
                nameImg: 'audioplayer.png',
                type: 'audioPlayer'
            }).save();
            this.store.createRecord('uiPhoneControlTemplate', {
                label: 'List View',
                nameImg: 'listview.png',
                type: 'listView'
            }).save();
            this.store.createRecord('uiPhoneControlTemplate', {
                label: 'Grid View',
                nameImg: 'gridview.png',
                type: 'gridView'
            }).save();
            this.store.createRecord('uiPhoneControlTemplate', {
                label: 'Photocamera Controller',
                nameImg: 'photocameracontroller.png',
                type: 'photocameraController'
            }).save();
            this.store.createRecord('uiPhoneControlTemplate', {
                label: 'Videocamera Controller',
                nameImg: 'videocameracontroller.png',
                type: 'videocameraController'
            }).save();
            this.store.createRecord('uiPhoneControlTemplate', {
                label: 'Audio Recorder',
                nameImg: 'audiorecorder.png',
                type: 'audioRecorder'
            }).save();
            this.store.createRecord('uiPhoneControlTemplate', {
                label: 'Map',
                nameImg: 'map.png',
                type: 'map'
            }).save();
            this.store.createRecord('uiPhoneControlTemplate', {
                label: 'Datepicker',
                nameImg: 'datepicker.png',
                type: 'datepicker'
            }).save();
            this.store.createRecord('uiPhoneControlTemplate', {
                label: 'Timepicker',
                nameImg: 'timepicker.png',
                type: 'timepicker'
            }).save();
            this.store.createRecord('uiPhoneControlTemplate', {
                label: 'Card',
                nameImg: 'card.png',
                type: 'card'
            }).save();

            this.store.createRecord('uiWatchControlTemplate', {
                label: 'Watch Button',
                nameImg: 'watch_button.png',
                type: 'watchButton'
            }).save();
            this.store.createRecord('uiWatchControlTemplate', {
                label: 'Watch Label',
                nameImg: 'watch_label.png',
                type: 'watchLabel'
            }).save();
            this.store.createRecord('uiWatchControlTemplate', {
                label: 'Watch Slider',
                nameImg: 'watch_slider.png',
                type: 'watchSlider'
            }).save();
            this.store.createRecord('uiWatchControlTemplate', {
                label: 'Watch Switch',
                nameImg: 'watch_switch.png',
                type: 'watchSwitch'
            }).save();
            this.store.createRecord('uiWatchControlTemplate', {
                label: 'Watch Voice Message',
                nameImg: 'watch_voice_message.png',
                type: 'watchVoiceMessage'
            }).save();

            window.location.reload(true);
        }
    }
});
