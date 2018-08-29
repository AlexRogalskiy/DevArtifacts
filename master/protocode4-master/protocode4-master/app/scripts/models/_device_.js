App.Device = DS.Model.extend({
    name: DS.attr('string'),
    label: DS.attr('string'),
    type: DS.attr('string'),
    platform: DS.attr('string'),
    viewTop: DS.attr('number'),
    viewBottom: DS.attr('number'),
    screenWidth: DS.attr('number'),
    screenHeight: DS.attr('number'),
    cssWidth: DS.attr('number'),
    cssHeight: DS.attr('number'),

    centerX: function() {
        return (this.get('screenWidth') / 2);
    }.property('width'),

    centerY: function() {
        return this.get('viewTop') + ((this.get('viewBottom') - this.get('viewTop')) / 2);
    }.property('height')
});
