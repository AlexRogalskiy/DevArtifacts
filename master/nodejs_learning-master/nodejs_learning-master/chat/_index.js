var express = require('express'),
    io = require('socket.io');
    app = express();

app.set('views', 'views');
app.set('view engine', 'ejs');


app.use(express.static('public'));

app.get('/', function (req, res){
    res.render('index');
});


var io = io.listen(app.listen(5000, function(){
    console.log('Listening on port 5000...');
}));


io.on('connection', function (socket){
    socket.emit('message', { message: 'Добро пожаловать в чат' });
    socket.on('send', function (data){
        io.emit('message', { message: data.message });
    });
});
