var User = exports.User = require('../model/user'),
    RequestStore = exports.RequestStore = require('../model/requestSchema'),
    EmailServer = exports.EmailServer = require('../lib/emailserver'),
    Host = exports.Host = require('../model/hostSchema'),
    ObjectId = require('mongoose').Types.ObjectId,
    sys = require('sys');

exports.loginpage = function loginpage(req, res) {
  res.sendfile('./app/public/html/login.html');
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
  res.sendfile('./app/public/html/register.html');
};

exports.signup = function addAccount(req, res) {
  var newAccountData = exports.buildAccountObj(req);
  if (req.body.pass1 != req.body.pass2) {
    res.redirect('/signup');
  }
  else if (newAccountData.name && newAccountData.email && newAccountData.user && newAccountData.pass && newAccountData.sites) {
    User.addNewAccount(newAccountData, function (e) {
      if (e) {
        sys.log(e);
        res.send('Could not create user, please retry.', 400);
      } else {
        EmailServer.send({
          text: 'Registration: Name - ' + newAccountData.name + ', Email - ' + newAccountData.email + ', User - ' + newAccountData.user + ', Sites - ' + JSON.stringify(newAccountData.sites),
          from: 'Admin <vicet3ch@gmail.com>',
          to: 'Matt <matt@darkshield.io>, Zach <zach@darkshield.io>',
          subject: 'Registration ' + newAccountData.name + ', ' + newAccountData.user
        }, function (err, message) {
          sys.log(err || message);
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
  res.sendfile('./app/routes/html/dashboard.html');
};

exports.domains = function getDomains(req, res) {
  res.send(req.session.user.sites);
};

exports.domains.info = function getDomainData (req, res){
  var domainName = req.body.name;
  var authorized = false;
  var respond = function (err, docs){
    res.send(JSON.stringify(docs));
  };

  //make sure hostname is owned by user
  req.session.user.sites.forEach(function(site){
    if(site.name === req.body.name){
      authorized = true;
      RequestStore.find({'headers.host': domainName}, {'body' : 0}, respond);
    }
  });
  if(!authorized){
    var err = 'Not authorized for host ' + req.session.user._id;
    respond(err);
  }
};

exports.domains.attacks = function getDomainAttacks(req, res){
   var domainName = req.body.name;
   var respond = function (err, docs) {
     res.send(JSON.stringify(docs));
   };
   RequestStore.find({'headers.host': domainName, 'attack': 'true'},respond);
};

exports.domains.info.lastday = function getLastDay (req, res) {
  var domainName = req.body.name;
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  var yesterdayISO = yesterday.toISOString();
  var respond = function (err, docs) {
    res.send(JSON.stringify(docs));
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
    docs.forEach(function(value){
      value.headers = {host: value.headers.host};
      value.body = '';
    });
    res.send(JSON.stringify(docs));
  };

  RequestStore.find({'headers.host': { $in : sitesArray }, 'requestedtimestamp' : { $gte : new Date(req.body.start), $lt : new Date(req.body.end) } }, respond);
};
exports.requestDetails = function (req, res) {

  var respond = function (err, doc) {
    console.log(err,doc);
    res.send(JSON.stringify(doc));
  };
  console.log(req.body.id);
  RequestStore.findById(req.body.id, respond);
};

exports.toggleAttack = function toggleAttack (req, res) {
  var respond = function (err, numUpdated) {
    if(err){
      console.log(err);
      res.send(500);
    }
    console.log(numUpdated);
    res.send(200);
  };
  var text = (req.body.attack === 'true') ? 'Missed Attack' : 'False Positive';
  req.body.attack = (req.body.attack === "false")
  RequestStore.update({'_id': new ObjectId(req.body.id)}, {'attack': req.body.attack}, respond);
  EmailServer.send({
    text: text + ' - ' + req.body.id,
    from: 'Admin <vicet3ch@gmail.com>',
    to: 'Matt <matt@darkshield.io>, Zach <zach@darkshield.io>',
    subject: text
  }, function (err, message) {
    console.log(err || message);
  });
};

//currently is only a block route need to add unblocking
exports.toggleBlock = function toggleBlock (req, res) {
  var respond = function(err, doc, numaffected){
    if(numaffected){
      res.send({blocked: true});
    }else{
      console.log(err);
      res.send({blocked: false});
    }
  };
  //needs validation
  var ip = req.body.ip
  var hostname = req.body.host.replace(/\./g, "");
  var authorized = false;

  //make sure hostname is owned by user
  req.session.user.sites.forEach(function(site){
    if(site.name === req.body.host){
      authorized = true;
      Host.blockHostIP(hostname, ip, respond);
    }
  });
  if(!authorized){
    var err = 'Not authorized to modify blacklist for host ' + req.session.user._id;
    respond(err);
  }
};


exports.buildAccountObj = function (req) {
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

/* exports.countCookies = function countCookies (req, res) {
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
 */
