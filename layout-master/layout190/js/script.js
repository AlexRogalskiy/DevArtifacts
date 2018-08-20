window.setTimeout(function() {
	var doc = $('body'),
    	css = '@keyframes slideUp{from{transform:translateY(50px);}'+
						'to{transform:translateY(0);opacity:1;}}'+
						'@keyframes slideDown{from{transform:translateY(-50px);}'+
						'to{transform:translateY(0);opacity:1;}}';
	doc.remove('.spinner');
	doc.prepend('<style type="text/css" id="pl"></style>');
	$('#pl').text(css);
}, 100);