var socket = io.connect(window.location.host);
var navigation = 0;
var gameVersion;

$(document).ready(function() {
	$('#mainMenu').show();
	$('#gameSelection').hide();
	$('#playerSelection').hide();
	$('#game').hide();
	$('#backButton').hide();
	$('#gameOver').hide();

	

	socket.on('gamemenu', function (data) {
		console.log(data.hello);
	});
	

		$('#playButton').on('click', function() {
			$('#mainMenu').hide();
			$('#gameSelection').show();
			$('#backButton').show();

			navigation = 1;
		});

		$('#Game1').on('click', function() {
			sessionStorage.setItem('gameVersion', 1);
			gameVersion = 1;
			socket.emit('play', gameVersion);
			console.log('Player selected game %d', gameVersion);
		});

		$("#defender").on("click",function() {
  			sessionStorage.setItem('playerType', 'defender');
			socket.emit('chooseDefender', socket.id);
			document.getElementById('waitingMessage').innerText = 'Waiting for an opponent';
			$("#attacker").prop("disabled",true);
			$("#defender").prop("disabled",true);
  		});
  		
  		$("#attacker").on("click", function() {
			sessionStorage.setItem('playerType', 'attacker');
			socket.emit('chooseAttacker', socket.id);
			document.getElementById('waitingMessage').innerText = 'Waiting for an opponent';
			$("#attacker").prop("disabled",true);
			$("#defender").prop("disabled",true);
		});

		socket.on('foundOpponent', function(opponent, room) {
			console.log('found an opponent!', opponent);
			socket.emit('joinGame', room);
			document.getElementById('waitingMessage').innerText = 'Joining Game...';
		});

		socket.on('gameJoined', function() {
			document.getElementById('waitingMessage').innerText = 'Starting Game...';
			startGame(gameVersion);
		});

		$('#backButton').on('click', function() {
			console.log(navigation);
			switch(navigation) {
				case 0:
					//main menu
					break;
				case 1:
					//game selection
					$('#mainMenu').hide();
					$('#gameSelection').show();
					$('#playerSelection').hide();
					$('#game').hide();
					$('#backButton').show();
					$('#waitingMessage').hide();
					$('#gameOver').hide();

					navigation = 0;
					break;
				case 2:
					//player selection
					$('#mainMenu').hide();
					$('#gameSelection').show();
					$('#playerSelection').hide();
					$('#game').hide();
					$('#backButton').show();
					$('#gameOver').hide();

					navigation = 1;
					break;

				case 3:
					//game session
					$('#mainMenu').hide();
					$('#gameSelection').show();
					$('#playerSelection').hide();
					$('#game').hide();
					$('#backButton').show();
					$('#gameOver').hide();

					navigation = 1;
					break;
				case 3:
					//game over
					$('#mainMenu').hide();
					$('#gameSelection').show();
					$('#playerSelection').hide();
					$('#game').hide();
					$('#backButton').show();
					$('#gameOver').hide();

					navigation = 1;
					break;

				default:
					//game selection
					$('#mainMenu').hide();
					$('#gameSelection').show();
					$('#playerSelection').hide();
					$('#game').hide();
					$('#backButton').show();
					$('#waitingMessage').hide();
					$('#gameOver').hide();

					navigation = 0;
			}
		});

	$('#replay').on('click', function() {
		$('#gameOver').hide();
		$('#game').show();

		navigation = 3;
	});

	$('#gamelobby').on('click', function() {
		$('#mainMenu').hide();
		$('#gameSelection').show();

		navigation = 1;
	});

	
});

socket.on('joinedLobby', function(room) {
	console.log('You are now in ', room);
	$('#gameSelection').hide();
	$('#playerSelection').show();
	$('#backButton').show();
	navigation = 2;
});


function startGame(game) {
	navigation = 3;
	console.log(socket.room, 'game starting');
	switch(game){
		case 1:
			$('#playerSelection').hide();
			$('#game').show();
			$('#backButton').show();
			break;
		default:
			$('#playerSelection').hide();
			$('#game').show();
			$('#backButton').show();
	}
}