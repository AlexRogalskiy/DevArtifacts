//Project Impression Slider
//created by http://8bit-code.com
//tutorial at http://www.8bit-code.com/tutorials/project-impression-slider

$(document).ready(function(){
    $(".gallery li").each(function() {
        $this = $(this);
        var imagesStr = $this.data("image");
        var imagesArray = imagesStr.split(',');
        var thisWidth = $this.width();
        $this.find("a").append("<ul class='impression-slider' style='width:"+(imagesArray.length*thisWidth)+"px'></ul>");
        $this.append("<div class='arrow next'></div><div class='arrow prev'></div>");
        for (i = 0; i < imagesArray.length; i++) {
            $this.find("ul").append("<li style='width: "+thisWidth+"px'><img src='"+imagesArray[i]+"' /></li>");
        }
    });


    $("body").on('click','.next' ,function(){
        $this = $(this);
        var thisParent = $this.parent();
        var sliderMLeft = parseInt(thisParent.find(".impression-slider").css("margin-left"));
        var imagesStr = thisParent.data("image");
        var imagesArray = imagesStr.split(',');
        var parentWidth = thisParent.width();
        if(sliderMLeft > -((imagesArray.length-1)*parentWidth)){
            thisParent.find(".impression-slider").animate({
                marginLeft: (sliderMLeft-parentWidth)
            });
        }
    });

    $("body").on('click','.prev' ,function(){
        $this = $(this);
        var thisParent = $(this).parent();
        var sliderMLeft = parseInt(thisParent.find(".impression-slider").css("margin-left"));
        var parentWidth = thisParent.width();
        if(sliderMLeft < 0){
            thisParent.find(".impression-slider").animate({
                marginLeft: (sliderMLeft+parentWidth)
            });
        }
    });

    window.onresize = function() {
        $(".gallery > ul > li").each(function() {
            $this = $(this);
            var thisWidth = $this.width();
            var thisUl = $this.find("ul");
            var imagesStr = $this.data("image");
            var imagesArray = imagesStr.split(',');
            thisUl.css({"width":(imagesArray.length*thisWidth)});
            var sliderMLeft = parseInt(thisUl.css("margin-left"));
            if(sliderMLeft != 0){
                var currentEl = Math.round(sliderMLeft / thisWidth);
                var difference = (thisWidth*currentEl) - sliderMLeft;
                thisUl.css("margin-left",(sliderMLeft + difference));
            }
            $this.find("li").css({"width":thisWidth});

        });
    };
});