App.ReportViewComponent = Ember.Component.extend({
    tagName: 'div',
    classNames: ['report-text-area'],
    sceneBinding: 'controller.model',
    routerBinding: 'controller.target',

    didInsertElement: function() {
        this._super();
        if(this.get('scene')) {
            this.updateReport();
        }
    },

    parentViewDidChange: function() {
        this._super();
        if(this.get('scene')) {
            this.updateReport();
        }
    },

    updateReportObserver: function() {
        this.updateReport();
    }.observes('scene', 'router.location.lastSetURL', 'scene.application.device.type'),

    updateReport: function() {
        var self = this;
        if(!self.get('isDestroying') && self.get('element') && self.get('element').childNodes[4]) {
            self.get('vcController').getReportText().then(function(report) {
                if(!self.get('isDestroying') && self.get('element') && self.get('element').childNodes[4]) {
                    self.get('element').childNodes[4].innerHTML = report;
                }
            }).catch(function(f) {});
        }
    },

    actions: {
        updateReportAction: function() {
            this.updateReport();
        }
    }
});
