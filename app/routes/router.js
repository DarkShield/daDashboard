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
