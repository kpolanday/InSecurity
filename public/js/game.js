
var gameSettings;
var grass;
var wall;
var objective;

var settings;
var canvas;
var map;
var map_radius;
var map_zone;
var game_objects = new Array(0);

var current_screen= 0;
var cursor_x;
var cursor_y;


function preload() {
	//grass = loadImage('images/grass.png');
	//wall = loadImage('images/wall_obstacle.png');
	//objective = loadImage('images/key_objective.png');
}

function setup() {
	canvas = createCanvas(500, 500);
	canvas.parent('gameContainer');

	sendGameSettings();
	setupGame();
}

function draw() {
	drawGameSession();
}


/*******************
	GAME OBJECTS
*******************/
function Settings(version, gameSettings) {
	this.game_version = version; // default=1;
	this.game_id = gameSettings.game_id; // you return this to me when you create the settings object
	this.map_width = gameSettings.map_width;
	this.map_height = gameSettings.map_height;
	this.numObjectives = gameSettings.numObjectives; // default = 3, can have more depending on map
	this.view = gameSettings.view; // 'default', 'camera'
	this.enableItems = gameSettings.enableItems; // bool
}

function Player(type, x, y) {
	this.type = type;
	
	this.xcoor = x;
	this.ycoor = y;
	this.oldXCoor = x;
	this.oldYCoor = y;
	
	this.direction;
	this.moving;
	this.distance_left = 0;
	this.edge = 0;
	this.action = 'nothing';
	
	this.playerItems = new Array(0);
}

/* Object in the game
 * Objects can be:
 * 	- Objective(key, jewel, flag)
 *	- Item (shovel, teleport)
 */
function GameObject(type, x, y) {
	this.type = type;
	this.xcoor = x;
	this.ycoor = y;
	this.taken = false;
	this.used = false;
}

/* Defines a room or enclosed area within the map
	rooms are defined by their 4 corners
	each input is an array of [x,y] coordinates
*/
function GameRoom(topLeft, topRight, botLeft, botRight){
	this.topEdge;
	this.bottomEdge;
	this.leftEdge;
	this.rightEdge;

	this.topEdge = {
		'row': topLeft[0],
		'cols': [topLeft[1], topRight[1]];
	};

	this.bottomEdge = {
		'row': botLeft[0],
		'cols': [botLeft[1], botRight[1]];
	};

	this.leftEdge = {
		'rows': [topLeft[0], botLeft[0]],
		'col': topLeft[1];
	};

	this.leftEdge = {
		'rows': [topRight[0], botRight[0]],
		'col': topRight[1];
	};
}

function Tile(type, size) {
	this.type = type;
	this.size = size;
	this.tile_accessibility = 1;
	
	switch(type) {
		case 1:
			this.color = color(80, 80, 80);
			this.tile_accessibility = 0;
			break;
		default:
			this.color = color(255, 255, 255);
			this.tile_accessibility = 1;
	}
}

function GameMap(width, height, map_array, rooms) {
	// Game Map attributes
	this.width = width;
	this.height = height;
	this.tile_size = (500/this.width);
	this.tile_array;
	this.rooms;

	// Generates a new Tile Array
	this.tile_array = new Array(this.width);
	for (var column = 0; column < this.width; column++) {
		this.tile_array[column] = new Array(this.height);
	}

	// Generate Game Map of Tiles
	for (var column = 0; column < this.width; column++) {
		for (var row = 0; row < this.height; row++) {
				this.tile_array[column][row] = new Tile(map_array[row][column], this.tile_size);
		}
	}

	for (var i; i < rooms.num; i++){
		this.rooms = new GameRoom(rooms[i].topleft, rooms[i].topright, rooms[i].botleft, rooms[i].botright);
	}
}


