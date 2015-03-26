var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

// mongojs = require('mongojs');
var bodyParser = require('body-parser');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(app.router);

app.get('/', function(req, res) {
	res.redirect('/index.html');
});

io.sockets.on('connection', function(client) {
    console.log('\t socket.io:: player ' + client.id + ' connected');

    /* When the client disconnects */
    client.on('disconnect', function() {
        console.log('\t socket.io:: client disconnected: ' + client.id);
    });
});

server.listen(3000);