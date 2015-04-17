var io;
var gameSocket;
var playerType;
var attackers = {};
var defenders = {};
var games = {};

exports.initGame = function(sio, socket){
	io = sio;
	gameSocket = socket;
	gameSocket.emit('connected', {message: 'You are connected!'});

	gameSocket.on('chooseAttacker', chooseAttacker);
	gameSocket.on('chooseDefender', chooseDefender);
	gameSocket.on('foundPartner', foundPartner);
	gameSocket.on('quit', exitGame);
}

function chooseAttacker(id, room) {
	console.log("Someone choose an attacker");
	//if there are already defenders, send both players the other players id
	if(defenders[room] && defenders[room].length!=0) {
		var defender = defenders[room].pop();
		defender.connection.emit("foundPartner", {id, "attacker"});
	}
	//otherwise add them to a waiting list
	else {
		if(!attackers[room]) attackers[room]=[];
		attackers[room].push({"id" : id, "connection" : socket});
	}
}

function chooseDefender(id, room) {
	console.log("Someone choose a defender");
	if(attackers[room] && attackers[room].length!=0) {
		var attacker = attackers[room].pop();
		socket.emit("foundPartner", {attacker.id, "defender"});
	}
	else {
		if(!defenders[room]) defenders[room] = [];
		defenders[room].push({"id" : id, "connection" : socket});
	}
}

function foundPartner(id, type) {
	console.log('Connecting to: ', + id);
	playerType = type;
	startGame();
}

function exitGame() {
	window.location = '/gameSelection';
}