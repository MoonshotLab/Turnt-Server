var express   = require('express');
var app       = express();
var server    = require('http').createServer(app);
var routes    = require('./lib/routes');

// setup express
app.use(express.static('public'));
server.listen(process.env.PORT || '3002');

// routes
app.get('/turnt/:id', routes.getTurnt);
app.post('/text-message', routes.newTextMessageReceived);
app.post('/turnt/new', routes.createTurnt);
