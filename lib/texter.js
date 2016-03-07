var config = require('../config')();
var twilio = require('twilio')(config.TWILIO_SID, config.TWILIO_TOKEN);

// phone  : 181655512345
// url    : http://joelongstreet.com

exports.sendURL = function(data){
  var message = [
    'Nice moves. Here\'s your REMIX BOOTH video:',
    data.url,
    'Want a copy emailed to you? Reply with your email address.'
  ].join(' ');

  twilio.messages.create({
    body  : message,
    from  : config.TWILIO_NUMBER,
    to    : data.phone
  }, function(err, message){
    if(err) console.log(err);
    else console.log('Sent SMS to', data.phone);
  });
};
