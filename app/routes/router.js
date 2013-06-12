var User = exports.User = require('../model/user'),
    RequestStore = exports.RequestStore = require('../../lib/requestSchema'),
    EmailServer = exports.EmailServer = require('../../lib/emailserver');

exports.loginpage = function loginpage (req, res) {
  res.sendfile('./public/html/login.html');
}


exports.login = function authenticate (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var respond = function respond (err, user, reason) {
    if (user !==null){
      req.session.user = user;
      req.session.user_id = user.id;
      //res.sendfile('./routes/html/dashboard.html');
      res.redirect('/home');
    } else {
      req.session.user = {'reason':reason, 'error':err};
      res.redirect('/login');
    }
  }
  User.getAuthenticated(username, password, respond);
}

exports.signuppage = function signuppage (req, res) {
  res.sendfile('./public/html/register.html');
}

exports.signup = function addAccount (req, res) {
  var newAccountData = {
        name : req.body.name,
        email : req.body.email,
        user : req.body.user,
        pass : req.body.pass1,
        sites : req.body.sites
      };
  if (req.body.pass1 != req.body.pass2) {
    res.redirect('/signup');
  } else if (newAccountData.name && newAccountData.email && newAccountData.user && newAccountData.pass && newAccountData.sites){
    User.addNewAccount(newAccountData, function(e, o){
      if(e){
        res.send(e, 400);
      } else{
        EmailServer.send({
          text: 'Registration: Name - ' + newAccountData.name + ', Email - ' + newAccountData.email + ', User - ' + newAccountData.user + ', Sites - ' + newAccountData.sites,
          from: 'Admin <vicet3ch@gmail.com>',
          to: 'Matt <mattjay01@gmail.com>',// Zach <ProZachJ@gmail.com>',
          subject: 'Registration ' + newAccountData.name + ', ' + newAccountData.user
        }, function(err, message) { console.log(err || message); });
        res.redirect('/login');
      }
    });
  } else {
    res.send('Please provide all information');
  }
}

exports.home = function homePage (req, res) {
  res.sendfile('./routes/html/dashboard.html');
}

exports.domains = function getDomains(req, res){
  res.send(req.session.user.sites);
}

exports.domains.info = function getDomainData (req, res){
   var domainName = req.body.name;
   var respond = function (err, docs){
     res.send(docs);
   }
   RequestStore.find({'headers.host': domainName}, respond);
}

exports.domains.attacks = function getDomainAttacks(req, res){
   var domainName = req.body.name;
   var respond = function (err, docs) {
     res.send(docs);
   }
   RequestStore.find({'headers.host': domainName, 'attack': 'true'},respond);
}
