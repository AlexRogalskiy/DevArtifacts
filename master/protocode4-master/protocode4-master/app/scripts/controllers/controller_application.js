/*
 templates/application.hbs
 */
App.ApplicationController = Ember.ObjectController.extend(App.Saveable, {

    /*currentPathDidChange: function() {
        App.set('currentPath', this.get('currentPath'));
    }.observes('currentPath'),*/

    actions: {

        generateAppModel: function () {

            console.log(this);
            console.log(this.get('model'));
            /*console.log(this.get('model').then(function(model){

             return model.get('application') }));*/

            this.get('model').toXml().then(function (model) {
                var xmlString = '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(model.documentElement);
                var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;

                if (isSafari) {
                    window.alert("Safari browser has been detected!\nWe strongly reccomend you to use another browser to download the model automatically.\n\nManual download : \nPlease type ⌘+S to save the page as\nExport As: protocode.xmi\nFormat: Page Source");
                    var blob = new Blob(
                        [vkbeautify.xml(xmlString)], {
                            type: "text/xml;charset=ASCII"
                        });
                } else {
                    var blob = new Blob(
                        [vkbeautify.xml(xmlString)], {
                            type: "application/xml;charset=ASCII"

                        });
                }

                saveAs(blob, "protocode.xmi");
            });
        }
    }
});
