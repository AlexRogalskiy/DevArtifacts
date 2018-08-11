// for decoration
document.getElementById('switchy').addEventListener('click', function() {
	if ( document.getElementById('switchy').checked ) {
		document.body.classList.add('active');
	} else {
		document.body.classList.remove('active');
	}
});