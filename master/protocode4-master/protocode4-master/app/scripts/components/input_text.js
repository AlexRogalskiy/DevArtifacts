App.InputTextComponent = Ember.Component.extend({
    attributeBindings: ['type'],

    actions: {
        acceptChanges: function () {
            this.sendAction();
        }
    },

    didInsertElement: function () {
        console.log("Disabling keyboard for all inputs of type number");
        $("[type='number']").keypress(function (evt) {
            evt.preventDefault();
        });
    }

});
