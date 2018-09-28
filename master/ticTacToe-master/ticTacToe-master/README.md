# TicTacToe

Server based on nodejs, koa(web framework), ws( Websocket)
* Websocket based client/server communication

## Live Example on *localhost:8080*

## Running
### server
```bash
# edit server/config/config.js
node app.js
```

## Testing

## Code layout

### config
./server/config/config.js

### middleware config
./server/config/koa.js  <general middlewares>
./server/config/koaws.js  <WebSocket specific code>

### controllers
refer ./server/controllers

## Credits
Server side simply utilizes generally accepted Koa middleware, WebSockets and Node.js best practices.

## The Name
The project name is TicTacToe

## License
Copyright, Amit Handa
