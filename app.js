var express = require('express')();
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http').Server(express);
var io = require('socket.io')(http);
var serveStatic = require('serve-static');

console.log('start');
var databaseUrl = 'localhose:27107/game';
var collections = ['gameSettings', 'turnData', 'mapArray'];
//var db = require('mongojs').connect(databaseUrl, collections);


var port = process.env.PORT || 3000;



express.set('views', __dirname + '/public');
express.set('view engine', 'html');
express.use(bodyParser.json());
express.use(bodyParser.urlencoded({extended:true}));

express.use(serveStatic(path.join(__dirname + '/public')));
express.use(serveStatic(path.join(__dirname + '/bower_components')));
express.use(serveStatic(path.join(__dirname + '/node_modules')));


express.get('/', function (req, res) {
  	res.sendFile(__dirname + '/index.html');
});


express.get('/map', function (req, res, next) {
	db.collection('game').findOne(req.id, function(err, item) {
		res.send(item.mapArray);
	});
});

express.post('/gameSettings', function (req, res) {
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

express.post('/turn', function (req, res) {
	db.collection('turnData').save(req.params);
	res.send(200);
});


/****************************
	SOCKET IO CONNECTION
****************************/
var attackers = {};
var defenders = {};
var players = [];

// add a room for each game lobby
var rooms = [];
rooms.push('gamelobby1'); // lobby for Game 1;

function generateRoom(length) {
	var haystack = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var room = 'room';
 
    for(var i = 0; i < length; i++) {
        room += haystack.charAt(Math.floor(Math.random() * 62));
    }
 
    return room;
}

io.sockets.on('connection', function(socket) {
	console.log('A player connected');
	socket.emit('gamemenu', {hello: 'WELCOME TO INSECURITY! ENJOY!'});
	var lobby = 'gamelobby1';
	attackers[lobby] = new Array(0);
	defenders[lobby] = new Array(0);
	
	// Player picks a game to play
	socket.on('play', function(game) {
		gameVersion = game;

		switch(game) {
			case 1:
				socket.room = 'gamelobby1';
				socket.join('gamelobby1');    // player joins the lobby of the game they selected
				
				players.push({'id': socket.id, 'connection': socket});

				console.log(players);

				break;
			default:
				socket.room = 'gamelobby1';
				socket.join('gamelobby1');    // player joins the lobby of the game they selected
		}

		console.log('Player ' + socket.id + ' is in room ' + socket.room);
		socket.emit('joinedLobby', socket.room);
	});

	// Player chose to play as an Attacker
	socket.on('chooseAttacker', function(id) {
		console.log(id, ' is playing as an Attacker');
		var room = socket.room;

		console.log(defenders[room]);
		if (defenders[room].length !== 0){
			// there is an available opponent!
			console.log('there is an opponent');
			var defender = defenders[room].pop();
			var gameroom = generateRoom(4);
			rooms.push(gameroom);

			socket.emit('foundOpponent', defender.id, room, 'defender');
			// let you're opponent know that you guys are playing
			socket.broadcast.to(defender.id).emit('foundOpponent', socket.id, room, 'attacker');
		} else {
			console.log('no one else is here');
			attackers[room].push({'id': id, 'connection': socket});
		}
	});

	// Player chose to play as an Defender
	socket.on('chooseDefender', function(id) {
		console.log(id, ' is playing as a Defender');
		var room = socket.room;

		// check to see if any of the rooms have people waiting to player
		console.log(attackers[room]);
		if (attackers[room].length !== 0){
			console.log('there is an opponent');
			var attacker = attackers[room].pop();
			var gameroom = generateRoom(4);
			rooms.push(gameroom);

			socket.emit('foundOpponent', attacker.id, gameroom, 'attacker');
			// let you're opponent know that you guys are playing
			socket.broadcast.to(attacker.id).emit('foundOpponent', socket.id, gameroom, 'defender');
		} else {
			console.log('no one else is here');
			defenders[room].push({'id': id, 'connection': socket});
		}

	});

	socket.on('joinGame', function(room){
		socket.leave(socket.room);
		socket.room = room;
		socket.join(room);
		console.log('joining game', room);
		console.log(socket.room);
		socket.emit('gameJoined');
	});

	socket.on('turnOver', function(player, opponent){
		socket.broadcast.to(opponent.id).emit('opponentTurn', player);
	});

	socket.on('gameOver', function(winner, opponent, player){
		socket.broadcast.to(opponent.id).emit('gameOver', winner, player);
	});

	// Player left the game session
	socket.on('quit', function(room) {
		socket.leave(room);
		socket.in(room).emit('leftRoom', id, room);
	});

	socket.on('disconnect', function() {
		// if the player disconnects while in a game session
		// initiate end game
		console.log('Player Disconnected');
		for (i = 0; i < players.length; i++){
			if (players[i].connection === socket) {
				players.splice(i, 1);
			}
		}
		
		if (socket.room !== 'gamelobby1') {
			socket.broadcast.to(socket.room).emit('gameOver');
		}

	});

});


// server listening on port 3000
http.listen(port, function() {
	console.log('Game server listening at port %d', port);
});