$(document).ready(function() {
	var socket = io.connect(window.location.host);
	
	$(document).on('click', function(event) {
		var target = $(event.target);

		if (target.is('#Game1')){
			sessionStorage.setItem('gameVersion', 1);
			socket.emit('play', 1);
			
		} else if (target.is('#Game2')){
			sessionStorage.setItem('gameVersion', 2);
			socket.emit('play', 2);
		}
	});
});