var routes = require('../app/routes/router');
var mongoose = require('mongoose');

mongoose.connect('localhost', 'vicetest', function(err){
  if (err) throw err;
  console.log('Successfully connected to mongo');
});

describe('routes', function(){
  
  it('should be an object',function(){
    expect(typeof(routes)).toBe('object');
  });
  
  //nested describe for loginpage tests
  describe('loginpage route', function(){

    it('should have a loginpage property that references a method named loginpage', function(){
      expect(typeof(routes.loginpage)).toBe('function');
      expect(routes.loginpage.name).toBe('loginpage');
    });

    it('should call sendFile with argument "./public/html/login.html"', function(){
      var req = {};
      var res = {
            sendfile: function(req, res){}
          };
      spyOn(res, 'sendfile');
      routes.loginpage(req, res);
      expect(res.sendfile).toHaveBeenCalled();
      expect(res.sendfile).toHaveBeenCalledWith('./public/html/login.html');
    }); 
  });

  //nested describe for login route tests
  describe('login route', function(){
  
    it('should have a login property that references a method named authenticate', function(){
      expect(typeof(routes.login)).toBe('function');
      expect(routes.login.name).toBe('authenticate');
    });

    it('should call sendfile with argument "./routes/html/dashboard.html" when username and password are valid', function(){
      var req = {
            body: { username: 'mattjay', password: 'mattjay' },
            session: { user: null }
          };
      var res = {
            sendfile: function(req, res){},
            redirect: function(req, res){}
          };
      spyOn(res, 'sendfile', 'redirect');
      runs(function(){
        routes.login(req, res);
      });

      waitsFor(function() {
        return req.session.user;
      }, 'User should be set', 750);

      runs(function() {
        expect(res.sendfile).toHaveBeenCalled();
        expect(res.sendfile).toHaveBeenCalledWith('./routes/html/dashboard.html');
      });
    });

    it('should call redirect with argument "./login" when user name and password are invalid', function(){
      var req = {
            body: { username: 'INVALID', password: 'INVALID' },
            session: { user: null }
          };
      var res = {
            sendfile: function(req, res){},
            redirect: function(req, res){}
          };
      spyOn(res, 'sendfile');
      spyOn(res, 'redirect');
      runs(function(){
        routes.login(req, res);
      });

      waitsFor(function() {
        return req.session.user;
      }, 'User should be set', 750);

      runs(function() {
        expect(res.redirect).toHaveBeenCalled();
        expect(res.redirect).toHaveBeenCalledWith('/login');
      });

    });
  });

  //nested describe for domain route
  describe('domain route', function(){

    it('should have a domains property that references a method named getDomains', function(){
      expect(typeof(routes.domains)).toBe('function');
      expect(routes.domains.name).toBe('getDomains');
    });

    it('should call send with argument "req.session.user.sites"', function(){
      var req = {
            session: { user: {} }
          };
      var res = {
            send: function(req, res){}
          };
      spyOn(res, 'send');
      routes.domains(req, res);
      expect(res.send).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith(req.session.user.sites);
    });
  });

  //nested describe for domain.info route
  describe('domains.info route', function(){

    it('should have a domains.info property that references a method named getDomainData', function(){
      expect(typeof(routes.domains.info)).toBe('function');
      expect(routes.domains.info.name).toBe('getDomainData');
    });

    it('should call send with argument docs', function(){
      var req = {
            body: { name: 'test.com'  }
          };
      var res = {
            send: function(req, res){ done = true; }
          };
      var done = false;
      spyOn(res, 'send').andCallThrough();
      runs(function(){
        routes.domains.info(req, res);
      });
      waitsFor(function() {
        return done;
      }, 'Send to be called', 750);
      runs(function(){
        expect(res.send).toHaveBeenCalled();
        expect(typeof(res.send.mostRecentCall.args[0])).toBe('object');
      });
    });

  });

  //nested describe for domain.attacks route
  describe('domains.attacks route', function() {

    it('should have a domains.attacks property that references a mehtod named getDomainAttacks', function(){
      expect(typeof(routes.domains.attacks)).toBe('function');
      expect(routes.domains.attacks.name).toBe('getDomainAttacks');
    });

    it('should call send with argument docs', function(){
      var req = {
            body: { name: 'test.com'  }
          };
      var res = {
            send: function(req, res){ done = true; }
          };
      var done = false;
      spyOn(res, 'send').andCallThrough();
      runs(function(){
        routes.domains.info(req, res);
      });
      waitsFor(function() {
        return done;
      }, 'Send to be called', 750);
      runs(function(){
        expect(res.send).toHaveBeenCalled();
        expect(typeof(res.send.mostRecentCall.args[0])).toBe('object');
      });
    });
  });
});
