// once the player has moved send data
function endTurn(map){
	//var socket = io.connect(window.location.host);
	console.log('does it get here?');
	if (player.xcoor == opponent.xcoor && player.ycoor == opponent.ycoor){
		if (player.type == 'attacker') {
			gameOver(opponent.type);
		} else if (player.type == 'defender') {
			gameOver(player.type);
		}
		
		socket.emit('gameOver', winner, opponent, player);
	
	} else if (player.type == 'attacker' && player.numStars == settings.numObjectives){
		gameOver(player.type);
		socket.emit('gameOver', winner, opponent, player);
	
	} else {
		socket.emit('turnOver', player, opponent, game_objects);
		socket.on('opponentTurn', function(opponentInfo, updatedObjects) {
			opponent = opponentInfo;
			game_objects = updatedObjects;

			// update opponent location
			map.tile_array[opponent.oldXcoor][opponent.oldYcoor].type = 0;
			map.tile_array[opponent.xcoor][opponent.ycoor].type = 2;

			// if any of the objects were taken, update the map
			for (var i = 0; i < game_objects.length; i++) {
				if (game_objects[i].taken == true) {
					map.tile_array[game_objects[i].xcoor][game_objects[i].ycoor].type = 0;
				}
			}

			console.log('updated opponent: ', opponent);
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

function gameOver(winner){
	sendTurnData(true);
	//window.location.assign("http://localhost:3000/gameOver.html");

	if (player.type == winner) {
		document.getElementById('displayWinner').innerText = 'You Won!';
	} else {
		document.getElementById('displayWinner').innerText = 'You Lost...';
	}


	
}