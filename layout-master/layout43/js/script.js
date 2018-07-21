(function(){
    var el = document.getElementById('draggable'),
        elWidth = parseInt(window.getComputedStyle(el,null)['width']),
        elLeft = el.offsetLeft,
        elRight = elLeft + elWidth,
        frame = document.getElementById('as-frame'),
        frameLeft = frame.offsetLeft, 
        frameWidth = parseInt(window.getComputedStyle(frame,null)['width']),
        frameRight = frameLeft + frameWidth,
        desc = document.getElementById('as-app-description'),
        scrollInButton = document.getElementById('as-slide-button'),
        resetButton = document.getElementById('as-reset-button'),
        focusButton = document.getElementById('as-focus-button'),
        leftNavButton = document.getElementById('as-left-nav-button'),
        rightNavButton = document.getElementById('as-right-nav-button'),
        tip = document.getElementById('as-instructions'),
        container = el.parentNode;

    scrollInButton.addEventListener('click', function(){
        scrollScreen(elWidth, 'left');
    }, false);
    leftNavButton.addEventListener('click', function(){
        scrollScreen(220, 'left');
    }, false);
    rightNavButton.addEventListener('click', function(){
        scrollScreen(220, 'right');
    }, false);
    resetButton.addEventListener('click', resetScreen, false);
    focusButton.addEventListener('click', focusFrame, false);

    var focus = false;

    function focusFrame(){
        hideTip();
        if(focus == false){
            container.classList.add('shrink');
            focus = true;
            desc.classList.remove('visible-description');
        }
        else{
            focus = false;
            container.classList.remove('shrink');
            el.style.left = '0';
            elRight = elWidth;//so that the description remains hidden
        }
    }

    function hideTip(){
        tip.style.display= "none";
    }

    function scrollScreen(val, dir){
        hideTip();
        var left = el.offsetLeft;

        if(dir == 'left'){
            var deltaRight = elRight - frameRight;
            if(deltaRight >= val){
                left -= val;
            }
            else{
                left -= deltaRight + 5;
            } 
        }
        else if(dir == 'right'){
            var deltaLeft = frameLeft - left;
            if(deltaLeft >= val){
                left += val;
            }
            else{
                left += deltaLeft;
            }
        }

        if(left <= frameLeft && elRight >= frameRight - 5){//elRight >= frameRight - 5 in this case because phone frame has extra 5px
            el.style.left = left + 'px';
            elRight = left + elWidth;// in case elRight = frameRight the desc shows
            showHideDesc();
        }    
    }

    function resetScreen(e){
        el.style.left = 0;
        elLeft = 0;
        elRight = elWidth;
        showHideDesc();
    }
    
    //these values are reset on every mousedown event
    var mouseDownStartPosition, delta, mouseFrameDiff; 

    el.addEventListener("mousedown", startDrag, false);
    el.addEventListener("touchstart", startDrag, false);

    function startDrag( event ) {
        hideTip();
        //prevent contents of the screen from being selected in Opera and IE <= 10 by adding the unselectable attribute
        el.setAttribute('unselectable', 'on');

        elLeft = el.offsetLeft,
        mouseDownStartPosition = event.pageX,
        delta = mouseDownStartPosition - elLeft;
        
        document.addEventListener("mousemove", moveEl, true);
        document.addEventListener("mouseup", quitDrag, false);
        document.addEventListener("touchmove", moveEl, true);
        document.addEventListener("touchend", quitDrag, false);
    
    }

    function moveEl(e){
        var moveX = e.pageX,
            newPos = moveX - delta;
            elLeft = newPos;
            elRight = newPos + elWidth;
            
        //-5 is a magic number because the phone frame has extra 5 px on the right side with a transparent bg
        //if you're using a different phone frame img u may not need this, but keeping it won't do any harm :)
        if(elRight >= frameRight - 5 && elLeft <= frameLeft){
            el.style.left = newPos + 'px';
            showHideDesc();
        }
     }

     function showHideDesc(){
        if( elRight <= frameRight + 30 && !focus){
            desc.classList.add('visible-description');
        }
        else{
            desc.classList.remove('visible-description');
        }
     }

     function quitDrag(){
         document.removeEventListener('mousemove', moveEl, true);
         el.setAttribute('unselectable', 'off');
     }

    var scrollLeftOnSwipe = Hammer(el).on("swipeleft", function(event) {
        scrollScreen(220, 'left');
        hideTip();
    });
    var scrollRightOnSwipe = Hammer(el).on("swiperight", function(event) {
        scrollScreen(220, 'right');
        hideTip();
    });


})();