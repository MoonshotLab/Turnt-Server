var express   = require('express');
var app       = express();
var server    = require('http').createServer(app);
var config    = require('./config')();
var db        = require('./lib/db');
var texter    = require('./lib/texter');

// setup express
app.use(express.static('public'));
server.listen(process.env.PORT || '3002');

app.get('/turnt/:id', function(req, res){
  res.send({ id : req.params.id });
});

// required query params
  // s3Id   : the s3 id connecting the mp4, webm, and poster
  // phone  : a phone number to use as text receiver
  // key    : a special security key
app.post('/turnt/new', function(req, res){
  if(req.query.key == config.TURNT_KEY){
    db.remember({
      phone : req.query.phone,
      s3Id  : req.query.s3Id
    }).then(function(){
      res.sendStatus(200);
      texter.sendURL({
        phone : req.query.phone,
        url   : config.ROOT_URL + '/turnt/' + req.query.s3Id
      });
    });
  }
});
