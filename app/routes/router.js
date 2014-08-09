var User = exports.User = require('../model/user'),
  RequestStore = exports.RequestStore = require('../../lib/requestSchema'),
  EmailServer = exports.EmailServer = require('../../lib/emailserver'),
  Host = exports.Host = require('../../lib/hostSchema'),
  ObjectId = require('mongoose').Types.ObjectId;
var sys = require('sys');

exports.loginpage = function loginpage(req, res) {
  res.sendfile('./public/html/login.html');
};


exports.login = function authenticate(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var respond = function respond(err, user, reason) {
    if (user !== null) {
      req.session.user = user;
      req.session.user_id = user.id;
      res.redirect('/');
    } else {
      req.session.user = {'reason': reason, 'error': err};
      res.redirect('/login');
    }
  };
  User.getAuthenticated(username, password, respond);
};

exports.signuppage = function signuppage(req, res) {
  res.sendfile('./public/html/register.html');
};

var buildAccountObj = function (req) {
  //var sitesArray = [];
  var tmpObj = {};
  var newAccountData = {
    name: req.body.name,
    email: req.body.email,
    user: req.body.user,
    pass: req.body.pass1,
    sites: []
  };

  if (req.body.sites.split(', ')) {
    var splitArray = req.body.sites.split(', ');
    for (var i = 0; i < splitArray.length; i++) {
      tmpObj = {'name': splitArray[i]};
      newAccountData.sites.push(tmpObj);
    }
  }
  else {
    tmpObj = {'name': req.body.sites};
    newAccountData.sites.push(tmpObj);
  }
  return newAccountData;
};
module.exports.buildAccountObj = buildAccountObj;

exports.signup = function addAccount(req, res) {
  var newAccountData = buildAccountObj(req);
  if (req.body.pass1 != req.body.pass2) {
    res.redirect('/signup');
  }
  else if (newAccountData.name && newAccountData.email && newAccountData.user && newAccountData.pass && newAccountData.sites) {
    User.addNewAccount(newAccountData, function (e) {
      if (e) {
        res.send(e, 400);
      } else {
        EmailServer.send({
          text: 'Registration: Name - ' + newAccountData.name + ', Email - ' + newAccountData.email + ', User - ' + newAccountData.user + ', Sites - ' + JSON.stringify(newAccountData.sites),
          from: 'Admin <vicet3ch@gmail.com>',
          to: 'Matt <matt@darkshield.io>, Zach <zach@darkshield.io>',
          subject: 'Registration ' + newAccountData.name + ', ' + newAccountData.user
        }, function (err, message) {
          console.log(err || message);
        });
        res.redirect('/login');
      }
    });
  }
  else {
    res.send('Please provide all information');
  }
};

exports.logout = function logout(req, res){
  req.session.destroy();
  res.redirect('/login');
};

exports.home = function homePage(req, res) {
  res.sendfile('./routes/html/dashboard.html');
};

exports.domains = function getDomains(req, res) {
  res.send(req.session.user.sites);
};

exports.domains.info = function getDomainData (req, res){
   var domainName = req.body.name;
   var respond = function (err, docs){
     res.send(docs);
   };
   RequestStore.find({'headers.host': domainName}, {'body' : 0}, respond);
};

exports.domains.attacks = function getDomainAttacks(req, res){
   var domainName = req.body.name;
   var respond = function (err, docs) {
     res.send(docs);
   };
   RequestStore.find({'headers.host': domainName, 'attack': 'true'},respond);
};

exports.domains.info.lastday = function getLastDay (req, res) {
  var domainName = req.body.name;
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  var yesterdayISO = yesterday.toISOString();
  var respond = function (err, docs) {
    res.send(docs);
  };
  RequestStore.find({'headers.host': domainName, 'requestedtimestamp': {$gte: yesterdayISO}}, {'body': 0}, respond);
};

exports.traffic = function getRange (req, res) {
  var sitesArray = [];
  for (var site in req.session.user.sites) {
    if (req.session.user.sites.hasOwnProperty(site)) {
      var name = req.session.user.sites[site].name;
      sitesArray.push(name);
    }
    else console.log('doesnt have prop');
  }
  var respond = function (err, docs) {
    res.send(docs);
  };

  RequestStore.find({'headers.host': { $in : sitesArray }, 'requestedtimestamp' : { $gte : new Date(req.body.start), $lt : new Date(req.body.end) } }, respond);
};

