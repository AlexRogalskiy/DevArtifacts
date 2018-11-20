function initGame(board, players) {
  var playerList = new Array();
  var currentPlayerIndex = 0;
  var currentPlayer;
  var selectedCard;
  var boardRows = board.getElementsByTagName('tr');
  var boardTiles = board.getElementsByTagName('td');
  var playedCards = new Array();
  
  if (players.length < 2) {
    return false; // not enough players
  }
  
  for (var i = 0, len = players.length; i < len; i++) {
    playerList.push(new Player(players[i]));
  }
  
  for (var i = 0, len = boardTiles.length; i < len; i++) {
    boardTiles[i].setAttribute('data-tile-number', i);
  }
  
  currentPlayer = playerList[currentPlayerIndex];
  currentPlayer.drawCard(1);
  selectElement(currentPlayer.element);
  initPlayerTurn();

  board.addEventListener('click', placeCard, false);
  
  function selectCard(ev) {
    if (ev.target.tagName.toLowerCase() == 'li') {
      if (selectedCard) {
        deselectElement(selectedCard);
      }
      selectedCard = ev.target;
      selectElement(selectedCard);
    }
  }
  
  function deselectCard() {
    if (selectedCard) {
      deselectElement(selectedCard);
    }
  }
  
  function placeCard(ev) {
    if (ev.target.tagName.toLowerCase() == 'td') {
      if (ev.target.className) {
        // do nothing, there's a card there
      } else {
        if (selectedCard) {
          var card = currentPlayer.handElement.removeChild(selectedCard);
          deselectElement(selectedCard);
          // add the card's information to the board
          ev.target.setAttribute('data-card-position', playedCards.length);
          playedCards.push(currentPlayer.knownCards[selectedCard.getAttribute('data-hand-position')]);
          // show the card's placement on the board
          ev.target.className = currentPlayer.class + " " + card.className;
          ev.target.appendChild(selectedCard.firstChild);
          selectedCard = null;
          changePlayer();
        }
      }
    }
  }
  
  function changePlayer() {
    currentPlayer.handElement.removeEventListener('click', selectCard, false);
    deselectElement(currentPlayer.element);
    currentPlayerIndex = currentPlayerIndex + 1 < playerList.length ? currentPlayerIndex + 1 : 0;
    currentPlayer = playerList[currentPlayerIndex];
    selectElement(currentPlayer.element);
    currentPlayer.drawCard(1);
    initPlayerTurn();
  }
  
  function initPlayerTurn() {
    currentPlayer.handElement.addEventListener('click', selectCard, false);
  }
  
  function selectElement(el) {
    el.className += " selected";
  }
  
  function deselectElement(el) {
    el.className = el.className.replace(/ selected/, '');
  }
}

function Player(el) {
  this.element = el;
  this.class = el.className.replace(/ player/, '');
  this.hp = 20;
  this.cardsRemaining = 15;
  
  this.knownCards = new Array();
  this.handElement = el.querySelector('.hand');
  this.drawCard(5);
}
Player.prototype.cardTypes = [ 'a', 'b', 'c', 'd', 'e' ];
Player.prototype.cardElement = document.createElement('li');
Player.prototype.cardElement.className = 'card';
Player.prototype.drawCard = function(quantity) {
  for (var i = 0; i < quantity; i++) {
    var card = new Card();
    this.knownCards.push(card);
    var cardElement = this.cardElement.cloneNode(true);
    cardElement.appendChild(card.markup);
    cardElement.setAttribute('data-hand-position', this.knownCards.length - 1);
    this.handElement.appendChild(cardElement);
  }
}

function Card() {
  this.type = this.possibleTypes[Math.floor(Math.random() * this.possibleTypes.length)];
  this.modifiers = this.generateModifiers();
  this.markup = this.generateMarkup();
}
Card.prototype.possibleTypes = [ 'a', 'b', 'c', 'd', 'e' ];
Card.prototype.maxTotalModifiers = 7;
Card.prototype.maxSingleModifier = 3;
Card.prototype.maxModifiers = 6;
Card.prototype.element = document.createElement('ul');
Card.prototype.element.className = 'card';
Card.prototype.elementModifiers = document.createElement('li');
Card.prototype.generateModifiers = function(quantity) {
  var modSum = 0;
  var modifiersList = new Array();
  do {
    var availMod = this.maxTotalModifiers - modSum;
    if (availMod > 0) {
      var maxMod = this.maxSingleModifier < availMod ? this.maxSingleModifier : availMod;
      var mod = randomNumber(0, maxMod);
      modifiersList.push(mod);
      modSum += mod;
    } else {
      modifiersList.push(0);
    }
  } while (modifiersList.length < this.maxModifiers);
  return shuffle(modifiersList);
}
Card.prototype.generateMarkup = function(modifiers) {
  var card = this.element.cloneNode(true);
  card.className += " " + this.type;
  for (var i = 0; i < this.maxModifiers; i++) {
    var mod = this.elementModifiers.cloneNode(true);
    if (this.modifiers[i] > 0) {
      mod.appendChild(document.createTextNode(this.modifiers[i]));
    }
    card.appendChild(mod);
  }
  return card;
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  var counter = array.length, temp, index;
  // While there are elements in the array
  while (counter--) {
    // Pick a random index
    index = (Math.random() * counter) | 0;

    // And swap the last element with it
    temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

initGame(document.getElementById('board'), document.querySelectorAll('.player'));