var $menuItems = $('.menu-item');

$menuItems.click(function() {
	$menuItems.removeClass('active');
	$(this).addClass('active');
})