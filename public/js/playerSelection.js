$(document).ready(function() {
  $("#defender").on("click",function() {
  	sessionStorage.setItem('playerType', 'defender');

	socket.on('connect', function() {
		socket.emit('chooseDefender', id, window.location.pathname);
	});
  });
  $("#attacker").on("click",function() {
	sessionStorage.setItem('playerType', 'attacker');

	socket.on('connect', function() {
		socket.emit('chooseAttacker', id, window.location.pathname);
	});
  });
});