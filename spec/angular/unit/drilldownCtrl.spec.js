//
// spec/angular/unit/drilldownCtrl.spec.js
//
describe('Unit: Testing Controllers', function() {
  describe('Drilldown Controller:', function() {
    
    beforeEach(function(){
      var App = angular.mock.module('dashboard');
    });

    it('should have a drilldownCtrl controller', function() {
      expect(App.drilldownCtrl).not.toBe(undefined);
    });

    //TODO: figure out how to test if controller is functional

  });
});
