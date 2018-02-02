$(function () {
    $('#section-feature .sf-wrap')
        .hover(function() {
            $(this).addClass('hover');
        }, function() {
            $(this).removeClass('hover');
        })
        .click(function(event) {
            //if (event.target.nodeName != 'A') {
                $(this).toggleClass('active');
            //}
        });
});