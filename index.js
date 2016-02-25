var express   = require('express');
var app       = express();
var server    = require('http').createServer(app);

app.use(express.static('public'));
server.listen(process.env.PORT || '3002');

app.get('/turnt/:id', function(req, res){
  res.send({ id : req.params.id });
});

app.post('/turnt/new', function(req, res){
  res.send('cool!');
});
