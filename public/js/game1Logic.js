// once the player has moved send data
function endTurn(){
	//var socket = io.connect(window.location.host);
	
	if (player.xcoor == opponent.xcoor && player.ycoor == opponent.ycoor){
		if (player.type == 'attacker') {
			gameOver(opponent.type);
		} else if (player.type == 'defender') {
			gameOver(player.type);
		}
		
		socket.broadcast.to(socket.room).emit('gameOver', player);
	
	} else if (player.type == 'attacker' && player.numStars == settings.numObjectives){
		gameOver(player.type);
		socket.broadcast.to(socket.room).emit('gameOver', player);
	
	} else {
		socket.broadcast.to(socket.room).emit('turnOver', player);

		socket.on('turnOver', function(opponent) {
			console.log(opponent);

		});

		sendTurnData(false, '');
	}

}

function sendTurnData(gameOver, winner) {
	var turnData = {
		'turn_num': turn_num+1,
		'attacker': null,
		'defender': null,
		'gameOver': false,
		'winner': ''
	}

	if (player.type == 'attacker') {
		turnData.attacker = player;
		turnData.defender = opponent;
	} else if (player.type == 'defender') {
		turnData.attacker = opponent;
		turnData.defender = player;
	}

	if (gameOver) {
		turnData.winner = winner;
	}

	/*
	$.ajax({
		url: '/turn', // sending game settings to DB
		type: 'POST',
		data: JSON.stringify(turnData),
		contentType: 'application/json',
		dataType: 'json',
		success: successHandler
	});
	*/
}

// game over send data to database
function gameOver(winner){
	socket.on('gameOver', function(opponent) {
		console.log(opponent);
		// updating opponent location
	});

	sendTurnData(true);
	//window.location.assign("http://localhost:3000/gameOver.html");

	if (player.type == winner) {
		document.getElementById('displayWinner').innerText = 'You Won!';
	} else {
		document.getElementById('displayWinner').innerText = 'You Lost...';
	}
	
}