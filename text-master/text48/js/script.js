$(document).ready(() => {
	console.log('ready!')
	// Custom jQuery Functions Here
	const words = $('.words');
	const wordsArr = words.text().split(' ');
	const wrappedWords = wordsArr.map((a) => {
		return `<span>${a}<span style="transition-delay: ${Math.floor(Math.random() * 1000)}ms"></span></span>`;
	});
	
	words.html(wrappedWords.join(' '));
	
	setTimeout(() => {
		words.addClass('loaded');
	}, 1000)
})