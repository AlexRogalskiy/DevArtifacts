/* Write code on document load */
$(document).ready(function() {
    /***
    ** Add collapse icon to header
    ****/
    var headerLi = $('header nav li');
    var headerSpanIconElement = '<span class="drop-down"> </span>';
    headerLi.each(function(){
        var _this = $(this);
        if(_this.find("ul").length) {
           _this.append(headerSpanIconElement); 
        }
    });

    var  headerSpanIcon = $('header nav  span.drop-down');
    headerSpanIcon.on('click', function(){
        var _this = $(this);
        _this.prev('ul').slideToggle(600);
        _this.parent('li').toggleClass('active');
    });

    /***
    ** Create function humberg icon click
    ****/
    var  headerhumberg = $('header .humberg');
    headerhumberg.on('click', function(){
        var _this = $(this);
        $('body').toggleClass('menu-active');
        _this.toggleClass('active');
    });
});