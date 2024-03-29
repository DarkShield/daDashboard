var express = require('express');
var mongoose = require('mongoose');
var LoginToken = require('./model/token');
var User = require('./model/user');
var helmet = require('helmet');

var app = express();
var Routes = require('./routes/router');

//middleware order matters
app.use(express.compress());
app.use(helmet.frameguard());
app.use(helmet.xssFilter());
app.use(helmet.hidePoweredBy());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/../bower_components'));
app.use(express.bodyParser());
app.use(express.cookieParser());
//app.use(express.cookieSession({key: 'sess', secret: 'SuperSecret'}));
app.use(express.session({ secret: 'SuperSecretKeyForNow' }));

//functions
//TODO: Should these go elsewhere?
function authenticateFromLoginToken(req, res, next){
  var cookie = JSON.parse(req.cookies.logintoken);
  
  LoginToken.findOne({ email: cookie.email,
                       series: cookie.series,
                       token: cookie.token }, (function(err, token) {
    if (!token) {
      res.redirect('/login');
      return;
    }

    User.findOne({ user: token.email }, function(err, user) {
      if (user) {
        req.session.user_id = user.id;
        req.currentUser = user;

        token.token = token.randomToken();
        token.save(function() {
          res.cookie('logintoken', token.cookieValue, { expires: new Date(Date.now() + 2 * 604800000), path: '/' });
          next();
        });
      } else {
        res.redirect('/login');
      }
    });
  }));
}

function loadUser(req, res, next) {
  if (req.session.user_id) {
    User.findById(req.session.user_id, function(err, user) {
      if (user) {
        req.currentUser = user;
        next();
      } else {
        res.redirect('/login');
      }
    });
  } else if (req.cookies.logintoken) {
    authenticateFromLoginToken(req, res, next);
  } else {
    res.redirect('/login');
  }
}

//routes
app.get('/domains', loadUser, Routes.domains);
app.get('/login', Routes.loginpage);
app.get('/signup', Routes.signuppage);
app.get('/', loadUser, Routes.home);
app.get('/logout', loadUser, Routes.logout);

app.post('/signup', Routes.signup);
app.post('/login', Routes.login);
app.post('/domains/info', loadUser, Routes.domains.info);
app.post('/domains/attacks', loadUser, Routes.domains.attacks);
app.post('/domains/info/lastday', loadUser, Routes.domains.info.lastday);
app.post('/traffic', loadUser, Routes.traffic);
app.post('/traffic/request-details', loadUser, Routes.requestDetails);
app.post('/toggle/attack', loadUser, Routes.toggleAttack);
app.post('/toggle/block', loadUser, Routes.toggleBlock);

app.use(function(req, res){
  res.status(404).sendfile('./app/public/html/404.html');;
});
module.exports = app;
