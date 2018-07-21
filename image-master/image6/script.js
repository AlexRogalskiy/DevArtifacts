function $(sel) {
	return document.querySelector(sel);
};

var dialog = $('dialog');
var main = $('main');

$('button').onclick = function() {
	dialog.setAttribute('open', '');
	main.classList.add('de-emphasized');
};

dialog.onclick = function() {
	if (dialog.close) {
		dialog.close();
	} else {
		dialog.removeAttribute('open');
	}
	main.classList.remove('de-emphasized');
};
