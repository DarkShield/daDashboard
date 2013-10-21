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

    it('should have App.drilldownCtrl as a dependency', function(){
      expect(hasModule('App.drilldownCtrl')).toBe(true);
    });

    it('should have App.SidebarCtrl as a dependency', function(){
      expect(hasModule('App.SidebarCtrl')).toBe(true);
    });

    it('should have App.domainService as a dependency', function(){
      expect(hasModule('App.domainService')).toBe(true);
    });
  });
});