exports.toggleAttack = function toggleAttack (req, res) {
  var respond = function (err, docs) {
    if (!err) res.send(docs);
    else res.send(err);
  };
  if (req.body.attack === 'false') {
    EmailServer.send({
      text: 'Missed Attack - ' + req.body.id,
      from: 'Admin <vicet3ch@gmail.com>',
      to: 'Matt <matt@darkshield.io>, Zach <zach@darkshield.io>',
      subject: 'Missed Attack'
    }, function (err, message) {
      console.log(err || message);
    });
    RequestStore.update({'_id': new ObjectId(req.body.id)}, {'attack': 'true'}, respond);
  }
  else if (req.body.attack === 'true') {
    EmailServer.send({
      text: 'False Positive - ' + req.body.id,
      from: 'Admin <vicet3ch@gmail.com>',
      to: 'Matt <matt@darkshield.io>, Zach <zach@darkshield.io>',
      subject: 'False Positive'
    }, function (err, message) {
      console.log(err || message);
    });
    RequestStore.update({'_id': new ObjectId(req.body.id)}, {'attack': 'false'}, respond);
  }
};

exports.toggleBlock = function toggleBlock (req, res) {
  var respond = function (err, docs) {
    if (!err) res.send(docs);
    else res.send(err);

    var allowed, blocked = false;
    var host = req.body.host.replace(/\./g, "");
    for (var i = 0; i <= req.session.sites.length; i++) {
      if(req.session.sites[i] === host) {
        allowed = true;
      }
    }

    if(allowed) {
      if (req.body.blocked === false) {
        Host.findOne({hostname: host}, function(err, doc) {
          for(var x = 0; x <= doc.blacklist.length; x++) {
            if (doc.blacklist[x].ip === req.body.ip) {
              blocked = true;
            }
          }
          if (blocked) {
            res.send('all ready blocked', 400);
          }
          else {
            Host.update({hostname: host}, {$push: {blacklist: {ip: req.body.ip, time: 1000} }})
          }
        });
      }
      else {
        Host.findOne({hostname: host}, function(err, doc) {
          for (var y = 0; y <= doc.blacklist.length; y++) {
            if(doc.blacklist[y].ip === req.body.ip) {
              blocked = true;
            }
          }
          if(blocked) {

          }
        })
      }
    }

  };
};

exports.countCookies = function countCookies (req, res) {
  var sitesArray = [];
  var fullRange = [];
  var counted = [];
  var countValues = function (array) {
    var obj = {}, i = array.length, j;
    while( i-- ) {
      j = obj[array[i]];
      obj[array[i]] = j ? j+1 : 1;
    }
    return obj;
  };

  for (var site in req.session.user.sites) {
    if (req.session.user.sites.hasOwnProperty(site)) {
      var name = req.session.user.sites[site].name;
      sitesArray.push(name);
    }
    else sys.log('doesnt have prop');
  }

  var start = new Date(req.body.start);
  var end = new Date(req.body.end);

  RequestStore.distinct('remoteIP', {'headers.host': { $in : sitesArray }, 'requestedtimestamp' : { $gte : start, $lt : end } }, function(err, docs) {
    if(!err) {
      for (var doc in docs) {
        if (docs.hasOwnProperty(doc)) {
          counted.push({ip: docs[doc], cookies: [], counts: {}})
        }
      }
    }
    else sys.log(err);

    RequestStore.find({'headers.host': { $in : sitesArray }, 'requestedtimestamp' : { $gte : new Date(req.body.start), $lt : new Date(req.body.end) } }, 'remoteIP attack dstc requestedtimestamp -_id', function(err, docs) {
      if(!err) fullRange = docs;
      else sys.log(err);

      for (var ip in counted) {
        if (counted.hasOwnProperty(ip)) {
          for (var x in fullRange) {
            if (fullRange.hasOwnProperty(x)) {
              if (counted[ip].ip == fullRange[x].remoteIP) {
                counted[ip].cookies.push(fullRange[x].dstc);
              }
            }
          }
          counted[ip].counts = countValues(counted[ip].cookies)
        }
      }
      res.send(counted)
    });
  });
};
