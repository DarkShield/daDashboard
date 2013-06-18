describe('Unit: Testing Modules', function() {
  describe('Dashboard  Module:', function() {
    
    /*beforeEach(function(){
      var App = angular.mock.module('dashboard')
    });

      it('should be registered', function() {
        expect(dashboard).not.toBe(null);
      });
    */

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

      it('should have $stap.directives as a dependency', function(){
        expect(hasModule('$strap.directives')).toBe(true);
      });

    });
  });
});
