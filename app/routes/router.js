var User = exports.User = require('../model/user'),
    RequestStore = exports.RequestStore = require('../../lib/requestSchema'),
    EmailServer = exports.EmailServer = require('../../lib/emailserver'),
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
      /*if (e) {
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
      }*/
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

exports.countUsers = function countUsers (req, res) {
  var sitesArray = [];
  var fullRange = [];
  var countedByDate = [];

  for (var i = 0; i <= 30; i++) {
    var d = new Date();
    d.setDate(d.getDate() - i);
    countedByDate.push({
      date: d,
      allUsers: [],
      allAttackers: [],
      countedUsers: {},
      countedAttackers: {},
      totalUsers: 0,
      totalAttackers: 0,
      requests: 0,
      attacks: 0
    });
  }

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

  RequestStore.find({'headers.host': { $in : sitesArray }, 'requestedtimestamp' : { $gte : start, $lt : end } }, 'remoteIP attack requestedtimestamp -_id', function(err, docs) {
    if(!err) fullRange = docs;
    else sys.log(err);

    for (var y in countedByDate) {
      if (countedByDate.hasOwnProperty(y)) {
        for (var x in fullRange) {
          if (fullRange.hasOwnProperty(x)) {
            var sortDate = new Date(countedByDate[y].date.getYear(), countedByDate[y].date.getMonth(), countedByDate[y].date.getDate());
            var rangeDate = new Date(fullRange[x].requestedtimestamp.getYear(), fullRange[x].requestedtimestamp.getMonth(), fullRange[x].requestedtimestamp.getDate());

            if (rangeDate.getYear() == sortDate.getYear() && rangeDate.getMonth() == sortDate.getMonth() && rangeDate.getDate() == sortDate.getDate()) {
              countedByDate[y].allUsers.push(fullRange[x].remoteIP);
              countedByDate[y].requests += 1;
              if (fullRange[x].attack === "true") {
                countedByDate[y].allAttackers.push(fullRange[x].remoteIP);
                countedByDate[y].attacks += 1;
              }
            }
          }
        }
        countedByDate[y].countedUsers = countValues(countedByDate[y].allUsers);
        countedByDate[y].allUsers = [];
        countedByDate[y].countedAttackers = countValues(countedByDate[y].allAttackers);
        countedByDate[y].allAttackers = [];
        countedByDate[y].totalUsers = Object.keys(countedByDate[y].countedUsers).length;
        countedByDate[y].totalAttackers = Object.keys(countedByDate[y].countedAttackers).length;
      }
    }

    var monthly = {
      allMonthlyUsers: [],
      allMonthlyAttackers: [],
      countedMonthlyUsers: [],
      countedMonthlyAttackers: [],
      totalMonthlyUsers: 0,
      totalMonthlyAttackers: 0,
      monthlyRequests: 0,
      monthlyAttacks: 0
    };

    //loop through entire month of requests and pull all the IPs and count total requests & attacks
    for (x in fullRange) {
      if (fullRange.hasOwnProperty(x)) {
        monthly.allMonthlyUsers.push(fullRange[x].remoteIP);
        monthly.monthlyRequests += 1;
        if (fullRange[x].attack === "true") {
          monthly.allMonthlyAttackers.push(fullRange[x].remoteIP);
          monthly.monthlyAttacks += 1;
        }
      }
    }

    //count the unique IPs and zero out the long list total arrays before pass back
    //monthly counts will always be last object in the countedByDate array
    monthly.countedMonthlyUsers = countValues(monthly.allMonthlyUsers);
    monthly.allMonthlyUsers = [];
    monthly.countedMonthlyAttackers = countValues(monthly.allMonthlyAttackers);
    monthly.allMonthlyAttackers = [];
    monthly.totalMonthlyUsers = Object.keys(monthly.countedMonthlyUsers).length;
    monthly.totalMonthlyAttackers = Object.keys(monthly.countedMonthlyAttackers).length;
    countedByDate.push(monthly);

    res.send(countedByDate);
  });
};
