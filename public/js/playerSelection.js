var socket = io.connect('http:localhost:3000');
$(document).ready(function() {
  $("#defender").on("click",function() {
  	sessionStorage.setItem('playerType', 'defender');

  	var socket = io.connect();
	socket.on('connect', function() {
		socket.emit('chooseDefender', socket.id, socket.room);
	});
  });
  $("#attacker").on("click", function() {
	sessionStorage.setItem('playerType', 'attacker');

	var socket = io.connect();
	socket.on('connect', function() {
		socket.emit('chooseAttacker', socket.id, socket.room);
	});
  });
});