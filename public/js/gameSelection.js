var game;

$(document).ready(function() {
	$(document).on('click', function(event) {
		var target = $(event.target);

		if (target.is('#Game1')){
			game = 1;
		} else if (target.is('#Game2')){
			game = 2;
		}

		console.log(game);
	});
});