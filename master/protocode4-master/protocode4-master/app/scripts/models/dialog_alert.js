App.AlertDialog = App.Dialog.extend({

    viewController: DS.belongsTo('viewController', {inverse: 'alertDialogs'}),

    xmlName: 'alertDialogs'
});
