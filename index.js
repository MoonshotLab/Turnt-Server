var express   = require('express');
var path      = require('path');
var bodyParser= require('body-parser');
var app       = express();
var server    = require('http').createServer(app);
var routes    = require('./lib/routes');

// setup express
app.use(express.static('public'));
server.listen(process.env.PORT || '3002');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'jade');

// routes
app.get('/', routes.redirect);
app.get('/t/:id', routes.getTurnt);
app.post('/text-message', routes.newTextMessageReceived);
app.post('/turnt/new', routes.createTurnt);
