App.EditText = App.UiPhoneControl.extend({
    title: DS.attr('string', {defaultValue: ''}),
    placeholder: DS.attr('string', {defaultValue: 'EditText'}),
    minWidth: 88,
    minHeight: 36,
    defaultWidth: 88,
    defaultHeight: 36,
    widthFixed: DS.attr('number', {defaultValue: 88}),
    heightFixed: DS.attr('number', {defaultValue: 36}),

    textColor: DS.attr('string', {defaultValue: '#000000'}),
    textSize: DS.attr('number', {defaultValue: 16}),

    xmlName: 'editTexts',

    toXml: function (xmlDoc) {
        var elem = xmlDoc.createElement(this.get('xmlName'));
        this.decorateXml(xmlDoc, elem);

        elem.setAttribute('initialContent', this.get('title'));
        elem.setAttribute('placeholder', this.get('placeholder'));

        elem.setAttribute('textColor', this.get('textColor'));
        elem.setAttribute('textSize', this.get('textSize'));

        return elem;
    }
});

/*
 App.EditText.FIXTURES = [
 {
 id: 4,
 name: 'EditText1',
 title: 'Edit Text 1',
 posX: 30,
 posY: 200,
 paddingTop: 0,
 paddingBottom: 0,
 paddingStart: 0,
 paddingEnd: 0,
 marginTop: 0,
 marginBottom: 0,
 marginStart: 0,
 marginEnd: 0,
 alignParentTop: false,
 alignParentBottom: false,
 alignParentStart: false,
 alignParentEnd: false,
 width: 90,
 height: 30,
 viewController: 1,
 parentContainer: null
 }
 ];*/