/**********************
	GAME FUNCTIONS
**********************/
function sendGameSettings() {
	/* not connected to the DB yet
	 * uncomment once DB is connected

	var settings = {
		'version': gameSettings.version,
		'map_width': gameSettings.map_width,
		'map_height': gameSettings.map_height,
		'view': gameSettings.view,
		'enableItems': gameSettings.enableItems
	}

	var successHandler = function(data, textStatus, jqXHR){
		gameSettings = new Settings(data.version, data);
	};

	$.ajax({
		url: '/settings', // sending game settings to DB
		type: 'POST',
		data: JSON.stringify(settings),
		contentType: 'application/json',
		dataType: 'json',
		success: successHandler
		}
	});
	*/

	var defaultSettings = {
		'game_version': 1,
		'game_id': 1111111,
		'map_width': 29,
		'map_height': 29,
		'map_radius': 2,
		'numObjectives': 3,
		'view': 'camera',
		'enableItems': false
	}; 

	gameSettings = new Settings(defaultSettings.game_version, defaultSettings);
}

/**********************
	SETUP FUNCTIONS
**********************/
function setupGame() {
	/* get Map Data
		
		var gameData = {
			'version': settings.version,
			'id': settings.id
		}

		$.ajax({
			url: '/map', // getting a map and the rest of the information from the DB
			type: 'GET',
			data: JSON.stringify(gameData),
			dataType: 'json'
		}).done(function(response) {
			map = new GameMap(response.width, response.height, response.map_array);
		});
	
		var playerData = {
			'type': playerType
		}

		$.ajax({
			url: '/player',
			type: 'GET',
			data: JSON.stringify(playerData),
			dataType: 'jason'
		}).done(function(response) {
			player = new Player(response.type, response.startX, response.startY);
		})
	*/

	// remove when DB is connected
	var mapArray = [
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	 	[0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
	 	[0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,0,0,1,0,0],
	 	[0,0,1,0,0,1,1,1,0,1,1,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0],
	 	[0,0,1,0,0,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,2,0,1,0,0,1,0,0],
	 	[0,0,1,0,0,1,3,0,0,0,0,1,1,0,1,0,0,0,1,0,0,0,0,1,0,0,1,0,0],
	 	[0,0,1,0,0,1,0,0,0,0,0,1,1,0,1,0,0,0,1,0,0,0,0,1,0,3,1,0,0],
	 	[0,0,1,0,0,1,1,1,0,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,1,0,0],
	 	[0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,0,0,1,0,0],
	 	[0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
	 	[0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0],
	 	[0,0,1,1,1,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1,0,0],
	 	[0,0,1,0,0,0,0,0,1,0,0,1,1,0,1,1,0,0,0,0,0,0,1,0,0,0,1,0,0],
	 	[0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,0],
	 	[0,0,1,0,1,1,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0],
	 	[0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0],
	 	[0,0,1,0,3,1,0,0,0,0,0,1,0,0,0,1,0,0,1,1,1,1,1,1,0,1,1,0,0],
	 	[0,0,1,0,0,1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0,1,1,1,0,0,1,0,0],
	 	[0,0,1,0,1,1,0,0,1,0,0,1,1,0,1,1,0,0,0,0,0,1,1,1,0,0,1,0,0],
	 	[0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,1,0,0],
	 	[0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,3,1,0,0],
	 	[0,0,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,1,0,0],
	 	[0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,0,0,0,1,1,0,1,0,0],
	 	[0,0,1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1,0,0],
	 	[0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1,0,0],
	 	[0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
	 	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	 	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

	map = new GameMap(29,29, mapArray);
	player = new Player(playerType, )
	num_starts = settings.numObjectives;

	// Update player accessibility;
	updateTileAccessibility(map, player);
}

// Gets tile index that the mouse is currently hovering over
function updateCursor(x_coord, y_coord) {
	cursor_x = (int)(x_coord/map.tile_size)-1;
  	cursor_y = (int)(y_coord/map.tile_size)-1;
}

/**********************
	DRAW FUNCTIONS
**********************/
function drawGameSession() {
	updateCursor(mouseX, mouseY);
  	startGame();
}

function drawMap(map) {
	// Onscreen tile index
	var tile_xcoor = 0;
	var tile_ycoor = 1;

	findZone();

	// Calculate start and end points for camera
	var start_y;
	var end_y;
	if (player.ycoor-map_radius-1 < 0) {
		start_y = 0
		end_y = map_radius*2+1;
	} else if (player.ycoor+map_radius+1 > map.height-1) {
		start_y = map.height-3-(map_radius*2);
		end_y = map.height-2;
	}
	else {
		start_y = player.ycoor-map_radius-1;
		end_y = player.ycoor+map_radius+1;
	}

	// For all tiles within a certain radius around the player
  	for(start_y; start_y <= end_y; start_y++) {
  		var start_x;
		var end_x;
		if (player.xcoor-map_radius-1 < 0) {
			start_x = 0
			end_x = map_radius*2+2;
		} else if (player.xcoor+map_radius+1 > map.width-1) {
			start_x = map.width-3-(map_radius*2);
			end_x = map.width-1;
		}
		else {
			start_x = player.xcoor-map_radius-1;
			end_x = player.xcoor+map_radius+1;
		}
  		for(start_x; start_x <= end_x; start_x++) {
  			// Iterate through the onscreen tiles
  			if(tile_xcoor==map_radius*2+3) {
  				tile_xcoor=1;
  				tile_ycoor++;
  			} else {
  				tile_xcoor++;
  			}
			//drawObject(game_objects[0],map,5,5);
  			if (player.moving == 1) {
				if (player.distance_left < 0) {
					player.distance_left = 0;
					player.moving = 0;
					drawTile(map.tile_array[start_x][start_y],tile_xcoor,tile_ycoor,cursor_x,cursor_y);
				} else {
					if (edgeCase()) {
						drawTile(map.tile_array[start_x][start_y],tile_xcoor,tile_ycoor,cursor_x,cursor_y);
					} else {
						player.distance_left = player.distance_left - .06;
			  			drawTileMotion(map.tile_array[start_x][start_y],tile_xcoor,tile_ycoor,cursor_x,cursor_y,player.distance_left);
					}
				}
			} else {
		  		drawTile(map.tile_array[start_x][start_y],tile_xcoor,tile_ycoor,cursor_x,cursor_y);
			}
			

			//Draw item
  			if (map.tile_array[start_x][start_y].tile_data > 2) {
	  			for (var obj = 0; obj < game_objects.length; obj++) {
	  				// Check if the current map tile contains the current item
	  				if (game_objects[obj].xcoor == start_x && game_objects[obj].ycoor == start_y) {
	  					// Draw the item at the correct onscreen tile
	  					drawObjectMotion(game_objects[obj],map,tile_xcoor-1,tile_ycoor-1,player.distance_left);
	  				}
	  			}
			}
		}
  	}
}

function drawPlayer(map, type) {
	// Onscreen tile index;
	var tile_xcoor = 0;
	var tile_ycoor = 1;

	if (settings.view == 'camera'){
		findZone();

		// Calculate start and end point for camera
		var start_y;
		var end_y;

		if (player.ycoor-map_radius-1 < 0) {
			start_y = 0
			end_y = map_radius*2+1;
		
		} else if (player.ycoor+map_radius+1 > map.height-1) {
			start_y = map.height-3-(map_radius*2);
			end_y = map.height-2;
		
		} else {
			start_y = player.ycoor-map_radius-1;
			end_y = player.ycoor+map_radius+1;
		}

		// For all tiles within a certain radius around the player
  		for(start_y; start_y <= end_y; start_y++) {
  			var start_x;
			var end_x;
			if (player.xcoor-map_radius < 0) {
				start_x = 0
				end_x = map_radius*2;
			} else if (player.xcoor+map_radius > map.width-1) {
				start_x = map.width-1-(map_radius*2);
				end_x = map.width-1;
			}
			else {
				start_x = player.xcoor-map_radius;
				end_x = player.xcoor+map_radius;
			}
  		
  			for(start_x; start_x <= end_x; start_x++) {
  				// Iterate through the onscreen tiles
  				if(tile_xcoor==map_radius*2+1) {
  					tile_xcoor=1;
  					tile_ycoor++;
  				} else {
  					tile_xcoor++;
  				}
  				// Draw player
  				if (map.tile_array[start_x][start_y].tile_data == 2) {
	  				// Check if the current map tile contains the player
	  				if (player.xcoor == start_x && player.ycoor == start_y) {
	  					// Draw the player at the correct onscreen tile
	  					fill(player.color);
						// draw player character
		  				if (map_zone == 2) {
		  					ellipse(map.tile_size*(1.5+tile_xcoor),map.tile_size*(1.5+tile_ycoor-1),map.tile_size*.8,map.tile_size*.8);	
		  				} else if (map_zone == 4) {
		  					ellipse(map.tile_size*(1.5+tile_xcoor-1),map.tile_size*(1.5+tile_ycoor),map.tile_size*.8,map.tile_size*.8);	
		  				} else if (map_zone == 6) {
		  					ellipse(map.tile_size*(1.5+tile_xcoor+1),map.tile_size*(1.5+tile_ycoor),map.tile_size*.8,map.tile_size*.8);	
		  				} else if (map_zone == 8) {
		  					ellipse(map.tile_size*(1.5+tile_xcoor),map.tile_size*(1.5+tile_ycoor+1),map.tile_size*.8,map.tile_size*.8);	
		  				} else {
		  					ellipse(map.tile_size*(1.5+tile_xcoor),map.tile_size*(1.5+tile_ycoor),map.tile_size*.8,map.tile_size*.8);
		  				}
	  			
  					}
  				}
  		
			}
		}

	} 

	/*else (settings.view == 'default') {


	}*/

}

function findZone() {
	// Zone 2
	if (player.ycoor-map_radius-1 < 0 && 
		player.xcoor-map_radius-1 < 0) {
		map_zone = 1;
		return true;
	}

	// Zone 3
	if (player.xcoor+map_radius+3>map.width+1 &&
		player.ycoor-map_radius-1 < 0) {
		map_zone = 3;
		return true;
	}

	// Zone 2
	if (player.ycoor-map_radius-1 < 0) {
		map_zone = 2;
		return true;
	}

	// Zone 4
	if (player.ycoor-map_radius-1 >= 0 && 
		player.ycoor+map_radius < map.height-1 &&
		player.xcoor-map_radius-1 < 0) {
		map_zone = 4;
		return true;
	}

	// Zone 6
	if (player.xcoor+map_radius+3>map.width+1 &&
		player.ycoor-map_radius-1 >= 0 &&
		player.ycoor+map_radius+1 < map.height) {
		map_zone = 6;
		return true;
	}

	// Zone 5
	if (player.ycoor-map_radius-1 < 0) {
		map_zone = 5;
		return true;
	}

	// Zone 7
	if (player.ycoor+map_radius+1 > map.height-1 && 
		player.xcoor-map_radius-1 < 0) {
		map_zone = 7;
		return true;
	}

	// Zone 9
	if (player.ycoor+map_radius+1 > map.height-1 && 
		player.xcoor+map_radius+1 > map.width-1) {
		map_zone = 9;
		return true;
	}

	// Zone 8
	if (player.ycoor+map_radius+1 > map.height-1) {
		map_zone = 8;
		return true;
	}s
}


function drawPlayerMotion(map, offset) {
	// Onscreen tile index
	var tile_xcoor = 0;
	var tile_ycoor = 1;

	// Calculate start and end points for camera
	var start_y;
	var end_y;
	if (player.ycoor-map_radius-1 < 0) {
		start_y = 0
		end_y = map_radius*2+2;
	} else if (player.ycoor+map_radius+1 > map.height-1) {
		start_y = map.height-1-(map_radius*2);
		end_y = map.height-1;
	}
	else {
		start_y = player.ycoor-map_radius-1;
		end_y = player.ycoor+map_radius+1;
	}

	// For all tiles within a certain radius around the player
  	for(start_y; start_y <= end_y; start_y++) {
  		var start_x;
		var end_x;
		if (player.xcoor-map_radius-1 < 0) {
			start_x = 0
			end_x = map_radius*2+2;
		} else if (player.xcoor+map_radius+1 > map.width-1) {
			start_x = map.width-1-(map_radius*2);
			end_x = map.width-1;
		}
		else {
			start_x = player.xcoor-map_radius-1;
			end_x = player.xcoor+map_radius+1;
		}
  		
  		for(start_x; start_x <= end_x; start_x++) {
  			// Iterate through the onscreen tiles
  			if(tile_xcoor==map_radius*2+3) {
  				tile_xcoor=1;
  				tile_ycoor++;
  			} else {
  				tile_xcoor++;
  			}

  			// Draw player
  			if (map.tile_array[start_x][start_y].tile_data == 2) {
	  			// Check if the current map tile contains the current player
	  			if (player.xcoor == start_x && player.ycoor == start_y) {
	  				// Draw the player at the correct onscreen tile
	  				fill(player.player_color);
	  				if(player.distance_left <= 0) {
	  					player.distance_left = 0;
	  					player.moving = 0;
	  				} else {
	  					player.distance_left = player.distance_left - 8.6;
	  				}
	  					
	  				switch (player.direction) {
	  					case "left":
	  						if (map_zone == 2) {
	  							ellipse(map.tile_size*(1.5+tile_xcoor-1)+offset,map.tile_size*(1.5+tile_ycoor-1),map.tile_size*.8,map.tile_size*.8);
	  						} else if (map_zone == 3) {
	  							ellipse(map.tile_size*(1.5+tile_xcoor+7)+offset,map.tile_size*(1.5+tile_ycoor-1),map.tile_size*.8,map.tile_size*.8);
	  						} else if (map_zone == 6) {
	  							ellipse(map.tile_size*(1.5+tile_xcoor)+offset,map.tile_size*(1.5+tile_ycoor),map.tile_size*.8,map.tile_size*.8);
	  						} else if (map_zone == 7) {
	  							ellipse(map.tile_size*(1.5+tile_xcoor-1)+offset,map.tile_size*(1.5+tile_ycoor+1),map.tile_size*.8,map.tile_size*.8);
	  						} else if (player.xcoor+map_radius+1 == map.width-1 && map_zone == 8) {
	  							ellipse(map.tile_size*(1.5+tile_xcoor-1)+offset,map.tile_size*(1.5+tile_ycoor+1),map.tile_size*.8,map.tile_size*.8);
	  						} else if (map_zone == 9 && player.xcoor+1+map_radius == map.width) {
	  							ellipse(map.tile_size*(1.5+tile_xcoor-2)+offset,map.tile_size*(1.5+tile_ycoor+2),map.tile_size*.8,map.tile_size*.8);
	  						} else if (map_zone == 9) {
	  							ellipse(map.tile_size*(1.5+tile_xcoor-2)+offset,map.tile_size*(1.5+tile_ycoor+2), map.tile_size*.8,map.tile_size*.8);
	  						} else {
 								ellipse(map.tile_size*(1.5+tile_xcoor-1)+offset,map.tile_size*(1.5+tile_ycoor-1),map.tile_size*.8,map.tile_size*.8);
	 						}
	  						break;
	  					case "right":
	  						if (map_zone == 2) {
	  							ellipse(map.tile_size*(1.5+tile_xcoor-1)-offset,map.tile_size*(1.5+tile_ycoor-1),map.tile_size*.8,map.tile_size*.8);
	  						} else if (map_zone == 3 && player.xcoor+map_radius+1 == map.width) {
	  							ellipse(map.tile_size*(1.5+tile_xcoor-6)-offset,map.tile_size*(1.5+tile_ycoor),map.tile_size*.8,map.tile_size*.8);
	  						} else if (map_zone == 3) {
	  							ellipse(map.tile_size*(1.5+tile_xcoor+7)-offset,map.tile_size*(1.5+tile_ycoor-1),map.tile_size*.8,map.tile_size*.8);
	  						} else if (map_zone == 6) {
	  							ellipse(map.tile_size*(1.5+tile_xcoor)-offset,map.tile_size*(1.5+tile_ycoor), map.tile_size*.8,map.tile_size*.8);
	  						} else if (map_zone == 7) {
	  							ellipse(map.tile_size*(1.5+tile_xcoor-1)-offset,map.tile_size*(1.5+tile_ycoor+1),map.tile_size*.8,map.tile_size*.8);
	  						} else if (player.xcoor-map_radius-1 == 0 && map_zone == 8) {
	  							ellipse(map.tile_size*(1.5+tile_xcoor-1)-offset,map.tile_size*(1.5+tile_ycoor+1),map.tile_size*.8,map.tile_size*.8);
	  						} else if (map_zone == 9 && player.xcoor+1+map_radius == map.width) {
	  							ellipse(map.tile_size*(1.5+tile_xcoor-2)-offset,map.tile_size*(1.5+tile_ycoor+2),map.tile_size*.8,map.tile_size*.8);
	  						} else if (map_zone == 9) {
	  							ellipse(map.tile_size*(1.5+tile_xcoor-2)-offset,map.tile_size*(1.5+tile_ycoor+2), map.tile_size*.8,map.tile_size*.8);
	  						} else {
	 							ellipse(map.tile_size*(1.5+tile_xcoor-1)-offset,map.tile_size*(1.5+tile_ycoor-1),map.tile_size*.8,map.tile_size*.8);	  								
	  						}
	  						break;
	 					case "up":
	  						if (map_zone == 2) {
	  							ellipse(map.tile_size*(1.5+tile_xcoor-1),map.tile_size*(1.5+tile_ycoor-1)-offset,map.tile_size*.8,map.tile_size*.8);
	  						} else if (map_zone == 3) {
	  							ellipse(map.tile_size*(1.5+tile_xcoor-4),map.tile_size*(1.5+tile_ycoor)-offset,map.tile_size*.8,map.tile_size*.8);
	 						} else if (map_zone == 6 && player.ycoor-map_radius-1 == 0) {
	  							ellipse(map.tile_size*(1.5+tile_xcoor),map.tile_size*(1.5+tile_ycoor)-offset,map.tile_size*.8,map.tile_size*.8);
	  						} else if (map_zone == 7) {
	  							ellipse(map.tile_size*(1.5+tile_xcoor-1),map.tile_size*(1.5+tile_ycoor+1)-offset,map.tile_size*.8,map.tile_size*.8);
	 						} else if (map_zone == 8) {
	  							ellipse(map.tile_size*(1.5+tile_xcoor-1),map.tile_size*(1.5+tile_ycoor+1)-offset,map.tile_size*.8,map.tile_size*.8);
	  						} else if (map_zone == 9 && player.ycoor+1+map_radius == map.height) {
	  							ellipse(map.tile_size*(1.5+tile_xcoor),map.tile_size*(1.5+tile_ycoor-1)-offset,map.tile_size*.8,map.tile_size*.8);
	  						} else if (map_zone == 9) {
	  							ellipse(map.tile_size*(1.5+tile_xcoor),map.tile_size*(1.5+tile_ycoor-1)-offset,map.tile_size*.8,map.tile_size*.8);
	  						} else {
	  							ellipse(map.tile_size*(1.5+tile_xcoor-1),map.tile_size*(1.5+tile_ycoor-1)-offset,map.tile_size*.8,map.tile_size*.8);
	  						} 
	  						break;
	  					case "down":
	  						if (map_zone == 2) {
	  							ellipse(map.tile_size*(1.5+tile_xcoor-1),map.tile_size*(1.5+tile_ycoor-1)+offset,map.tile_size*.8,map.tile_size*.8);
	  						} else if (map_zone == 3 && player.ycoor-map_radius-1 == 0) {
	 							ellipse(map.tile_size*(1.5+tile_xcoor-4),map.tile_size*(1.5+tile_ycoor)+offset,map.tile_size*.8,map.tile_size*.8);
	  						} else if (map_zone == 3) {
	  							ellipse(map.tile_size*(1.5+tile_xcoor-4),map.tile_size*(1.5+tile_ycoor)+offset,map.tile_size*.8,map.tile_size*.8);
	  						} else if (map_zone == 6 && player.ycoor+1+map_radius == map.height-1) {
	 							ellipse(map.tile_size*(1.5+tile_xcoor),map.tile_size*(1.5+tile_ycoor)+offset,map.tile_size*.8,map.tile_size*.8);
	  						} else if (map_zone == 6) {
	  							ellipse(map.tile_size*(1.5+tile_xcoor-1),map.tile_size*(1.5+tile_ycoor-1)+offset,map.tile_size*.8,map.tile_size*.8);
	  						} else if (map_zone == 7) {
	 							ellipse(map.tile_size*(1.5+tile_xcoor-1),map.tile_size*(1.5+tile_ycoor+1)+offset,map.tile_size*.8,map.tile_size*.8);
	  						} else if (map_zone == 8) {
	  							ellipse(map.tile_size*(1.5+tile_xcoor-1),map.tile_size*(1.5+tile_ycoor+1)+offset,map.tile_size*.8,map.tile_size*.8);
	  						} else {
	 							ellipse(map.tile_size*(1.5+tile_xcoor-1),map.tile_size*(1.5+tile_ycoor-1)+offset,map.tile_size*.8,map.tile_size*.8);
	  						} 
	  						break;
	  					default:
	  				}
	  			}
	  			
  			}
		}
  	}
}

function edgeCase() {
	if(map_zone == 1) {
		return true;
	}
	if ((map_zone == 2 && (player.direction == "up" || player.direction == "down")) ||
		(player.ycoor-map_radius-1 == 0 && map_zone == 5 && player.direction == "up") ||
		(player.xcoor-map_radius-1 == 0 && map_zone == 2 && player.direction == "right") ||
		(player.xcoor+map_radius+1 == map.width-1 && map_zone == 2 && player.direction == "left")) {
		return true;
	}
	if (map_zone == 3) {
		return true;
	}
	if ((map_zone == 4 && (player.direction == "left" || player.direction == "right")) ||
		(player.xcoor-map_radius-1 == 0 && map_zone == 5 && player.direction == "right") ||
		(player.ycoor-map_radius-1 == 0 && map_zone == 4 && player.direction == "up") ||
		(player.ycoor+map_radius+1 == map.height-1 && map_zone == 4 && player.direction == "down")) {
		return true;
	}
	if ((map_zone == 6 && (player.direction == "left" || player.direction == "right")) ||
		(player.xcoor+map_radius+1 == map.width-1 && map_zone == 5 && player.direction == "left") ||
		(player.ycoor-map_radius-1 == 0 && map_zone == 6 && player.direction == "up") ||
		(player.ycoor+map_radius+1 == map.height-1 && map_zone == 6 && player.direction == "down")) {
		return true;
	}
	if (map_zone == 7) {
		return true;
	}
	if ((map_zone == 8 && (player.direction == "up" || player.direction == "down")) ||
		(player.ycoor+map_radius+1 == map.height-1 && map_zone == 5 && player.direction == "down") ||
		(player.xcoor-map_radius-1 == 0 && map_zone == 8 && player.direction == "right") ||
		(player.xcoor+map_radius+1 == map.width-1 && map_zone == 8 && player.direction == "left")) {
		return true;
	}
	if (map_zone == 9) {
		return true;
	}
	return false;
}

function drawTile(tile, xcoor, ycoor) {
	fill(tile.color);
	rect(tile.size*xcoor, tile.size*ycoor, tile.size, tile.size);
}

function drawTileMotion(tile, index_x, index_y,cursor_x,cursor_y, offset) {
	// Get tile color
	fill(tile.tile_color);

	// Draw rectangle of the proper size at the proper place onscreen
	switch (player.direction) {
		case "left":
			rect(tile.tile_size*(index_x)-offset,tile.tile_size*(index_y),tile.tile_size,tile.tile_size);
			break;
		case "right":
			rect(tile.tile_size*(index_x)+offset,tile.tile_size*(index_y),tile.tile_size,tile.tile_size);
			break;
		case "up":
			rect(tile.tile_size*(index_x),tile.tile_size*(index_y)+offset,tile.tile_size,tile.tile_size);
			break;
		case "down":
			rect(tile.tile_size*(index_x),tile.tile_size*(index_y)-offset,tile.tile_size,tile.tile_size);
			break;
		default:
	}
}

function drawBorder() {
	// Border covers edges of map
	// so that map appears to slide in from each side
	fill(255,255,255);
	noStroke();
	rect(0,40, 80,521);
	rect(521,40, 80,521);
	rect(40,0, 521,80);
	rect(40,521, 521,80);
	stroke();
	line(80,80,80,520);
	line(520,80,520,520);
	line(80,80,520,80);
	line(80,520,520,520);
}

function keyPressed() {
	// Check if controls are enabled
	if (ENABLE_CONTROLS == true) {
		switch(key) {

			// User presses '1'
			case '1':
				//Toggle Debug mode on/off
				if (DEBUG_MODE==false) {
					DEBUG_MODE=true;
				} else {
					DEBUG_MODE=false;
				}
				break;

			// User presses 'w'
			case 'w':
				// Check to make sure player is not already moving
				if(player.moving==0) {
					// Check if the player is allowed to move up 1 tile
					if(userHighlightsPossibleMove(player.xcoor, player.ycoor-1, player.xcoor, player.ycoor-1)) {
						// Move the player up 1 tile
						player.action = 'move';
						movePlayer(player, map, player.xcoor, player.ycoor-1);
					}
				}
				break;
			case 'W':
				// Check to make sure player is not already moving
				if(player.moving==0) {
					// Check if the player is allowed to move up 1 tile
					if(userHighlightsPossibleMove(player.xcoor, player.ycoor-1, player.xcoor, player.ycoor-1)) {
						// Move the player up 1 tile
						player.action = 'move';
						movePlayer(player, map, player.xcoor, player.ycoor-1);
					}
				}
				break;

			// User press 'a'
			case 'a':
				// Check to make sure player is not already moving
				if(player.moving==0) {
					// Check if the player is allowed to move left 1 tile
					if(userHighlightsPossibleMove(player.xcoor-1, player.ycoor, player.xcoor-1, player.ycoor)) {
						// Move the player left 1 tile
						player.action = 'move';
						movePlayer(player, map, player.xcoor-1, player.ycoor);
					}
				}
				break;
			case 'A':
				// Check to make sure player is not already moving
				if(player.moving==0) {
					// Check if the player is allowed to move left 1 tile
					if(userHighlightsPossibleMove(player.xcoor-1, player.ycoor, player.xcoor-1, player.ycoor)) {
						// Move the player left 1 tile
						player.action = 'move';
						movePlayer(player, map, player.xcoor-1, player.ycoor);
					}
				}
				break;

			// User presses 's'
			case 's':
				// Check to make sure player is not already moving
				if(player.moving==0) {
					// Check if the player is allowed to move down 1 tile
					if(userHighlightsPossibleMove(player.xcoor, player.ycoor+1, player.xcoor, player.ycoor+1)) {
						// Move the player down 1 tile
						player.action = 'move';
						movePlayer(player, map, player.xcoor, player.ycoor+1);
					}
				}
				break;
			case 'S':
				// Check to make sure player is not already moving
				if(player.moving==0) {
					// Check if the player is allowed to move down 1 tile
					if(userHighlightsPossibleMove(player.xcoor, player.ycoor+1, player.xcoor, player.ycoor+1)) {
						// Move the player down 1 tile
						player.action = 'move';
						movePlayer(player, map, player.xcoor, player.ycoor+1);
					}
				}
				break;

			// User presses 'd'
			case 'd':
				// Check to make sure player is not already moving
				if(player.moving==0) {
					// Check if the player is allowed to move right 1 tile
					if(userHighlightsPossibleMove(player.xcoor+1, player.ycoor, player.xcoor+1, player.ycoor)) {
						// Move the player right 1 tile
						player.action = 'move';
						movePlayer(player, map, player.xcoor+1, player.ycoor);
					}
				}
				break;
			case 'D':
				// Check to make sure player is not already moving
				if(player.moving==0) {
					// Check if the player is allowed to move right 1 tile
					if(userHighlightsPossibleMove(player.xcoor+1, player.ycoor, player.xcoor+1, player.ycoor)) {
						// Move the player right 1 tile
						player.action = 'move';
						movePlayer(player, map, player.xcoor+1, player.ycoor);
					}
				}
				break;
			default:
				// If any other key was pressed, do nothing
		}
	}
}