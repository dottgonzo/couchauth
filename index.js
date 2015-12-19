var app = require('express')();
var server = require('http').Server(app);
var rpj = require('request-promise-json');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser'),
var cors = require('cors');
var pathExists= require('path-exists');
var Promise = require('promise');
var nodemailer = require('nodemailer');
var _=require('lodash');
if (!pathExists.sync('./conf.json')){
  throw Error('no configuration founded')
}
var conf=require('./conf.json')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(cookieParser())
app.use(cors());


var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: conf.mail.user,
    pass: conf.mail.password
  }
});



function db_name(kind,data){
  switch(kind){
    case 'member':
return 'mem_'+uid(3)+'_'+data.app_id+'_'+data.username;

    break

    case 'machine':

    return 'mach_'+uid(6)+'_'+data.app_id;

    break


  }
}





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






server.listen(conf.port);
