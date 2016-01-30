
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: conf.mail.user,
    pass: conf.mail.password
  }
});


function registerMail(to,code){
  var mailOptions = {
    from: config.mail.senderAddr, // 'Fred Foo ✔ <foo@blurdybloop.com>' sender address
    to: to, // list of receivers
    subject: 'Confirmation email from site ✔', // Subject line
    text: 'This is your confirmation link '+config.host.url+'/confirm?code='+code, // plaintext body
    html: '<b>Hello world ✔</b> This is your confirmation link '+config.host.url+'/confirm?code='+code // html body
  };

  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);

  });


};


function recoverMail(to){
  var mailOptions = {
    from: config.mail.senderAddr, // 'Fred Foo ✔ <foo@blurdybloop.com>' sender address
    to: to, // list of receivers
    subject: 'Confirmation email from site ✔', // Subject line
    text: 'Hello world ✔', // plaintext body
    html: '<b>Hello world ✔</b>' // html body
  };

  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);

  });


};

function notifyMail(to,subj,txt,from){
  var mailOptions = {
    from: config.mail.senderAddr, // 'Fred Foo ✔ <foo@blurdybloop.com>' sender address
    to: to, // list of receivers
    subject: 'Confirmation email from site ✔', // Subject line
    text: 'Hello world ✔', // plaintext body
    html: '<b>Hello world ✔</b>' // html body
  };

  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);

  });


};
