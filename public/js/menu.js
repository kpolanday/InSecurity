var canvas;
var attacker;
var defender;

/* determines which game the player chose */
var game;
var game1;
var game2;
var game3;

var menu;
var gameStarted;

function preload() {
	// images and map tiles go here
}

function setup() {
	canvas = createCanvas(800, 800);
	canvas.parent('gameContainer');

	startButton = createButton('Play');
	startButton.class('btn btn-primary')
	startButton.mousePressed(loadMenu);

	credButton = createButton('Credits');
	credButton.class('btn btn-default');
	credButton.mousePressed(loadCredits);

	// These need images for the mousePress event to work
	game1.mousePressed(startGame1);
	game2.mousePressed(startGame2);
	game3.mousePressed(startGame3); // we can add or remove games

	attacker = new Attacker();
	defender = new Defender();

	menu = false;
	gameStarted = false; // default value is false;
}

function draw() {
	// draw map here
	background(51);

	if(menu == true){
		// Hide the 
		startButton.hide();
		credButton.hide();

		game1.show();
		game2.show();
		game3.show();
	}

	if(gameStarted == true && menu == false) {
		game1.hide();
		game2.hide();
		game3.hide();


		// determines which game needs to be shown
		switch (game) {
			case 1:
				// load Game1 logic and stuff
			case 2:
				// load Game2 logic and stuff
			case 3:
				// load Game 3 logic and stuff
		}

	}

}

function loadMenu() {
	menu = true;
}

function displayPlayers() {
	attacker.display();
	defender.display();
}

function map() {
	// create map functions here
}