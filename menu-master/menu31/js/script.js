// WIP - Don't hate! I don't know javascript.
$('#toggle').click( function(){
    $(this).parent().toggleClass('width');
    $(this).children().toggleClass( 'fa-chevron-circle-left').toggleClass( 'fa-chevron-circle-right');
});