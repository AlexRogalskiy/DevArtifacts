App.Router.map(function () {
    this.resource('editor', function () {
        this.resource('watchControllers', function () {
            this.resource('watchController', {
                path: '/watchController/:watchController_id'
            }, function () {
                this.resource('dispatchUiWatchControl', {
                    path: '/uiWatchControl/:ui_watch_control_id'
                }, function () {
                });
                this.resource('controlWatchButton', {
                    path: '/watchButton/:watch_button_id'
                }, function () {
                });
                this.resource('controlWatchLabel', {
                    path: '/watchLabel/:watch_label_id'
                }, function () {
                });
                this.resource('controlWatchVoiceMessage', {
                    path: '/watchVoiceMessage/:watch_voice_message_id'
                }, function () {
                });
                this.resource('controlWatchSwitch', {
                    path: '/watchSwitch/:watch_switch_id'
                }, function () {
                });
                this.resource('controlWatchSlider', {
                    path: '/watchSlider/:watch_slider_id'
                }, function () {
                });
            });
        });
        this.resource('scenes', function () {
            this.resource('viewController', {
                path: '/viewController/:viewController_id'
            }, function () {
                this.resource('viewController.dispatchUiPhoneControl', {
                    path: '/uiPhoneControl/:ui_phone_control_id'
                }, function () {
                });
                this.resource('viewController.controlAudioPlayer', {
                    path: '/audioPlayer/:audioPlayer_id'
                }, function () {
                });
                this.resource('viewController.controlAudioRecorder', {
                    path: '/audioRecorder/:audioRecorder_id'
                }, function () {
                });
                this.resource('viewController.controlButton', {
                    path: '/button/:button_id'
                }, function () {
                });
                this.resource('viewController.controlCard', {
                    path: '/card/:card_id'
                }, function () {
                });
                this.resource('viewController.controlEditText', {
                    path: '/editText/:editText_id'
                }, function () {
                });
                this.resource('viewController.controlGridView', {
                    path: '/gridView/:gridView_id'
                }, function () {
                });
                this.resource('viewController.controlGridViewCell', {
                    path: '/gridViewCell/:gridViewCell_id'
                }, function () {
                });
                this.resource('viewController.controlImageView', {
                    path: '/imageView/:imageView_id'
                }, function () {
                });
                this.resource('viewController.controlLabel', {
                    path: '/label/:label_id'
                }, function () {
                });
                this.resource('viewController.controlListView', {
                    path: '/listView/:listView_id'
                }, function () {
                });
                this.resource('viewController.controlListViewCell', {
                    path: '/listViewCell/:listViewCell_id'
                }, function () {
                });
                this.resource('viewController.controlMap', {
                    path: '/map/:map_id'
                }, function () {
                });
                this.resource('viewController.controlDatepicker', {
                    path: '/datepicker/:datepicker_id'
                }, function () {
                });
                this.resource('viewController.controlTimepicker', {
                    path: '/timepicker/:timepicker_id'
                }, function () {
                });
                this.resource('viewController.controlSwitch', {
                    path: '/switch/:switch_id'
                }, function () {
                });
                this.resource('viewController.controlSlider', {
                    path: '/slider/:slider_id'
                }, function () {
                });
                this.resource('viewController.controlSpinner', {
                    path: '/spinner/:spinner_id'
                }, function () {
                });
                this.resource('viewController.controlPhotocameraController', {
                    path: '/photocameraController/:photocameraController_id'
                }, function () {
                });
                this.resource('viewController.controlVideocameraController', {
                    path: '/videocameraController/:videocameraController_id'
                }, function () {
                });
                this.resource('viewController.controlVideoView', {
                    path: '/videoView/:videoView_id'
                }, function () {
                });
                this.resource('viewController.controlWebView', {
                    path: '/webView/:webView_id'
                }, function () {
                });
                this.resource('viewController.asyncTask', {
                    path: '/asyncTask/:async_task_id'
                }, function () {
                });
                this.resource('viewController.alertDialog', {
                    path: '/alertDialog/:alert_dialog_id'
                }, function () {
                });
                this.resource('viewController.progressDialog', {
                    path: '/progressDialog/:progress_dialog_id'
                }, function () {
                });
                this.resource('viewController.constraint', {
                    path: '/constraint/:constraint_id'
                }, function () {
                });
                this.resource('viewController.controlChain', {
                    path: '/controlChain/:controlChain_id'
                }, function () {
                });
            });
            this.resource('scene', {
                path: '/scene/:scene_id'
            }, function () {
                this.resource('vc', {
                    path: '/vc/:viewController_id'
                }, function () {
                });
                this.resource('appMenu', {
                    path: '/menu/:menu_id'
                }, function () {
                });
                this.resource('appMenuItem', {
                    path: '/menuItem/:menu_item_id'
                }, function () {
                });
                this.resource('scene.dispatchUiPhoneControl', {
                    path: '/uiPhoneControl/:ui_phone_control_id'
                }, function () {
                });
                this.resource('scene.controlAudioPlayer', {
                    path: '/audioPlayer/:audioPlayer_id'
                }, function () {
                });
                this.resource('scene.controlAudioRecorder', {
                    path: '/audioRecorder/:audioRecorder_id'
                }, function () {
                });
                this.resource('scene.controlButton', {
                    path: '/button/:button_id'
                }, function () {
                });
                this.resource('scene.controlCard', {
                    path: '/card/:card_id'
                }, function () {
                });
                this.resource('controlContainer', {
                    path: '/container/:container_id'
                }, function () {
                });
                this.resource('scene.controlEditText', {
                    path: '/editText/:editText_id'
                }, function () {
                });
                this.resource('scene.controlGridView', {
                    path: '/gridView/:gridView_id'
                }, function () {
                });
                this.resource('scene.controlGridViewCell', {
                    path: '/gridViewCell/:gridViewCell_id'
                }, function () {
                });
                this.resource('scene.controlImageView', {
                    path: '/imageView/:imageView_id'
                }, function () {
                });
                this.resource('scene.controlLabel', {
                    path: '/label/:label_id'
                }, function () {
                });
                this.resource('scene.controlListView', {
                    path: '/listView/:listView_id'
                }, function () {
                });
                this.resource('scene.controlListViewCell', {
                    path: '/listViewCell/:listViewCell_id'
                }, function () {
                });
                this.resource('scene.controlMap', {
                    path: '/map/:map_id'
                }, function () {
                });
                this.resource('scene.controlDatepicker', {
                    path: '/datepicker/:datepicker_id'
                }, function () {
                });
                this.resource('scene.controlTimepicker', {
                    path: '/timepicker/:timepicker_id'
                }, function () {
                });
                this.resource('scene.controlSwitch', {
                    path: '/switch/:switch_id'
                }, function () {
                });
                this.resource('scene.controlSlider', {
                    path: '/slider/:slider_id'
                }, function () {
                });
                this.resource('scene.controlSpinner', {
                    path: '/spinner/:spinner_id'
                }, function () {
                });
                this.resource('scene.controlPhotocameraController', {
                    path: '/photocameraController/:photocameraController_id'
                }, function () {
                });
                this.resource('scene.controlVideocameraController', {
                    path: '/videocameraController/:videocameraController_id'
                }, function () {
                });
                this.resource('scene.controlVideoView', {
                    path: '/videoView/:videoView_id'
                }, function () {
                });
                this.resource('scene.controlWebView', {
                    path: '/webView/:webView_id'
                }, function () {
                });
                this.resource('scene.asyncTask', {
                    path: '/asyncTask/:async_task_id'
                }, function () {
                });
                this.resource('scene.alertDialog', {
                    path: '/alertDialog/:alert_dialog_id'
                }, function () {
                });
                this.resource('scene.progressDialog', {
                    path: '/progressDialog/:progress_dialog_id'
                }, function () {
                });
                this.resource('scene.constraint', {
                    path: '/constraint/:constraint_id'
                }, function () {
                });
                this.resource('scene.controlChain', {
                    path: '/controlChain/:controlChain_id'
                }, function () {
                });
            });
        });
    });

    this.resource('data_model_editor', function () {
        this.resource('preference_handler', function () {
            this.resource('preference_records', function () {
            });
        });
        this.resource('database_handler', function () {
            this.resource('entities', function () {
                this.resource('entity', {
                    path: '/entity/:entity_id'
                }, function () {
                });
            });
        });
        this.resource('storage_handler', function () {
            this.resource('storage_records', function () {
            });
        });
        this.resource('cloud_handler', function () {
            this.resource('cloud_objects', function () {
                this.resource('cloud_object', {
                    path: '/cloud_object/:cloud_object_id'
                }, function () {
                });
            });
        });
    });

    this.resource('uiPhoneControls');
    this.resource('uiWatchControls');
    this.resource('about');
    this.resource('model');
});
