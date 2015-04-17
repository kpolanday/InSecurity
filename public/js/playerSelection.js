var playerType;

$(document).ready(function() {
  $("#defender").on("click",function() {
    chooseDefender();
  });
  $("#defender").on("click",function() {
    chooseAttacker();
  });
});

function chooseDefender() {
	playerType = 'defender';
	socket.on('connect', function() {
		socket.emit('chooseDefender', {id, window.location.pathname});
	});
}

function chooseAttacker() {
	playerType = 'attacker';
	socket.on('connect', function() {
		socket.emit('chooseAttacker', {id, window.location.pathname});
	});
}