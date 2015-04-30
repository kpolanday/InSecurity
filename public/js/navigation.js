var socket = io.connect(window.location.host);
var navigation = 0;
var gameVersion;

var grass;
var floor;
var wall;
var objective;
var attacker_front;
var attacker_back;
var attacker_left;
var attacker_right;
var defender_front;
var defender_back;
var defender_left;
var defender_right;

var turn_num;
var gameSettings;
var game = sessionStorage.game;
var settings;
var canvas;
var map;
var playerType;
var playerId;
var opponentId;
var player;
var opponent;
var game_objects;

var cursor_x;
var cursor_y;

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
		socket.emit('play', sessionStorage.gameVersion);
		console.log('Player selected game %d', sessionStorage.gameVersion);
	});

	$("#defender").on("click",function() {
  		//sessionStorage.setItem('playerType', 'defender');
		socket.emit('chooseDefender', socket.id);
		playerType = 'defender';
		playerId = socket.id;
		document.getElementById('waitingMessage').innerText = 'Waiting for an opponent';
		$("#attacker").prop("disabled",true);
		$("#defender").prop("disabled",true);
	});

	$("#attacker").on("click", function() {
		//sessionStorage.setItem('playerType', 'attacker');
		socket.emit('chooseAttacker', socket.id);
		playerType = 'attacker';
		playerId = socket.id;
		document.getElementById('waitingMessage').innerText = 'Waiting for an opponent';
		$("#attacker").prop("disabled",true);
		$("#defender").prop("disabled",true);
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

/*
 CLIENT LISTENING FUNCTIONS
 */
socket.on('foundOpponent', function(opponent, room, opponentType) {
	console.log('found an opponent!', opponent);
	opponentId = opponent;
	socket.emit('joinGame', room);
	document.getElementById('waitingMessage').innerText = 'Joining Game...';
});

socket.on('gameJoined', function() {
	document.getElementById('waitingMessage').innerText = 'Starting Game...';
	startGame(gameVersion);
});

socket.on('joinedLobby', function(room) {
	console.log('You are now in ', room);
	$('#gameSelection').hide();
	$('#playerSelection').show();
	$('#backButton').show();
	navigation = 2;
});

/*
	MENU NAVIGATIONS
 */

function startGame(game) {
	navigation = 3;
	console.log('game starting');
	console.log(opponentId, playerId);
	switch(game){
		case 1:
			$('#playerSelection').hide();
			$('#game').show();
			$('#backButton').show();
			setupGame();
			break;

		default:
			$('#playerSelection').hide();
			$('#game').show();
			$('#backButton').show();
			setupGame();
	}
}