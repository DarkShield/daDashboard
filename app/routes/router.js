var User = require('../model/user'),
    RequestStore = require('../../lib/requestSchema');

exports.loginpage = function loginpage (req, res) {
  res.sendfile('./public/html/login.html');
}


exports.login = function authenticate (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var respond = function (err, user, reason) {
    if (user !==null){
      req.session.user = user;
      res.sendfile('./routes/html/dashboard.html');
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
        name : req.param('name'),
        email : req.param('email'),
        user : req.param('user'),
        pass : req.param('pass1'),
        sites : req.param('sites')
      };
  if (req.param('pass1') != req.param('pass2')) {
    res.redirect('/signup');
  } else if (newAccountData.name && newAccountData.email && newAccountData.user && newAccountData.pass && newAccountData.sites){
    User.addNewAccount(newAccountData, function(e){
      if(e){
        res.send(e, 400);
      } else{
        res.redirect('/login');
      }
    });
  } else {
    res.send('Please provide all information');
  }
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
