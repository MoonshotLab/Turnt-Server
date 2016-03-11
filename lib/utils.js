var config    = require('../config')();
var path      = require('path');
var fs        = require('fs');
var async     = require('async');
var https     = require('https');
var mailgun   = require('mailgun-js')({
  apiKey  : config.MAILGUN_KEY,
  domain  : config.MAILGUN_DOMAIN
});

// sends an email from mailgun
exports.sendEmail = function(emailAddress, filePath){
  var email = {
    from        : '<take5@' + config.MAILGUN_DOMAIN + '>',
    to          : emailAddress,
    subject     : '#myTAKE5',
    text        : 'You asked. We delivered. Here\'s your remix video. Show off your swagger. Share using #myTAKE5.',
    attachment  : filePath
  };

  console.log('sending email', email);

  mailgun.messages().send(email, function(err, body){
    if(err) console.log(err);
    else {
      console.log('sent an email to', email);
    }
  });
};


// downloads the files from amazon and sdtuffs them in the tmp directory
exports.downloadFilesFromS3 = function(s3Id, next){
  console.log('downloading file from S3', s3Id);
  var outPath = path.join(process.cwd(), 'tmp');
  var outFile = fs.createWriteStream(path.join(outPath, s3Id + '.mp4'));
  var url     = 'https://s3.amazonaws.com/' + config.S3_BUCKET + '/' + s3Id + '.mp4';
  var request = https.get(url, function(response){
    response.pipe(outFile);
    setTimeout(next, 2000);
  });
};


// accepts any kind of string and pulls e-mail addresses out of it
exports.extractEmailFromString = function(message){
  if(message)
    return message.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
  else return [];
};
