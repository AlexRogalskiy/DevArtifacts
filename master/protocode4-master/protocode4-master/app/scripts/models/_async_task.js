App.AsyncTask = DS.Model.extend({
    name: DS.attr('string', {defaultValue: 'asyncTask'}),

    viewController: DS.belongsTo('viewController', {inverse: 'asyncTasks'}),

    xmlName: 'asyncTasks',

    toXml: function (xmlDoc) {
        var elem = xmlDoc.createElement(this.get('xmlName'));

        elem.setAttribute('name', this.get('name'));

        return elem;
    },

    didCreate: function () {
        this.set('name', this.get('id').replace(/[0-9]/g, '') + this.constructor.toString().split(".")[1]);
        this.save();
    }

});
