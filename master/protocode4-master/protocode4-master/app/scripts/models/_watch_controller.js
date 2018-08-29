App.WatchController = DS.Model.extend({
    name: DS.attr('string'),
    launcher: DS.attr('boolean', {defaultValue: false}),

    application: DS.belongsTo('application', {inverse: 'watchControllers'}),

    uiWatchControls: DS.hasMany('uiWatchControl', {polymorphic: true, async: true}),

    xmlName: 'watchControllers',

    deleteRecord: function () {
        var self = this;

        this.get('uiWatchControls').then(function (uiWatchControls) {
            uiWatchControls.forEach(function (uiWatchControl) {
                Ember.run.once(self, function () {
                    uiWatchControl.deleteRecord();
                    uiWatchControl.save();
                });
            });
        });

        this._super();
    },

    toXml: function (xmlDoc) {
        var self = this;

        return new Promise(function (resolve) {
            var watchController = xmlDoc.createElement(self.get('xmlName'));
            watchController.setAttribute('name', self.get('name'));
            watchController.setAttribute('launcher', self.get('launcher'));

            self.get('uiWatchControls').then(function (uiWatchControls) {

                Promise.all(uiWatchControls.map(function (uiWatchControl) {
                    return uiWatchControl.toXml(xmlDoc);
                })).then(function (uiWatchControlXmls) {

                    uiWatchControlXmls.map(function (xml) {

                        watchController.appendChild(xml);

                    });

                    resolve(watchController);

                });
            });
        });
    },

    getRefPath: function (path) {
        return '//@' + this.get('xmlName') + '[name=\'' + this.get('name') + '\']' + path;
    }

});
