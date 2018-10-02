const app = new Vue({
	el: "#app",
	data: {
		originalBoard: [],
		humanPlayer: "",
		aiPlayer: "",
		winningCombinations: [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[6, 4, 2]
		],
		gameStarted: false
	},
	methods: {
		startGame() {
			const cells = document.querySelectorAll(".cell");
			document.querySelector(".end-game").style.display = "none";
			this.originalBoard = Array.from(Array(9).keys()); // populate array with numbers
			// console.log(this.originalBoard);
			this.gameStarted = true;

			for (var i = 0; i < cells.length; i++) {
				cells[i].innerText = "";
				cells[i].style.removeProperty("background-color");
				cells[i].addEventListener("click", this.turnClick, false);
			}
		},
		turnClick(square) {
			if (typeof this.originalBoard[square.target.id] === "number") {
				this.turn(square.target.id, this.humanPlayer);

				if (!this.checkTie()) this.turn(this.bestSpot(), this.aiPlayer);
			}
		},
		turn(squareId, player) {
			this.originalBoard[squareId] = player; // change selected element to "O" or "X"
			document.getElementById(squareId).innerText = player; // draw "O" or "X"

			let gameWon = this.checkWin(this.originalBoard, player);

			if (gameWon) {
				this.gameOver(gameWon);
			}
		},
		checkWin(board, player) {
			let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
			let gameWon = null;

			for (let [index, win] of this.winningCombinations.entries()) {
				if (win.every(elem => plays.indexOf(elem) > -1)) {
					gameWon = {index: index, player: player};
					break;
				}
			}

			return gameWon;
		},
		gameOver(gameWon) {
			const cells = document.querySelectorAll(".cell");

			for (let index of this.winningCombinations[gameWon.index]) {
				document.getElementById(index).style.backgroundColor =
					gameWon.player === this.humanPlayer ? "#2554C7" : "#9F000F";
			}

			for (var i = 0; i < cells.length; i++) {
				cells[i].removeEventListener("click", this.turnClick, false);
			}

			this.declareWinner(gameWon.player === this.humanPlayer ? "You win!" : "You lose");
			this.gameStarted = false;
		},
		declareWinner(who) {
			document.querySelector(".end-game").style.display = "block";
			document.querySelector(".end-game .text").innerText = who;
		},
		emptySquares() {
			return this.originalBoard.filter(s => typeof s === "number");
		},
		bestSpot() {
			return this.minimax(this.originalBoard, this.aiPlayer).index;
			// return this.emptySquares()[0];
		},
		checkTie() {
			const cells = document.querySelectorAll(".cell");

			if (this.emptySquares().length === 0) {
				for (var i = 0; i < cells.length; i++) {
					cells[i].style.backgroundColor = "#009E8E";
					cells[i].removeEventListener("click", this.turnclick, false);
				}

				this.declareWinner("Tie Game!");
				this.gameStarted = false;
				return true;
			}
			
			return false;
		},
		minimax(newBoard, player) {
			var availableSpots = this.emptySquares(newBoard);
			var moves = [];
			var bestMove;

			if (this.checkWin(newBoard, player)) {
				return {score: -10};
			} else if (this.checkWin(newBoard, this.aiPlayer)) {
				return {score: 10};
			} else if (availableSpots.length === 0) {
				return {score: 0}
			}

			for (var i = 0; i < availableSpots.length; i++) {
				var move = {};
				move.index = newBoard[availableSpots[i]];
				newBoard[availableSpots[i]] = player;

				if (player === this.aiPlayer) {
					var result = this.minimax(newBoard, this.humanPlayer);
					move.score = result.score;
				} else {
					var result = this.minimax(newBoard, this.aiPlayer);
					move.score = result.score;
				}

				newBoard[availableSpots[i]] = move.index;

				moves.push(move);
			}

			if (player === this.aiPlayer) {
				var bestScore = -10000;

				for (var i = 0; i < moves.length; i++) {
					if (moves[i].score > bestScore) {
						bestScore = moves[i].score;
						bestMove = i;
					}
				}
			} else {
				var bestScore = 10000;

				for (var i = 0; i < moves.length; i++) {
					if (moves[i].score < bestScore) {
						bestScore = moves[i].score;
						bestMove = i;
					}
				}
			}

			return moves[bestMove];
		},
		gameReset() {
			this.gameStarted = false;
			this.humanPlayer = "";
			this.aiPlayer = "";
		}
	},
	created() {
		// 	this.startGame();
	},
	computed: {
		whichPick() {
			if (this.humanPlayer === "X") {
				this.startGame();
				return this.aiPlayer = "O";
			} else if (this.humanPlayer === "O") {
				this.startGame();
				return this.aiPlayer = "X";
			}
		}
	}
});