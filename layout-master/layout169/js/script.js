// Plugin: https://codepen.io/badurski/pen/RJvJQZ

const q1 = new poll("Will Poland win the footboal match?", {
	0: { title: "Yes" },
	1: { title: "No" }
});

// Add some randome votes
for(let i = 0; i<20; i++) {
	q1.vote(Math.floor(Math.random() * (1 - 0 + 1)) + 0);
}

// Poll interface script
let pollButtons = document.querySelectorAll('.poll-panel-btn'),
		pollPanel = document.querySelector('.poll-panel');
pollButtons.forEach(button => {
	button.onclick = () => {
		if (button.getAttribute('disabled') != 'disabled') {
			q1.vote(button.dataset.vote);
			pollPanel.classList.add('poll-voted');
			button.classList.add('--user-choice');
			pollButtons.forEach(b => {
				b.setAttribute('disabled', 'disabled');
				let percent = q1.results[b.dataset.vote].percent + '%';
				b.style.width = percent;
				b.dataset.result = percent;
			});
		}
	};
});