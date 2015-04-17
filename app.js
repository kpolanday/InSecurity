var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	mongojs = require('mongojs'),
	db = mongojs("InSecurity", []),
	io = require('socket.io').listen(server);

var game = require('./public/js/game.js');
var bodyParser = require('body-parser');

app.configure(function() {
	app.use(express.static(__dirname + "/public"));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
});

io.sockets.on('connection', function(socket) {
	console.log('A player connected...');
	initGame(io, socket);
});

server.listen(3000);