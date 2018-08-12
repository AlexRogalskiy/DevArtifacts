class slideShow {

    static function fadeInOut(firstTime, numberOfElements, randomNumbers, imagePath, fileType, showTime) {

        var p;
        var yNumber;
        var imageArray:Array;
        var i;
        var lastLoader;
        var thisLoader;
        var imageData:Object;
        var fadeTween;
        var j;
        var s;
        var imageHolder_mc;
        var timerInterval;
        var showTime;

        p = 0;
        yNumber = 0;

        imageHolder_mc = _root.createEmptyMovieClip("imageHolder", 0);

        imageHolder_mc.createEmptyMovieClip("imageHolder_1", 1);
        imageHolder_mc.createEmptyMovieClip("imageHolder_2", 2);

        _root.createEmptyMovieClip("watcher_mc", 100);

        if (firstTime eq true) {
            firstTime = false;
            imageArray = new Array();

            s = 0;
            while (s < numberOfElements) {

                if (yNumber >= (numberOfElements - 1)) {
                    yNumber = 0;
                } else {
                    yNumber++;
                }

                imageData = new Object;
                imageData.path = imagePath + "" + randomNumbers[yNumber] + "" + fileType;

                imageArray[s] = imageData;
                s++;
            }
        }

        imageArray.reverse();
        imageGen(imageArray);

        function swapPlace(clip,num) {
            eval(clip).swapDepths(eval("imageHolder_mc.imageHolder_" + num));
        }

        function loadImages(data,num) {
            if (i == undefined || i == 2) {
                i = 2;
                createLoader(i,data,num);
                i = 1;
            } else if (i == 1) {
                createLoader(i,data,num);
                i = 2;
            }
        }

        function createLoader(i,data,num) {
            if (i == 1) {
                j = 2;
            } else {
                j = 1;
            }

            thisLoader=eval("imageHolder_mc.imageHolder_" + i);
            lastLoader=eval("imageHolder_mc.imageHolder_" + j);

            thisLoader.loadMovie(data[num].path);

            _root.watcher_mc.onEnterFrame=function () {

                var picLoaded = thisLoader.getBytesLoaded();
                var picBytes = thisLoader.getBytesTotal();

                if (picLoaded / picBytes >= 1) {
                    swapPlace("imageHolder_mc.imageHolder_2",1);

                    fadeTween = new mx.transitions.Tween(thisLoader, "_alpha", mx.transitions.easing.Strong.easeIn,0,100,3,true);
                    fadeTween = new mx.transitions.Tween(lastLoader, "_alpha", mx.transitions.easing.Strong.easeIn,100,0,3,true);

                    timerInterval = setInterval(imageGen,showTime,data);
                    delete this.onEnterFrame;
                }
            }
        }

        function imageGen(data) {
            if (p >= numberOfElements) {
                p = 0;
            } else {
                break;
            }
            loadImages(data,p);
            p++;
            clearInterval(timerInterval);
        }
    }


    static function fadeInOutFromFolder(firstTime, numberOfElements, randomNumbers, imagePath, fileName, showTime) {

        var p;
        var yNumber;
        var imageArray:Array;
        var i;
        var lastLoader;
        var thisLoader;
        var imageData:Object;
        var fadeTween;
        var j;
        var s;
        var imageHolder_mc;
        var timerInterval;
        var showTime;

        p = 0;
        yNumber = 0;

        imageHolder_mc = _root.createEmptyMovieClip("imageHolder", 0);

        imageHolder_mc.createEmptyMovieClip("imageHolder_1", 1);
        imageHolder_mc.createEmptyMovieClip("imageHolder_2", 2);

        _root.createEmptyMovieClip("watcher_mc", 100);

        if (firstTime eq true) {
            firstTime = false;
            imageArray = new Array();

            s = 0;
            while (s < numberOfElements) {
                if (yNumber >= (numberOfElements - 1)) {
                    yNumber = 0;
                } else {
                    yNumber++;
                }

                imageData = new Object;
                imageData.path = imagePath + "" + fileName[randomNumbers[yNumber]];

                imageArray[s] = imageData;
                s++;
            }
        }

        imageArray.reverse();
        imageGen(imageArray);

        function swapPlace(clip,num) {
            eval(clip).swapDepths(eval("imageHolder_mc.imageHolder_" + num));
        }

        function loadImages(data,num) {
            if (i == undefined || i == 2) {
                i = 2;
                createLoader(i,data,num);
                i = 1;
            } else if (i == 1) {
                createLoader(i,data,num);
                i = 2;
            }
        }

        function createLoader(i,data,num) {
            if (i == 1) {
                j = 2;
            } else {
                j = 1;
            }

            thisLoader=eval("imageHolder_mc.imageHolder_" + i);
            lastLoader=eval("imageHolder_mc.imageHolder_" + j);

            thisLoader.loadMovie(data[num].path);

            _root.watcher_mc.onEnterFrame=function () {

                var picLoaded = thisLoader.getBytesLoaded();
                var picBytes = thisLoader.getBytesTotal();

                if (picLoaded / picBytes >= 1) {
                    swapPlace("imageHolder_mc.imageHolder_2",1);

                    fadeTween = new mx.transitions.Tween(thisLoader, "_alpha", mx.transitions.easing.Strong.easeIn,0,100,3,true);
                    fadeTween = new mx.transitions.Tween(lastLoader, "_alpha", mx.transitions.easing.Strong.easeIn,100,0,3,true);

                    timerInterval = setInterval(imageGen,showTime,data);
                    delete this.onEnterFrame;
                }
            }
        }

        function imageGen(data) {
            if (p >= numberOfElements) {
                p = 0;
            } else {
                break;
            }
            loadImages(data,p);
            p++;
            clearInterval(timerInterval);
        }
    }

}
