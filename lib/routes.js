var validator = require('validator');
var path      = require('path');
var fs        = require('fs');
var db        = require('./db');
var utils     = require('./utils');
var texter    = require('./texter');
var config    = require('../config')();



exports.redirect = function(req, res){
  res.redirect('http://take5.tumblr.com/');
};



exports.getTurnt = function(req, res){
  res.render('turnt', {
    rootUrl : config.ROOT_URL,
    guid    : req.params.id,
    s3Path  : 'https://s3.amazonaws.com/' + config.S3_BUCKET
  });
};


// required query params
  // s3Id   : the s3 id connecting the mp4, webm, and poster
  // phone  : a phone number to use as text receiver
  // key    : a special security key
exports.createTurnt = function(req, res){
  console.log('received turnt, making record for', req.query.phone, 'at', req.query.s3Id);
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
  console.log('received a text-message request for e-mail');

  var emailAddresses = utils.extractEmailFromString(req.body.Body);

  // does it look like a valid e-mail address?
  if(emailAddresses){
    var emailAddress = emailAddresses[0];
    if(validator.isEmail(emailAddress)){

      var phoneNumber = req.body.From.replace('+', '');

      db.findRecordByPhoneNumber(phoneNumber).then(function(record){
        // check to see if the file exists, if not download it from S3
        // then e-mail it
        if(record){
          var file = path.join(process.cwd(), 'tmp', record.s3Id + '.mp4');
          fs.stat(file, function(err, stat){
            console.log('found record, downloading and e-mailing to', emailAddress);
            if(err){
              utils.downloadFilesFromS3(record.s3Id, function(){
                utils.sendEmail(emailAddress, file);
              });
            } else utils.sendEmail(emailAddress, file);
          });
        } else {
          console.log('could not find a matching record for phone number:', phoneNumber);
        }

      }).catch(console.log);
    }
  }
};
