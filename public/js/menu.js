var canvas;
var attacker;
var defender;

/* determines which game the player chose */
var game;
var game1; 		// Game1 button
var game2;		// Game2 button
var startButton;
var credButton;
var backButton;

// used to navigate between different views
var navigation;
/* navigation values
	main = 0
	menu = 1
	credits = 2;
	game = 3;
*/

var game_map = [];
var gameStarted;

var game_objects = new Array(0);
var game_players = new Array(0);
var selected_player = 0;

// Grid Data
var grid_array;
var grid_width;
var grid_height;
var tile_size;

function preload() {
	// images and map tiles go here
}

function setup() {
	/* -- REPLACE WITH A BACKGROUND IMAGE --*/
	//canvas = createCanvas(500, 500);
	//canvas.parent('gameContainer');
	menuNavigation();
	// attacker = new Attacker();
	// defender = new Defender();


	navigation = 0; // defaults to the main screen
	gameStarted = false; // default value is false;
}

function draw() {
	// draw map here

	switch (navigation) {
		case 0:
			startButton.show();
			credButton.show();

			backButton.hide();
			game1.hide();
			game2.hide();
			break;
		
		case 1:
			startButton.hide();
			credButton.hide();

			backButton.show();
			game1.show();
			game2.show();	
			break;
		
		case 2:
			startButton.hide();
			credButton.hide();
			game1.hide();
			game2.hide();

			backButton.show();	
			break;
		
		case 3:
			startButton.hide();
			credButton.hide();
			backButton.hide();
			game1.hide();
			game2.hide();

			if(gameStarted == true) {
				// determines which game needs to be shown
				switch (game) {
					case 1:
						// load Game1 logic and stuff
						break;
					case 2:
						// load Game2 logic and stuff
						break;
				}

			}
			
			break;
	}

}

function menuNavigation() {
	startButton = createButton('Play');
	startButton.class('btn btn-primary btn-lg');
	startButton.position(600, 400);
	startButton.mouseClicked(loadMenu);


	credButton = createButton('Credits');
	credButton.class('btn btn-default btn-lg');
	credButton.position(670,400);
	credButton.mouseClicked(loadCredits);

	backButton = createButton('Back');
	backButton.class('btn btn-default btn-lg');
	backButton.mouseClicked(loadMain);
	backButton.position(800, 500);
	backButton.hide();

	game1 = createButton('Basic Game');
	game1.class('btn btn-primary btn-lg');
	game1.position(550, 400);	
	game1.mouseClicked(startGame1);
	
	game2 = createButton('Jewels Game');
	game2.class('btn btn-primary btn-lg');
	game2.position(700, 400);
	game2.mouseClicked(startGame2); // we can add or remove games
}

function loadMenu() {
	navigation = 1;
}

function loadMain() {
	navigation = 0;
}

function loadCredits() {
	navigation = 2;
}

/* Dave's Demo */
function startGame1() {
	navigation = 3;
	game = 1;
	gameStarted = true;

	var settings = {}; // figure this out later

	// Create game map
	game_map = new CustomGameMap(CUSTOM_MAP, TILE_SIZE);

	// Create canvas
	createCanvas((game_map.size_horizontal+2)*TILE_SIZE,(game_map.size_vertical+2)*TILE_SIZE);

	// Update player accessibility
	if (game_players.length > 0) {
		for (var player = 0; player < game_players.length; player++) {
			updateTileAccessibility(game_map,game_players[player].location_x,game_players[player].location_y);
		}
	}

	// Set Players to be red and blue
	game_players[0].player_color = color(50,90,195);
	game_players[1].player_color = color(235,55,35);
}

/* JEWEL ROBBER GAME */
function startGame2() {
	navigation = 3;
	game = 2;
	gameStarted = true;
	
	var settings = {};
	//var gameSetup = getGameSettings(game, settings);

	grid_width = 20;
	grid_height = 20;
	tile_size = 25;

	var attendees = [];
	var jewels = [];

	var stolenGoods; // total value of jewels stolen for attacker

}

/*
function displayPlayers() {
	attacker.display();
	defender.display();

	if (game == 2) {
		attendee.display();
	}
}

function getGameSettings() {
	/* give all the game settings to the data database
	 * send request to database:
	 * - game (which game the user is playing)
	 * - additional non-default game settings
	 * - map size
	 * 
	 * returns:
	 * - map array (filled with 1's and 0s)
	 * - map tiles (images)
	 * - tile to grid array (tells us where each tile will go; same sized array but filled with tile name);
	 

	 // map = map_array_from_database
	 // mapLegend = tile_to_grid_array_from_database;

	 // example map legend array
	 var mapLegend = [
	 	[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0],
	 	[0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0],
	 	[0,0,3,1,0,0,0,1,3,1,0,2,0,0,0,1,0,0,0,0],
	 	[0,0,1,1,0,3,3,1,0,1,0,1,1,0,0,1,0,0,0,0],
	 	[0,0,3,1,0,0,0,1,3,1,0,2,0,0,0,1,0,0,0,0],
	 	[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0],
	 	[1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,2,0,0,0,0],
	 	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],
	 	[1,1,2,1,1,1,0,0,0,0,0,0,0,0,0,1,1,2,1,1],
	 	[0,0,0,0,0,1,0,0,1,1,2,1,1,0,0,0,0,0,0,0],
	 	[0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0],
	 	[0,0,0,0,0,1,0,0,2,0,0,0,2,0,0,0,0,0,0,0],
	 	[0,0,0,0,0,2,0,0,1,0,0,0,1,0,1,1,1,2,1,1],
	 	[0,0,0,0,0,1,0,0,1,1,2,1,1,0,1,0,0,0,0,0],
	 	[0,0,0,0,0,1,0,0,0,0,0,0,0,0,2,0,0,3,3,0],
	 	[1,1,2,1,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
	 	[0,0,0,0,0,0,0,0,1,1,1,1,1,0,1,1,0,0,0,0],
	 	[0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,3,0,0],
	 	[0,0,0,0,0,0,0,0,2,0,3,0,2,0,0,2,0,3,0,0],
	 	[0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,0,0,0]];

	 	/*
	 		0 - valid areas to move to
	 		1 - wall/players cannot go through
			2 - door (entrance or exit)
			3 - steal item/treasure
			4 - door entrance only
			5 - door exit only
	 	

	buildMap(maplegend);
}

function buildMap(maplegend) {
	var length = map.length; // square map

	/*
	for (var x = 0; x < length; x++){
		for(var y = 0; y < length; y++){
			if(mapLegend[x][y] == 1) {
				// at this coordinate place a tile
			}
		}
	}
	
}
*/