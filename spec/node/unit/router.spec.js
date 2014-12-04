var routes = require('../../../app/routes/router');
var mongoose = require('mongoose');

console.log(process.env.NODE_ENV === 'development')

if (process.env.NODE_ENV === 'development'){
  mongoose.connect('localhost', 'vicetest');
}
else {
  mongoose.connect('10.136.20.210', 'dashtest');
}

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

    it('should call sendfile with argument "./app/public/html/login.html"', function(){
      var req = {};
      var res = {
            sendfile: jasmine.createSpy('sendfile')
          };
      //spyOn(res, 'sendfile');
      routes.loginpage(req, res);
      expect(res.sendfile).toHaveBeenCalled();
      expect(res.sendfile).toHaveBeenCalledWith('./app/public/html/login.html');
    }); 
  });

  //nested describe for login route tests
  describe('login route', function(){
  
    it('should have a login property that references a method named authenticate', function(){
      expect(typeof(routes.login)).toBe('function');
      expect(routes.login.name).toBe('authenticate');
    });

    it('should call redirect with argument "/" when username and password are valid', function(){
      var req = {
            body: { username: 'test', password: 'test' },
            session: {user: null}
          };
      var res = {
            redirect: jasmine.createSpy('redirect')
          };
      spyOn(routes.User,'getAuthenticated');
      runs(function(){
        routes.login(req, res);
        routes.User.getAuthenticated.calls[0].args[2](null, {id:1234});
      });

      waitsFor(function() {
        return req.session.user;
      }, 'User should be set', 750);

      runs(function() {
        expect(res.redirect).toHaveBeenCalledWith('/');
      });
    });

    it('should call redirect with argument "./login" when user name and password are invalid', function(){
      var req = {
            body: { username: 'INVALID', password: 'INVALID' },
            session: { user: null }
          };
      var res = {
            redirect: jasmine.createSpy('redirect')
          };
      //spyOn(res, 'redirect');
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

  describe('signuppage', function(){
    var req = {},
        res = {sendfile:jasmine.createSpy('sendfile')};
    routes.signuppage(req, res);
    expect(res.sendfile).toHaveBeenCalledWith('./app/public/html/register.html');
  });

  //nested describe for signup route
  describe('signup route', function(){

    it('should have a signup property that references a method named addAccount', function(){
      expect(typeof(routes.signup)).toBe('function');
      expect(routes.signup.name).toBe('addAccount');
    });

    it('should redirect back to the signup page when passwords don\'t match', function(){
      var req = {
        body: {
          name : 'testy mctesterson',
          email : 'test@email.com',
          user : 'testuser',
          pass1: 'testpassword',
          pass2: 'testpassword123',
          sites: 'test.com, test2.com'
        }
      };
      var res = {
        redirect: jasmine.createSpy('redirect')
      };
      spyOn(routes.User,'addNewAccount');
      routes.signup(req, res);
      expect(res.redirect).toHaveBeenCalledWith('/signup');
      expect(routes.User.addNewAccount).not.toHaveBeenCalled();
    });

    it('should call send with the error, 400 when user is not created successfully', function(){
      var req = {
        body: {
          name : 'testy mctesterson',
          email : 'test@email.com',
          user : 'testuser',
          pass1: 'testpassword',
          pass2: 'testpassword',
          sites: 'test.com, test2.com'
        }
      };
      var res = {
        send: jasmine.createSpy('send')
      };
      spyOn(routes.User,'addNewAccount');

      routes.signup(req, res);
      routes.User.addNewAccount.calls[0].args[1]({error:'could not create user'});

      expect(res.send).toHaveBeenCalledWith('Could not create user, please retry.', 400);
    });

    it('should send and email to admins and redirect to login when an account is created', function(){
      var req = {
        body: {
          name : 'testy mctesterson',
          email : 'test@email.com',
          user : 'testuser',
          pass1: 'testpassword',
          pass2: 'testpassword',
          sites: 'test.com, test2.com'
        }
      };
      var res = {
        redirect: jasmine.createSpy('redirect')
      };
      spyOn(routes.User,'addNewAccount');
      spyOn(routes.EmailServer, 'send');
      spyOn(routes, 'buildAccountObj').andCallThrough();

      routes.signup(req, res);
      routes.User.addNewAccount.calls[0].args[1]();
      expect(routes.EmailServer.send).toHaveBeenCalled();
      routes.EmailServer.send.calls[0].args[1]('error', 'message');
      expect(res.redirect).toHaveBeenCalledWith('/login');
      expect(routes.buildAccountObj).toHaveBeenCalled();
    });

  });

  //nested describe for  logout route
  describe('logout route', function(){

    it('should destroy the session and redirect to login', function(){
      var req = {
        session: {
          destroy: jasmine.createSpy('destroy')
        }
      };
      var res = {
        redirect: jasmine.createSpy('redirect')
      };
      routes.logout(req, res);
      expect(req.session.destroy).toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith('/login');
    })

  });
  
  //nested describe for home route
  describe('home route', function(){
  
    it('should have a home property that references a method named homePage', function(){
      expect(typeof(routes.home)).toBe('function');
      expect(routes.home.name).toBe('homePage');
    });

    it('should call sendFile with argument "./routes/html/dashboard..html"', function(){
      var req = {};
      var res = {
            sendfile: jasmine.createSpy('sendfile')
          };
      //spyOn(res, 'sendfile');
      routes.home(req, res);
      expect(res.sendfile).toHaveBeenCalled();
      expect(res.sendfile).toHaveBeenCalledWith('./app/routes/html/dashboard.html');
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
            send: jasmine.createSpy('send')
          };
      //spyOn(res, 'send');
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
        body: {
          name: 'www.test.com'
        },
        session: {
          user: {
            sites: [{name: 'www.test.com'}
            ]
          }
        }
      };
      var res = {
            send: function(){ done = true; }
          };
      var done = false;
      spyOn(res, 'send').andCallThrough();
      runs(function(){
        routes.domains.info(req, res);
      });
      waitsFor(function() {
        return done;
      }, 'Send to be called', 1000);
      runs(function(){
        expect(res.send).toHaveBeenCalled();
        expect(typeof(res.send.mostRecentCall.args[0])).toBe('string');
      });
    });

  });

  //nested describe for domain.attacks route
  describe('domains.attacks route', function() {
    var req = {
      body: {
        name: 'www.test.com'
      },
      session: {
        user: {
          sites: [{name: 'www.test.com'}
          ]
        }
      }
    };
    var res = {
      send:jasmine.createSpy('send')
    };
    var doc = {doc:'thisisadoc'}
    beforeEach(function(){
      spyOn(routes.RequestStore, 'find');
      routes.domains.attacks(req, res);
    });

    it('should query the db with the provided domain', function(){
      expect(routes.RequestStore.find.calls[0].args[0]).toEqual({'headers.host': 'www.test.com', 'attack': 'true'})
    });

    it('should respond with the result documents', function(){
      routes.RequestStore.find.calls[0].args[1](null, doc);
      expect(res.send).toHaveBeenCalledWith(doc);
    });
  });

  describe('domains.info.lastday', function(){
    var req = {
      body: {
        name: 'www.test.com'
      },
      session: {
        user: {
          sites: [{name: 'www.test.com'}
          ]
        }
      }
    };
    var res = {
      send:jasmine.createSpy('send')
    };
    var docs = {doc:'testdoc'};
    beforeEach(function(){
      spyOn(routes.RequestStore, 'find');
      routes.domains.info.lastday(req, res);
    });

    it('should should query the db for the last24 for a domain', function(){
      expect(routes.RequestStore.find).toHaveBeenCalled();
    });

    it('should respond with the returned documents', function(){
      routes.RequestStore.find.calls[0].args[2](null, docs);
      expect(res.send).toHaveBeenCalledWith(docs);
    });
  });

  describe('traffic route', function(){
    var req = {
      session:{
        user:{
          sites:['www.test.com']
        }
      },
      body:{
        name:'www.test.com'
      }
    };
    var res = {
    send:jasmine.createSpy('send')
    };
    var doc = {doc:'thisisadoc'}
    beforeEach(function(){
      spyOn(routes.RequestStore, 'find');
      routes.traffic(req, res);
    });

    it('should query the db for a range specified by the user', function(){
        console.log('this test needs improvment');
        expect(routes.RequestStore.find).toHaveBeenCalled();
    });

    it('should respond with the documents', function(){
        routes.RequestStore.find.calls[0].args[1](null, doc);
        expect(res.send).toHaveBeenCalledWith(doc);
    });
  });

  describe('toggleAttack route', function(){
    var req = {
      session:{
        user:{
          sites:[{name: 'www.test.com'}]
        }
      },
      body:{
        id: 1234
      }
    };
    var res = {
      send:jasmine.createSpy('send')
    };
    var doc = {doc:'thisisadoc'};

    beforeEach(function(){
      spyOn(routes.RequestStore, 'update');
      spyOn(routes.RequestStore, 'getHostByID');
      spyOn(routes.EmailServer, 'send');

    });

    it('should update the db with a properly configured object (true case)', function(){
      req.body.attack = 'true';
      routes.toggleAttack(req, res);
      expect(routes.RequestStore.getHostByID).toHaveBeenCalled();
      routes.RequestStore.getHostByID.calls[0].args[1](undefined, {headers: {host: 'www.test.com'}});
      expect(routes.RequestStore.update).toHaveBeenCalled();
      expect(routes.RequestStore.update.calls[0].args[1].attack).toBe(false);

    });
    it('should update the db with a properly configured object (false case)', function(){
      req.body.attack = 'false';
      routes.toggleAttack(req, res);
      expect(routes.RequestStore.getHostByID).toHaveBeenCalled();
      routes.RequestStore.getHostByID.calls[0].args[1](undefined, {headers: {host: 'www.test.com'}});
      expect(routes.RequestStore.update).toHaveBeenCalled();
      expect(routes.RequestStore.update.calls[0].args[1].attack).toBe(true);
    });

    it('should send an email with the correct info (true case)', function(){
      req.body.attack = 'true';
      routes.toggleAttack(req, res);
      expect(routes.RequestStore.getHostByID).toHaveBeenCalled();
      routes.RequestStore.getHostByID.calls[0].args[1](undefined, {headers: {host: 'www.test.com'}});
      expect(routes.EmailServer.send).toHaveBeenCalled();
      expect(routes.EmailServer.send.calls[0].args[0].subject).toBe('Missed Attack');
    });

    it('should send an email with the correct info (false case)', function(){
      req.body.attack = 'false';
      routes.toggleAttack(req, res);
      expect(routes.RequestStore.getHostByID).toHaveBeenCalled();
      routes.RequestStore.getHostByID.calls[0].args[1](undefined, {headers: {host: 'www.test.com'}});
      expect(routes.EmailServer.send).toHaveBeenCalled();
      expect(routes.EmailServer.send.calls[0].args[0].subject).toBe('False Positive');
    });

    it('should respond with any doc returned by the update', function(){
      req.body.attack = 'false';
      routes.toggleAttack(req, res);
      expect(routes.RequestStore.getHostByID).toHaveBeenCalled();
      routes.RequestStore.getHostByID.calls[0].args[1](undefined, {headers: {host: 'www.test.com'}});
      routes.RequestStore.update.calls[0].args[2](null, doc);
      expect(res.send).toHaveBeenCalledWith(200);
      routes.EmailServer.send.calls[0].args[1](null,'test');
    });

  });

  describe('toggleBlock route', function() {
    var req,
        res;
    beforeEach(function() {
      res = {
        send: jasmine.createSpy('send')
      };
      req = {
        body: {
          ip: '1.2.3.4',
          host: 'www.mattjay.com'
        },
        session: {
          user: {
            sites: [{name: 'www.mattjay.com'}
            ]
          }
        }
      };
      spyOn(routes.Host, 'blockHostIP');
    });

    it('should call blockHostIP with the correct arguments when the host is owned by the user', function(){
        expect(routes.Host.blockHostIP).not.toHaveBeenCalled();
        routes.toggleBlock(req, res);
        expect(routes.Host.blockHostIP).toHaveBeenCalled();
        expect(routes.Host.blockHostIP.calls[0].args[0]).toEqual('wwwmattjaycom');
        expect(routes.Host.blockHostIP.calls[0].args[1]).toEqual('1.2.3.4');
        expect(typeof(routes.Host.blockHostIP.calls[0].args[2])).toEqual('function');
    });

    it('should not call blockHostIP when the host is not owned by the user', function(){
      req.session.user.sites = [];
      expect(routes.Host.blockHostIP).not.toHaveBeenCalled();
      routes.toggleBlock(req, res);
      expect(routes.Host.blockHostIP).not.toHaveBeenCalled();
    });

    describe('respond function', function(){

      it('should say that it has blocked the host when a record is affected', function(){
        routes.toggleBlock(req, res);
        expect(routes.Host.blockHostIP).toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
        routes.Host.blockHostIP.calls[0].args[2](null,{},1);
        expect(res.send).toHaveBeenCalledWith({blocked: true});
      });

      it('should say that it has not blocked the host when a record is not affected',function(){
        routes.toggleBlock(req, res);
        expect(routes.Host.blockHostIP).toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
        routes.Host.blockHostIP.calls[0].args[2](null,{},0);
        expect(res.send).toHaveBeenCalledWith({blocked: false});
      });

      it('should say that it has not blocked the host wehen there was a db error', function(){
        routes.toggleBlock(req, res);
        expect(routes.Host.blockHostIP).toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
        routes.Host.blockHostIP.calls[0].args[2]({msg:'errortest'},null,null);
        expect(res.send).toHaveBeenCalledWith({blocked: false});
      })
    });
  });

  setTimeout(function() {
    console.log('disconnect');
    mongoose.disconnect();
  }, 4000);

});