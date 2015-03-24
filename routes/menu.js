var express = require('express');
var router = express.Router();

/* preload function to load sprites and images */
// function preload() {}

/* canvas map */
function setup() {
	var map = createCanvas(640, 360);
	map.parent('mapContainer');
}


module.exports = router;