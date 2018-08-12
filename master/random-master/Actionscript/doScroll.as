class doScroll {

    static function mouseScroll(scrollDirection:String, mcPassed:MovieClip, scrollWidth:Number, intLeftValue:Number, isLoadedValue:Boolean, scrollSpeed:Number, hitTestValue:Boolean) {

        if (scrollDirection eq "horizontal") {

            var mcSize:Number = mcPassed._width;
            var mouseValue:Number = _xmouse;

        } else if (scrollDirection eq "vertical") {

            var mcSize:Number = mcPassed._height;
            var mouseValue:Number = _ymouse;
        }

        if (mcSize > scrollWidth) {

            var minValue:Number = intLeftValue;
            var maxValue:Number = minValue + scrollWidth;
            var initZero:Number = scrollWidth / 2;
            var initMousePos:Number = mouseValue - initZero;
            var maxMinValue:Number = minValue - initZero;
            var maxMaxValue:Number = maxValue - initZero;
            var scrollSpeed:Number = scrollSpeed;

            var scrollClipIsLoaded:Boolean = isLoadedValue;

            var _isHit:Boolean = hitTestValue;

            if (_isHit) {

                if (initMousePos > 0) {
                    if (scrollDirection eq "horizontal") {
                        mcPassed._x = Math.max(mcPassed._x - scrollSpeed * Math.pow((initMousePos/maxMaxValue),2), maxValue - mcSize);
                    } else if (scrollDirection eq "vertical") {
                        mcPassed._y = Math.max(mcPassed._y - scrollSpeed * Math.pow((initMousePos/maxMaxValue),2), maxValue - mcSize);
                    }
                } else if (initMousePos < 0) {
                    if (scrollDirection eq "horizontal") {
                        mcPassed._x = Math.min(mcPassed._x + scrollSpeed * Math.pow((initMousePos/maxMinValue),2), minValue);
                    } else if (scrollDirection eq "vertical") {
                        mcPassed._y = Math.min(mcPassed._y + scrollSpeed * Math.pow((initMousePos/maxMinValue),2), minValue);
                    }
                }
            }

        } else if (scrollClipIsLoaded) {
            if (scrollDirection eq "horizontal") {
                mcPassed._x = (scrollWidth - mcSize) / 2;
            } else if (scrollDirection eq "vertical") {
                mcPassed._y = 75;
            }
        }
    }
}
