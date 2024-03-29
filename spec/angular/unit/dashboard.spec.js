describe('Dashboard  Module:', function() {

  beforeEach(angular.mock.module('App'));

  it('should be registered', function() {
    expect(App).not.toBe(null);
  });

  describe("Dependencies", function(){
    var deps;
    var hasModule = function(m){
      return deps.indexOf(m) >= 0;
     };
     beforeEach(function(){
      deps = App.value('appName').requires;
     });

    it('should have ui.bootstrap as a dependency', function(){
      expect(hasModule('ui.bootstrap')).toBe(true);
    });

    it('should have App.Controllers as a dependency', function(){
      expect(hasModule('App.Controllers')).toBe(true);
    });

    it('should have App.Services as a dependency', function(){
      expect(hasModule('App.Services')).toBe(true);
    });
  });
});

