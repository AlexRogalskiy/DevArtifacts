/*
 templates/data_model_editor.hbs
 */
App.DataModelEditorRoute = Ember.Route.extend({

    model: function () {

        return this.store.find('dataHandler', 'dH1');
    }
});
