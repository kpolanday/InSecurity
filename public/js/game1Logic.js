var turn_num;

// once the player has moved send data
function endTurn(){
	if (player.type=='attacker' && player.action == 'moved'){
		if (player.playerItems !== null)
	}

	

}

function sendTurnData() {
	var turnData = {
		'turn_num': turn_num+1,
		'attacker': null
		'defender': null
		'gameOver': false;
	}

	var successHandler = function(data, textStatus, jqXHR){
		gameSettings = new Settings(data.version, data);
	};

	$.ajax({
		url: '/turn', // sending game settings to DB
		type: 'POST',
		data: JSON.stringify(turnData),
		contentType: 'application/json',
		dataType: 'json',
		success: successHandler
		}
	});
}

// once both players have made their moved resolve any conflicts
function resolveConflict(){

}

// checks to see if a player is in a Room
function isInRoom(){

}

// checks to see if a player can see the other player
function canSee(){

}

// game over send data to database
function gameOver(){

}