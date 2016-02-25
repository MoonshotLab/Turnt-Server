var validator = require('validator');
var path      = require('path');
var fs        = require('fs');
var db        = require('./lib/db');
var utils     = require('./lib/utils');



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
