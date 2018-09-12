define([

], function () {

    return {
        init: function() {
            this.btn();
            this.gallimg();
        },


        btn: function() {
            $("body").on('mouseenter', '.action-button span', function( event ) {
                    $this = $(this);
                    $(this).animate({'background-position':'-78px -3px'}, 0.2);
                }).on('mouseleave', '.action-button span', function( event ) {
                    $this = $(this);
                    $(this).animate({'background-position':'-2px -3px'}, 0.2);
            });
        },

        gallimg: function() {
            $("body").on('mouseenter', '.single-img a', function( event ) {
                    $this = $(this);
                    var caption = $(this).find('.js-transform');
                    caption.animate({'bottom':'0'}, 0.2);
                }).on('mouseleave', '.single-img a', function( event ) {
                    $this = $(this);
                    var caption = $(this).find('.js-transform');
                    caption.animate({'bottom':'-60px'}, 0.2);
            });
        }
    };
});


