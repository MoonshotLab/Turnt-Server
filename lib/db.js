var config      = require('../config')();
var MongoClient = require('mongodb').MongoClient;
var database    = null;


MongoClient.connect(config.DB_CONNECT, function(err, db){
  if(err) console.log('error connecting to db...', err);
  else console.log('connected to db...');

  database = db;
});


// s3Id   : the s3 id connecting the mp4, webm, and
// phone  : a phone number to use as text receiver
exports.remember = function(data){
  var collection = database.collection('turnts');

  return new Promise(function(resolve, reject){
    collection.insert(data, function(err, res){
      console.log(err, res);
      if(err) reject(err);
      else resolve(config.ROOT_URL + '/' + data.s3Id);
    });
  });
};
