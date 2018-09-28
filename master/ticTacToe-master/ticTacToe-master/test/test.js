'use strict';

let ws = require('ws');

const clientws = new ws('ws://localhost:8080/all');
clientws.on('open', function() {});
clientws.on('message', getMsg );

function getMsg( msg ) {
  console.log( "msg ", msg );
  msg = JSON.parse( msg );
  processMsg( msg );
}

let moves = [ 0, 4, 8, 1, 7, 6, 2, 5, 3 ];
let cmove = -2;
let self;
function processMsg( msg ) {
  let path = msg.path;
  msg = msg.body;
  switch( path ) {
    case "/players" : {
      if( msg.count < 2 )
        console.log( "waiting for opponent ...");
      else if( msg.count > 2 )
        console.log( "Going into waitlist ...");
      break;
    }
    case "/start": {
      if( cmove > -1 ) {
        console.error( "game has already started ... bad msg");
        return;
      }

      self = msg.player;
      if( msg.player ) {
        console.log( "Game started ... waiting for player 1" );
        cmove = -1;
      } else {
        console.log( "Game started ... Making a move");
        cmove = -2;
        makeMove();
      }
      break;
    }
    case "/move": {
      console.log( "received a move ", msg.move );
      if( msg.state !== undefined ) {
        showWinState( msg.state, self );
      } else setTimeout( makeMove, 2000 );
      break;
    }
    case "/end": {
      if( cmove < 0 ) {
        console.error( "game has not started ... bad msg");
        return;
      }
      if( msg.state !== undefined ) {
        showWinState( msg.state, self );
      }

      resetState();
      break;
    }
    default: {
      console.log( "unknown msg");
      break;
    }
  }
}

function showWinState( state, self ) {
  switch( state ) {
    case -2 :
      console.log( "Game ended, error from other player");
      break;
    case 2 :
      console.log( "Game Drawn");
      break;
    default :
      console.log( "Game won by ", state === self ? "Self" : "Other" );
      break;
  }
  process.exit(0);
}

function resetState() {
  cmove = -1;
}

function makeMove() {
  cmove += 2;
  clientws.send( JSON.stringify( { path : '/move', body : { move : moves[cmove] } }));
}

clientws.on('close', function(message) {
  console.log( "close ", message );
  process.exit(0);
});
