var express = require('express')
    , http = require('http');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/menu');

var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);
io.set = ('close timeoute', 3000);
UUID = require('node-uuid');

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

/* Express server set up */
console.log("Express server listening on port " + 3000);
/*
io.sockets.on('connection', function(client) {
    client.userid = UUID();

    /* Once a player is connected, assign them their id
    client.emit('onconnected', {id: client.userid});
    console.log('\t socket.io:: player ' + client.userid + ' connected');

    /* When the client disconnects
    client.on('disconnect', function() {
        console.log('\t socket.io:: client disconnected ' + client.userid);
    });
});
*/

module.exports = app;