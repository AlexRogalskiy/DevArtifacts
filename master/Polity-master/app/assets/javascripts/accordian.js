$(document).ready(function() {
    $('.accordion-tabs-minimal').each(function(index) {
        $(this).children('li').first().children('a').addClass('is-active').next().addClass('is-open').show();
    });

    $('.accordion-tabs-minimal').on('click', 'li > a', function(event) {
        if (!$(this).hasClass('is-active')) {
            event.preventDefault();
            var accordionTabs = $(this).closest('.accordion-tabs-minimal')
            accordionTabs.find('.is-open').removeClass('is-open').hide();

            $(this).next().toggleClass('is-open').toggle();
            accordionTabs.find('.is-active').removeClass('is-active');
            $(this).addClass('is-active');
        } else {
            event.preventDefault();
        }
    });
});

$(function() {
    $(".fold-table tr.view").on("click", function() {
        if ($(this).hasClass("open")) {
            $(this).removeClass("open").next(".fold").removeClass("open");
        } else {
            $(".fold-table tr.view").removeClass("open").next(".fold").removeClass("open");
            $(this).addClass("open").next(".fold").addClass("open");
        }
    });
});
