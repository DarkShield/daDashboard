var app = require('../app/server');

describe("app", function(){
  
  it("should be a function", function(){
    expect(typeof(app)).toBe('function');
  });

  it("should have a listen method", function(){
    expect(typeof(app.listen)).toBe('function');
  });

  it("should have a use method", function(){
    expect(typeof(app.use)).toBe('function');
  });

  it("should have a stack object", function(){
    expect(typeof(app.stack)).toBe('object');
  });

  it("should have a static route configured", function(){
    expect(typeof(app.stack[2].handle)).toBe('function');
    expect(app.stack[2].handle.name).toBe('staticMiddleware');
  });

  it("should have bodyparser endabled", function(){
    expect(typeof(app.stack[3].handle)).toBe('function');
    expect(app.stack[3].handle.name).toBe('bodyParser');	    
  });

  it("should have cookieParser endabled", function(){
    expect(typeof(app.stack[4].handle)).toBe('function');
    expect(app.stack[4].handle.name).toBe('cookieParser');
  });

  it("should have session endabled", function(){
    expect(typeof(app.stack[5].handle)).toBe('function');
    expect(app.stack[5].handle.name).toBe('session');
  });

  it("should have router enabled", function(){
    expect(typeof(app.routes)).toBe('object');
    var routes = 0;
    for (item in app.routes){
      routes = routes + 1;
    }
    expect(routes).not.toBe(0);
  });

  it("should have a GET route to  /domains that calls the getDomains function", function(){
    expect(app.routes.get[0].path).toBe('/domains');
    expect(app.routes.get[0].callbacks[0].name).toBe('loadUser');
    expect(app.routes.get[0].callbacks[1].name).toBe('getDomains');
  });
  
  it("should have a GET route to  /login that calls the loginpage function", function(){
    expect(app.routes.get[1].path).toBe('/login');
    expect(app.routes.get[1].callbacks[0].name).toBe('loginpage');
  });

  it("should have a GET route to  /signup that calls the loginpage function", function(){
    expect(app.routes.get[2].path).toBe('/signup');
    expect(app.routes.get[2].callbacks[0].name).toBe('signuppage');
  });

  it("should have a GET route to  /home that calls the loginpage function", function(){
    expect(app.routes.get[3].path).toBe('/home');
    expect(app.routes.get[3].callbacks[0].name).toBe('loadUser');
    expect(app.routes.get[3].callbacks[1].name).toBe('homePage');
  });

  it("should have a POST route to /signup that calls the addAccount function", function(){
    expect(app.routes.post[0].path).toBe('/signup');
    expect(app.routes.post[0].callbacks[0].name).toBe('addAccount');
  });

  it("should have a POST route to /login that calls the authenticate function", function(){
    expect(app.routes.post[1].path).toBe('/login');
    expect(app.routes.post[1].callbacks[0].name).toBe('authenticate');
  });

  it("should have a POST route to /domains/info that calls the getDomainData function", function(){
    expect(app.routes.post[2].path).toBe('/domains/info');
    expect(app.routes.post[2].callbacks[0].name).toBe('loadUser');
    expect(app.routes.post[2].callbacks[1].name).toBe('getDomainData');
  });

  it("should have a POST route to /domains/attacks that calls the getDomainAttacks function", function(){
    expect(app.routes.post[3].path).toBe('/domains/attacks');
    expect(app.routes.post[3].callbacks[0].name).toBe('loadUser');
    expect(app.routes.post[3].callbacks[1].name).toBe('getDomainAttacks');

  });
});
