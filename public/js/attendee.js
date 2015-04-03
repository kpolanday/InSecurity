function Attendee() {
	// set location - needs to be randomized
	this.xpos = 400;
	this.ypos = 400;
	this.type = Math.ceil(random(4));
}

Attendee.prototype.display = function() {
	// shows a different color based on type
	switch (this.type) {
		case 1:
			break;
		case 2:
			break;
		case 3:
			break;
		case 4:
			break;
	}

	Attendee.move();
}

Attendee.move = function() {
	// figure this out relative to xpos and ypos!
}