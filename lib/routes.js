var validator = require('validator');
var path      = require('path');
var fs        = require('fs');
var db        = require('./db');
var utils     = require('./utils');
var texter    = require('./texter');
var config    = require('../config')();



exports.getTurnt = function(req, res){
  res.render('turnt', {
    guid    : req.params.id,
    s3Path  : 'https://s3.amazonaws.com/' + config.S3_BUCKET
  });
};


// required query params
  // s3Id   : the s3 id connecting the mp4, webm, and poster
  // phone  : a phone number to use as text receiver
  // key    : a special security key
exports.createTurnt = function(req, res){
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
};



exports.newTextMessageReceived = function(req, res){
  var emailAddress  = utils.extractEmailFromString(req.body.Body)[0];
  var phoneNumber   = req.body.From;

  // does it look like a valid e-mail address?
  if(validator.isEmail(emailAddress)){

    // tell twilio we're all good
    res.sendStatus(200);

    db.findRecordByPhoneNumber(phoneNumber).then(function(record){

      // check to see if the file exists, if not download it from S3
      // then e-mail it
      var file = path.join(process.cwd(), 'tmp', record.s3Id + '.mp4');
      fs.stat(file, function(err, stat){
        if(err){
          utils.downloadFilesFromS3(record.s3Id, function(){
            utils.sendEmail(emailAddress, file);
          });
        } else utils.sendEmail(emailAddress, file);
      });

    });

  } else res.sendStatus(403);
};
