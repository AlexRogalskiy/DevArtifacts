App.UiControl = DS.Model.extend({
    name: DS.attr('string'),

    posX: DS.attr('number', {defaultValue: 0}),
    posY: DS.attr('number', {defaultValue: 0}),

    paddingTop: DS.attr('number', {defaultValue: 0}),
    paddingBottom: DS.attr('number', {defaultValue: 0}),
    paddingStart: DS.attr('number', {defaultValue: 0}),
    paddingEnd: DS.attr('number', {defaultValue: 0}),

    marginTop: DS.attr('number', {defaultValue: 0}),
    marginBottom: DS.attr('number', {defaultValue: 0}),
    marginStart: DS.attr('number', {defaultValue: 0}),
    marginEnd: DS.attr('number', {defaultValue: 0}),

});
