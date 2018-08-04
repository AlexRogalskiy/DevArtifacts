$(function(){
    $('.slider').click(function () { 
        $('#nav').slideToggle(300);

        var img = $(this).find('img');
        if ($(img).attr('id') == 'bot') {
            $(img).attr('src', 'images/arrow_top.png');
            $(img).attr('id', 'top');
        } else {
            $(img).attr('src', 'images/arrow_bottom.png');
            $(img).attr('id', 'bot');
        }
    });

    $('.sub').click(function () { 
        var cur = $(this).prev();
        $('#nav li ul').each(function() {
            if ($(this)[0] != $(cur)[0])
                $(this).slideUp(300);
        });
        $(cur).slideToggle(300);
    });
});