class GameLogic
{
  newGame() {
    if (!this.userIsAlreadyPlaying()) {
      Games.insert({
        player1: Meteor.userId(),
        player2: "",
        moves: [],
        status: "waiting",
        result: ""
      });
    }
  }

  userIsAlreadyPlaying() {
    const game = Games.findOne({$or:[
      {player1: Meteor.userId()},
      {player2: Meteor.userId()}]
    });

    if (game !== undefined)
      return true;
    
    return false;
  }

  joinGame(game) {
    if (game.player2 === "" && Meteor.userId() !== undefined) {
      Games.update(
        {_id: game._id},
        {$set: {
          "player2": Meteor.userId(),
          "status": game.player1
          }
        }
      );
    }
  }

  validatePosition(position) {
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        if (position === x + '' + y)
          return true;
      }
    }

    throw new Meteor.Error('invalid-position', "Selected position does not exist... please stop trying to hack the game!!");
  }

  addNewMove(position) {
    Games.update(
      {status: Meteor.userId()},
      {
        $push: {
          moves: {playerID: Meteor.userId(), move: position}
        }
      }
    );
  }

  setGameResult(gameId, result) {
    Games.update(
      {_id: gameId},
      {
        $set: {
          "result": result,
          "status": "end"
        }
      }
    );
  }

  updateTurn(game) {
    let nextPlayer;

    if(game.player1 === Meteor.userId())
      nextPlayer = game.player2;
    else
      nextPlayer = game.player1;

    Games.update(
      {status: Meteor.userId()},
      {
        $set: {
          "status": nextPlayer
        }
      }
    );
  }

  checkIfGameWasWon() {
    const game = Games.findOne({status: Meteor.userId()});

    const wins = [
    ['00', '11', '22'],
    ['00', '01', '02'],
    ['10', '11', '12'],
    ['20', '21', '22'],
    ['00', '10', '20'],
    ['01', '11', '21'],
    ['02', '12', '22']
    ];

    let winCounts = [0,0,0,0,0,0,0];

    for(let i = 0; i < game.moves.length; i++) {
      if(game.moves[i].playerID === Meteor.userId()) {
        const move = game.moves[i].move;

        for(let j = 0; j < wins.length; j++) {
          if(wins[j][0] == move || wins[j][1] == move || wins[j][2] == move)
          winCounts[j] ++;
        }
      }
    }

    for(let i = 0; i < winCounts.length; i++) {
      if(winCounts[i] === 3)
        return true;
    }

    return false;
  }

  removeGame(gameId) {
    Games.remove({_id: gameId});
  }

  removePlayer(gameId, player) {
    Games.update({_id: gameId}, {$set:{[player]: ""}});
  }
}

export const gameLogic = new GameLogic();