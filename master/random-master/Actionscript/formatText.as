class formatText {

    static function basicText(textPassed, isBorder:Boolean, isSelectable:Boolean, autoSizeDirection:String, fontSize:Number, fontColor, fontName:String, isEmbed:Boolean) {

        textPassed.border = isBorder;
        textPassed.selectable = isSelectable;
        textPassed.autoSize = autoSizeDirection;

        var myTxtFormat:TextFormat = new TextFormat();
        myTxtFormat.size = fontSize;
        myTxtFormat.color = fontColor;
        myTxtFormat.font = fontName;

        textPassed.embedFonts = isEmbed;
        textPassed.setTextFormat(myTxtFormat);

    }
}
