var socket = io.connect(window.location.host);

$(document).ready(function() {
	
	$(document).on('click', function(event) {
		var target = $(event.target);

		if (target.is('#Game1')){
			//sessionStorage.setItem('gameVersion', 1);
			socket.emit('play', 1);
			console.log('Player selected game %d', 1);
			
		} else if (target.is('#Game2')){
			//sessionStorage.setItem('gameVersion', 2);
			socket.emit('play', 2);
		}
	});

	socket.on('joinedLobby', function(room) {
		console.log('You are now in ', room);
		window.location = 'http://localhost:3000/playerSelection.html';
	});
});

