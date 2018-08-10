// POLL PLUGIN
class poll {
	constructor(question, answers, options) {
		const defaultOptions = {};
		this.options = Object.assign({}, defaultOptions, options);
		this.history = [];
		this.possibleAnswers = answers;
	}
	
	clear() {
		this.history = [];
	}

	get results() {
		let numberOfVotes = this.history.length,
			votesResults = [];

		Object.keys(this.possibleAnswers).forEach(answerId => {
			let answerIdCounter = 0;
			let voters = [];
			this.history.forEach(vote => {
				if (answerId == vote.id) {
					answerIdCounter++;
					voters.push(vote.name);
				}
			});
			let percentOfAllVotes = answerIdCounter / numberOfVotes * 100;
			let formatedPercent = isNaN(percentOfAllVotes)
				? 0
				: parseFloat(percentOfAllVotes)
						.toFixed(3)
						.slice(0, -1);
			votesResults.push({
				votes: answerIdCounter,
				voters: voters,
				percent: formatedPercent
			});
		});

		return votesResults;
	}

	vote(answerId, name = "Anonymouse") {
		if (this.possibleAnswers[answerId]) {
			let getCurrentDate = new Date().toLocaleString();
			this.history.push({ id: answerId, name: name, date: getCurrentDate });
			return true;
		} else throw new Error("Incorrect answer's id");
	}
}


