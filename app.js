var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var io = require('socket.io')(server);

console.log('start');
var databaseUrl = 'localhose:27107/game';
var collections = ['gameSettings', 'turnData', 'mapArray'];
//var db = require('mongojs').connect(databaseUrl, collections);

var app = express();

app.set('port', process.env.PORT || 3000);

app.set('views', __dirname + '/public');
app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname + '/public')));
app.use(express.static(path.join(__dirname + '/bower_components')));
app.use(express.static(path.join(__dirname + '/node_modules')));


app.get('/', function (req, res) {
	console.log(req.method, req.url);
  	res.render('/index.html');
});

/****************************
	SOCKET IO CONNECTION
****************************/
var attackers = {};
var defenders = {};
var players = {};
var rooms = ['lobby', 'room0', 'room1', 'room2', 'room3', 'room4', 'room5', 'room6', 'room7', 'room8', 'room9'];

io.sockets.on('connection', function(socket) {
	console.log('A player connected...');
	socket.on('play', function(id) {
		socket.player = id;
		socket.room = 'lobby';
		players[id] = id;

		socket.join('lobby');

		socket.emit('');
	});
});


// server listening on port 3000
app.listen(app.get('port'), function() {
	console.log('Game server listening on port ' + app.get('port'));
});