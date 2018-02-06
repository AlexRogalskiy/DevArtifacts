var realBoard;
var openSpots;
var client;
var pc;
var gameState;
const winCombos = [
	[0,1,2],
	[3,4,5],
	[6,7,8],
	[0,3,6],
	[1,4,7],
	[2,5,8],
	[0,4,8],
	[2,4,6]
];
var isPcFirst = false;
var youScore = 0;
var pcScore = 0;

/*=======================================================================================
            DOM references
=======================================================================================*/ 
const cells = document.querySelectorAll('.cell');
const syms = document.querySelectorAll('.sym');

// displays
const boardDisplay= document.getElementById('board');
const startDisplay = document.getElementById('start');
const endDisplay = document.getElementById('end');
const scoreDisplay = document.getElementById('score');

const endText = document.querySelector('.text');
const youScoreDisplay = document.querySelector('.you');
const pcScoreDisplay = document.querySelector('.pc');

var scoreWidth = scoreDisplay.offsetWidth;

/*=======================================================================================
            visual functions
=======================================================================================*/ 
const green = 'rgba(32, 223, 118, 0.85)';
const white = '#cbcbcb';

function revealStart(restart) {
    console.log(restart ? 'restarted' : 'first game');
    if (restart) {
        TweenLite.to(endDisplay, 0.6, {top: '0%', y:'-100%', ease: Back.easeIn.config(2)});
        TweenLite.to(boardDisplay, 0.6, {scale: 0, ease: Back.easeIn.config(2)});
    } else {
        TweenLite.set(endDisplay, {display: 'none'});
        TweenLite.set(boardDisplay, {display: 'none'});
    }
    let delayTime = (restart) ? 1 : 0;
    TweenLite.set(startDisplay, {display:'block', top:'50%', y: '-50%', left:'50%', x:'-50%'});
    TweenLite.from(startDisplay, 
        0.8, 
        {top:'100%', y:'0%', ease: Bounce.easeOut, delay: delayTime });
}

function revealBoard() {
    TweenLite.to(startDisplay, 0.5, {top:'0%', y:'-100%', ease: Back.easeIn.config(2)});
    TweenLite.set(boardDisplay, {display: 'grid', autoAlpha:1, scale:1, top:'50%', y:'-50%', left:'50%', x:'-50%'});
    TweenLite.from(boardDisplay, 1, {autoAlpha:0, scale: 0, ease:Elastic.easeOut.config(1, 0.3), delay: 0.6});
}

function revealEnd(endGame) {
    TweenLite.to(boardDisplay, 1, {autoAlpha:0.25});
    console.log('***********openSpots: '+openSpots);
    openSpots.forEach(openSpot => {
        cells[openSpot].classList.remove('clickable');
        cells[openSpot].removeEventListener('click', onClick);
    });
    let endClass = '';
    let endMsg = '';
    switch(endGame) {
        case 'tie':
            endMsg = 'It\'s a tie!';
            break;
        case 'won':
            endClass = client.toLowerCase();
            endMsg = 'You won!';
            break;
        case 'lost':
            endClass = pc.toLowerCase();
            endMsg = 'PC won...';
            break;
    }
    endDisplay.className = endClass;
    endText.innerText = endMsg;
    TweenLite.set(endDisplay, {top:'50%', y: '-50%', left:'50%', x:'-50%', display: 'block'});
    TweenLite.from(endDisplay, 1, 
        {top: '100%', y:'50%', ease:Elastic.easeOut.config(1, 0.3), delay:0.6}
    );

    youScoreDisplay.querySelector('.youScore').innerText = (youScore < 10) ? '0' + youScore : youScore;
    pcScoreDisplay.querySelector('.pcScore').innerText = (pcScore < 10) ? '0' + pcScore : pcScore;

    if (youScore > pcScore) {
        youScoreDisplay.style.color = green;
        pcScoreDisplay.style.color = null;
    } else if (youScore == pcScore) {
        youScoreDisplay.style.color = white;
        pcScoreDisplay.style.color = white;
    } else {
        pcScoreDisplay.style.color = green;
        youScoreDisplay.style.color = null;
    }
}

function markBoard(player, markedSpot) {
    markedSpot.innerHTML = '<p>'+player+'</p>';
    markedSpot.className = player.toLowerCase();
    let delayVal = (player == client) ? 0 : isPcFirst ? 1.1 : 0.3;
    TweenLite.from(markedSpot.firstElementChild, 1, {autoAlpha:0, scale: 0.3, ease:Elastic.easeOut.config(1, 0.3), delay: delayVal});
    if (isPcFirst) isPcFirst = !isPcFirst;    	    
}

// function highlightWinCombo(winCombo) {
//     console.log(winCombo);
//     winCombo.forEach(winMark => {cells[winMark].firstElementChild.classList.add('highlight')});
// }

function hover(event) {
    if (openSpots.indexOf(Number.parseInt(event.target.id)) > -1) {
        let HTML = (event.type == 'mouseenter') ? '<p class="under">'+(client) ? client:''+'</p>' : '';
        event.target.innerHTML = HTML;
    }
}

function hoverSym(event) {
    let oppSign = (event.target.id == 'X') ? 'O' : 'X';    
    let oppElem = document.getElementById(oppSign);
    let oppColor = (event.type == 'mouseenter') ? '#030511' : (oppSign == 'X') ? '#c30506' : '#0908c4';    
    TweenLite.to(oppElem, 0.2, {ease: Power1.easeInOut, color: oppColor});
}

TweenLite.set(scoreDisplay, {width:'0px'});

