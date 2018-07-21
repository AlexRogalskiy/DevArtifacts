function testAnim(x) { 
    $('.output').val('.myClass { @include animate-css('+x+'); }');
    $('#animatethis').removeClass().addClass(x).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        $('#animatethis').removeClass(); 
        // Force text repaint in chrome – looks wierd without
        $('#animatethis h1').text($('#animatethis h1').text());
    });    
};
$(document).ready(function(){ 
    $('.animate-button').on('click', function(e){ e.preventDefault(); var anim = $('.animate-select').val(); testAnim(anim); });
    $('.animate-select').on('change',function(){ var anim = $(this).val(); testAnim(anim); });
    $('.output').on('click',function(){$(this).select()})
    $('.mixin').on('click',function(){$(this).select()})    
    testAnim('bounce');
});