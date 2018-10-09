var text = document.querySelector("h1");


window.addEventListener("scroll", function(e) {
	const maxGravity = 1000;
	const minGravity = 0;
	const posTop = 0;
	const posBottom = 100;
	
	var scrollPosition = (document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight);
	
	const percent = scrollPosition / 0.99;
	const gravityScale = percent * (maxGravity + minGravity) - minGravity;
	const positionScale = percent * (posBottom - posTop) + posTop;
	
	const newGravityValue =
		scrollPosition >  0.99
			? maxGravity
			: gravityScale;
	
		
	if (scrollPosition >= 0.99) {
		text.style.setProperty("--gravity", maxGravity);    
		text.style.setProperty("--pos", posBottom + '%');
	} else {
		text.style.setProperty("--gravity", newGravityValue);
		text.style.setProperty("--pos", positionScale +'%');
	}
  
});