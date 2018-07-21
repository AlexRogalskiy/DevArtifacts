
var $items = $('#menu li').css('float' , 'right'),
    $menu  = $items.parent();
$items.each(function () {
  $(this).remove().prependTo($menu);
});