function hoverScore(event) {
    if (event.type == 'mouseenter') {
        TweenLite.to(scoreDisplay, 0.6, {width: scoreWidth, ease: Back.easeOut.config(2)});
    } else {
        TweenLite.to(scoreDisplay, 0.6, {width: '0px', ease: Back.easeIn.config(2)});
    }
}

/*=======================================================================================
            game logic
=======================================================================================*/ 
newGame(false);

function newGame(restart) {
    console.clear();
    client = null;
    pc = null;
    gameState = null;
    realBoard = Array.from(Array(9).keys());
    openSpots = realBoard;
    cells.forEach(cell => {
        cell.innerHTML = '';
        cell.className = 'cell clickable';
    });
    revealStart(restart);                                                
} // goes to setPlayer()

function setPlayers(clickedElem) {
    client = clickedElem.id;
	pc = (client === 'X') ? 'O' : 'X';
    if (pc == 'X') isPcFirst = true;
	revealBoard();
    (client == 'X') ? clientTurn() : pcTurn();
} // goes to clientTurn() || pcTurn()

function clientTurn() {
    console.log('~~~~~~~ clientturn ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    openSpots.forEach(openSpot => cells[openSpot].addEventListener('click', onClick));
} // goes to onClick()

function onClick(e) {
    let clickedIndex = e.target.id;
    markSpot(client, clickedIndex);
} // goes to markSpot()

function pcTurn() {
    console.log('^^^^^^^ pcturn ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
	let randomIndex = Math.floor(Math.random() * openSpots.length);
    let selectedIndex = realBoard.indexOf(openSpots[randomIndex]);
    markSpot(pc, selectedIndex);
} // goes to markSpot()

function aiTurn() {
    console.log('^^^^^^^ aiturn ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
    let calculatedIndex = minmax(pc, realBoard).index;
    console.log(calculatedIndex);
    markSpot(pc, calculatedIndex);
}

function markSpot(player, index) {
    console.log(player+' just marked '+index);
    realBoard[index] = player;
    let markedSpot = cells[index];
    markedSpot.removeEventListener('click', onClick);
    markBoard(player, markedSpot);
    openSpots = getOpenSpots(realBoard);
    console.log('spots left: '+ openSpots.length);
    console.log(' ');
    gameControl(player); 
} // goes to gameControl()

function getOpenSpots(board) {
    return board.filter(spot => typeof spot == 'number');
}

function gameControl(player) {
    checkGame(player, realBoard);
    console.log(' ');   
    console.log('gameState: ' + gameState);    
    console.log(' ');   
    console.log(' ');
    if (gameState === 'unfinished') {
        if (openSpots.length < 5) {
            (player == client) ? aiTurn() : clientTurn();
        } else {
            (player == client) ? pcTurn() : clientTurn();
        }
    } else {
        if (gameState == 'won') youScore++;
        if (gameState == 'lost') pcScore++;
        revealEnd(gameState);
    }
} // uses checkGame() to go to pcTurn() || clientTurn() || revealEnd()

function checkGame(player, board) {
    // console.log('checkGame() called');
    // console.log('current board: ' + board);
    // console.log(' ');
    let marks = board.reduce((accumulator, currElem, currInd) => {
		return (currElem === player) ? accumulator.concat(currInd) : accumulator
	}, []);
    // console.log('all ' + player + ' marks: ' + marks);
    // console.log(' ');
	if (marks.length>2) {
        for (let winCombo of winCombos) {
			let winMark = 0;
			marks.forEach(mark => {
				if (winCombo.indexOf(mark) > -1) winMark++;
			});
            // console.log('winCombo: ' + winCombo + '   hits: ' + winMark);
            // if (winMark === 3) return gameState = (player == client) ? 'won' : 'lost';
            if (winMark === 3) {
                // highlightWinCombo(winCombo);
                return gameState = (player == client) ? 'won' : 'lost';
            }
		}
    }
    // let openSpots = getOpenSpots(board);
    if ((gameState!=='won' || gameState!=='lost') && getOpenSpots(board).length === 0) return gameState = 'tie';        
    return gameState = 'unfinished';
} 

function minmax(player, possibleBoard) {
    // console.log(' ');
    // console.log('=================================');
    // console.log(player+' called minmax()');

    // check remaining open spots of current board
    var newOpenSpots = getOpenSpots(possibleBoard);
    
    checkGame(player, possibleBoard);
    if (gameState == 'won') {
        return {score: -10};
    } else if (gameState == 'lost') {
        return {score: 10};
    } else if (gameState == 'tie') {
        return {score: 0};
    }
    
    // check scores of all possible moves left
    var moves = [];
    for (var i = 0; i <newOpenSpots.length; i++) {
        let move = {};

        // choose a remaining spot and log its index in move object
        let chosenSpot = newOpenSpots[i];
        move.index = possibleBoard[chosenSpot];
        
        // player marks the spot in possibleBoard variable
        possibleBoard[chosenSpot] = player;

        // continue game by going to next player
        // repeat minmax function (check score of game state)
        let opponent = (player == client) ? pc : client;
        var result = minmax(opponent, possibleBoard);
        move.score = result.score;
        
        // when board has ended, reset board (undo hypothetical marks) so that it may be used next hypothetical moves
        possibleBoard[chosenSpot] = move.index;
        moves.push(move);
    }
    console.log(moves);

    var bestMove;
    var bestScore = (player == pc) ? -10000 : 10000;
    for (var i = 0; i < moves.length; i++) {
        var condition = (player == pc) ? (moves[i].score > bestScore) : (moves[i].score < bestScore);
        if (condition) {
            bestScore = moves[i].score;
            bestMove = i;
        }
    }

    return moves[bestMove];
}