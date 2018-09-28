"use strict";

let tttcommon = require( 'ttt-common' ),
  routes = require( 'koa-route' );

let l = tttcommon.logger.child( {'module': __filename.substring(__dirname.length+1, __filename.length-3)} );

let players = [];
let p0, p1;

let startstate = [ -1, -1, -1, -1, -1, -1, -1, -1, -1 ];
let cgame;
let moves = 0;

module.exports = function wsConfig( app ) {
	app.ws.use( routes.all( '/all', newPlayer ) );
};

function * newPlayer(next) {
  let cws = this.websocket;
	players.push( cws );

  this.websocket.send( JSON.stringify( { path : '/players', body : { count : players.length } } ) );
  l.info( "new connection ", players.length );

  if( players.length === 2 ) {  // start the game
    startTTT();
  }

	this.websocket.on( 'message', function( msg ) {
		l.info( "msg ", msg );
    msg = JSON.parse( msg );
    processMsg( findPlayer( cws ), msg );
	} );

  this.websocket.on( 'close', function( msg ) {
    let i = findPlayer( cws );
		l.info( "close ", i, msg );

    if( i === 0 || i === 1 ) {
      let i2 = i ? 0 : 1;
      players[i2].send( JSON.stringify( { path : '/end', body : { state : -2 } } ) );
      endTTT();
    }
  } );

	yield next;
}

function findPlayer( ws ) {
  return players.findIndex( p => p === ws );
}

function endTTT() {
  l.info( "Ending TTT", players.length );
  players.splice( 0, 2 );
  p0 = p1 = undefined;
  if( players.length >= 2 )
    startTTT();
}

function startTTT() {
  moves = 0;
  cgame = Array.from( startstate );
  p0 = players[0];
  p1 = players[1];
	p0.send( JSON.stringify( { path : '/start', body : { player : 0 } } ) );
	p1.send( JSON.stringify( { path : '/start', body : { player : 1 } } ) );
}

/*
{ path : '/move', body : { move : <num> } }
// state : -2 (error at other player), -1 (draw), 0 (player1 win), 1(player2 win)
*/
function processMsg( pi, msg ) {
  l.info( "process msg from ", pi );
  let path = msg.path;
  let body = msg.body;
  switch( path ) {
    case "/move" : {
      let res = processMove( pi, body.move );
      if( res ) {
        body.state = pi;
        body.win = res;
      } else if( moves === 9 )
        body.state = 2;  // no winner, a draw

      if( body.state !== undefined )
        players[pi].send( JSON.stringify( { path : '/end', body : { state : body.state, win : body.win } } ) );
      players[pi?0:1].send( JSON.stringify( msg ) );

      if( body.state !== undefined )
        endTTT();

      break;
    }
    default: {
      console.error( "unknown msg ", msg );
      break;
    }
  }
}

// return : 0 : nothing
// 1 : pi wins
function processMove( pi, celli ) {
  ++moves;
  cgame[celli] = pi;
  return isWinState( celli );
}

// horizontal, vertical, diagonalx2
function isWinState( celli ) {
  // horizontal
  let cval;
  let start = Math.floor(celli/3)*3;
  l.info( "board ", cgame );
  let win = 1;
  for( let i = start; i < start+3; i++ ) {
    if( cval === undefined )
      cval = cgame[i];
    else if( cval !== cgame[i] ) {
      win = 0;
      break;
    }
  }

  if( win && cval > -1 ) {
    l.info( "horizontal", start );
    return [ start, start+1, start+2 ];
  }

  // vertical
  cval = undefined;
  win = 1;
  start = celli%3;
  for( let i = start; i < 9; i+=3 ) {
    if( cval === undefined )
      cval = cgame[i];
    else if( cval !== cgame[i] ) {
      win = 0;
      break;
    }
  }

  if( win && cval > -1 ) {
    l.info( "vertical", start );
    return [ start, start+3, start+6];
  }

  // diagonal1
  cval = undefined;
  win = 1;
  for( let i = 0; i < 9; i+=4 ) {
    if( cval === undefined )
      cval = cgame[i];
    else if( cval !== cgame[i] ) {
      win = 0;
      break;
    }
  }

  if( win && cval > -1 ) {
    l.info( "diagonal1");
    return [ 0, 4, 8];
  }

  // diagonal2
  cval = undefined;
  win = 1;
  for( let i = 2; i < 9; i+=2 ) {
    if( cval === undefined )
      cval = cgame[i];
    else if( cval !== cgame[i] ) {
      win = 0;
      break;
    }
  }

  if( win && cval < 0 )
    win = 0;

  if( win )
    l.info( "diagonal2" );
  return win ? [ 2, 4, 6] : null;
}
