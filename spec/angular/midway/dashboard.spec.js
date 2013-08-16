describe('Midway: Testing Modules', function() {
  describe('App Module:', function() {
    
    var module = angular.module('dashboard');
  

    it('should be registered', function() {
      expect(module).not.to.equal(null);
    });

    describe('Dependencies:', function() {
      var deps;
      var hasModule = function(m) {
        return deps.indexOf(m) >= 0;
      };
      before(function() {
        deps = module.value('dashboard').requires;
      });

      it('should have $strap.directives as a dependency', function() {
        expect(hasModule('$strap.directives')).to.equal(true);
      });
    });
  });
});
