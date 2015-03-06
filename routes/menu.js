var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('menu', { title: 'InSecurity' });
});

router.get('/game1', function(req, res) {
	res.render('game1', {title: 'Game 1'});
});

module.exports = router;
