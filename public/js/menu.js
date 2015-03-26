var canvas;
var attacker;
var defender;
var attendees = [];
var jewels = [];

var stolenGoods; // total value of jewels stolen for attacker

/* determines which game the player chose */
var game1;
var game2;
var game3;

var gameStarted;

function preload() {
	// images and map tiles go here
}

function setup() {
	canvas = createCanvas(800, 800);
	canvas.parent('gameContainer');

	gameStarted = false; // default value is false;
}

function draw() {
	// draw map here
	background(51);


}