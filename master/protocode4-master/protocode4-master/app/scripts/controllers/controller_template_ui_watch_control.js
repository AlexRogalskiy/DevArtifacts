/*

 */
App.UiWatchControlTemplateController = Ember.ObjectController.extend({
    needs: ['editor'],

    imageSource: function () {
        var platform = this.get('controllers.editor.smartwatch.platform');
        return 'img/ui_watch_controls/' + platform + '/' + this.get('model.nameImg');
    }.property('controllers.editor.smartwatch.platform')

});
