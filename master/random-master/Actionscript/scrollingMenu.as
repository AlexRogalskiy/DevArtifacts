class scrollingMenu extends MovieClip {

    static function initMenuScroll(mcPassed, mcMask, initY, textBoxHeight):Void {
        mcPassed.onEnterFrame = function() {
            if (mcPassed._height > mcMask._height) {
                scrollMenuText(mcPassed, mcMask, initY, textBoxHeight);
            }
        }
    }

    static function scrollMenuText(mcPassed, mcMask, initY, textBoxHeight):Void {

        var textBoxHeight:Number = textBoxHeight;
        var initTop:Number = initY;
        var initBottom:Number = initY - mcPassed._height;
        var initZero:Number = (mcMask._y + (mcMask._height/2));
        var initMousePos:Number = ((mcMask._ymouse / 2) + (mcMask._y / 2) + textBoxHeight) * 4;
        var maxUp:Number = initTop - initZero;
        var maxDown:Number = initBottom + initZero;
        var initRate:Number = 2;

        if (initMousePos > 0) {
            mcPassed._y = Math.max(mcPassed._y - initRate * Math.pow((initMousePos/maxUp),2), initTop);
        } else if (initMousePos < 0) {
            mcPassed._y = Math.min(mcPassed._y + initRate * Math.pow((initMousePos/maxUp),2), mcPassed._height - mcMask._height);
        }
    }

    static function killMenuScroll(mcPassed):Void {
        mcPassed.onEnterFrame = undefined;
    }
}
