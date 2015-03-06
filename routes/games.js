var express = require('express');
var router = express.Router();

router.get('/game1', function(req, res) {
	res.render('game1', {title: 'Game 1'});
});

module.exports = router;
