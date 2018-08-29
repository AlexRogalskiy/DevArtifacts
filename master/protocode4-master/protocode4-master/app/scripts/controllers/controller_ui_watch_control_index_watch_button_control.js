/*
 templates/control_watch_button/index.hbs
 */
App.ControlWatchButtonIndexController = App.UiWatchControlController.extend(App.WatchClickListenable, {
    needs: ['watchControllers']
});
