$(document).ready(function() {
	$(document).on('click', function(event) {
		var target = $(event.target);

		if (target.is('#Game1')){
			sessionStorage.setItem('gameVersion', 1);
		} else if (target.is('#Game2')){
			sessionStorage.setItem('gameVersion', 2);
		}

		console.log(sessionStorage.gameVersion);
	});
});