var path      = require('path');
var fs        = require('fs');
var async     = require('async');
var https     = require('https');
var config    = require('../config')();


// sends an email from mailgun
exports.sendEmail = function(emailAddress, filePath){

};


// downloads the files from amazon and sdtuffs them in the tmp directory
exports.downloadFilesFromS3 = function(s3Id, next){
  var outPath = path.join(process.cwd(), 'tmp');
  var outFile = fs.createWriteStream(path.join(outPath, s3Id + '.mp4'));
  var url     = 'https://s3.amazonaws.com/' + config.S3_BUCKET + '/' + s3Id + '.mp4';
  var request = https.get(url, function(response){
    response.pipe(outFile);
    next();
  });
};


// accepts any kind of string and pulls e-mail addresses out of it
exports.extractEmailFromString = function(message){
  if(message)
    return message.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
  else return [];
};
