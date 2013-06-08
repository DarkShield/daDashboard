var User = exports.User = require('../model/user'),
    RequestStore = exports.RequestStore = require('../../lib/requestSchema');

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
