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

app.get('/map', function(req, res, next) {
	db.collection('game').findOne(req.id, function(err, item) {
		res.send(item.mapArray);
	});
});

app.post('/gameSettings', function(req, res) {
	db.collection('gameSettings').find(req.params, function(err, doc) {
		if (doc.length === 0) {
			req.params.frequency = 1;
			db.collection('game').save(req.params);
		} else {
			db.collections('game').update(req.params);
		}
	});
	res.send(200);
});

app.post('/turnData', function(req, res) {
	db.collection('turnData').save(req.params);
	res.send(200);
});


/****************************
	SOCKET IO CONNECTION
****************************/
var attackers = {};
var defenders = {};
var players = {};

// add a room for each game lobby
var rooms = ['lobby', 'room0', 'room1', 'room2', 'room3', 'room4', 'room5', 'room6', 'room7', 'room8', 'room9'];

io.sockets.on('connection', function(socket) {
	console.log('A player connected...');
	
	// Player picks a game to play
	socket.on('play', function() {
		socket.player = socket.id;
		socket.room = 'lobby';	// define the room
		players[id] = id;  		// add player to client's global list
		socket.join('lobby');	// player joins the lobby of the game they selected
	});

	// Player chose to play as an Attacker
	socket.on('chooseAttacker', fuction(id, room) {
		console.log(id, ' is playing as an Attacker');


	});

	// Player chose to play as an Defender
	socket.on('chooseDefender', function(id, room) {
		console.log(id, ' is playing as a Defender');

	});

	// Player is looking for an opponent
	socket.on('lookingForOpponent' function(id, player) {

	});

	// Player found an opponent
	socket.on('foundOpponent', function(){});

	socket.on('movePlayer', movePlayer);
	
	// Player left the game session
	socket.on('quit', function(room) {

	});

	socket.on('gameOver', gameOver);

	socket.on('disconnect', function(room) {
		// if the player disconnects while in a game session
		// initiate end game
		if (room !== 'lobby') {
			socket.in(room).emit('gameOver');
		} else {
			// remove people who have disconnected without finding a partner
			for (var i = 0; i < players.length; i++){
				if (players[i].connection === socket) {
					players.splice(i, 1);
				}
			}
			for (var i = 0; i < attackerss.length; i++){
				if (attackerss[i].connection === socket) {
					attackerss.splice(i, 1);
				}
			}
			for (var i = 0; i < players.length; i++){
				if (players[i].connection === socket) {
					players.splice(i, 1);
				}
			}
		}

	});

});


// server listening on port 3000
app.listen(app.get('port'), function() {
	console.log('Game server listening on port ' + app.get('port'));
});