//
// test /unit/domainService.spec.js
//
describe('Unit: Testing Services', function() {
  describe('Domain Service:', function() {
    
    /*beforeEach(function(){
      var App = angular.mock.module('dashboard');
    });*/

    beforeEach(angular.mock.module('App'));

    it('should contain a domainService service', inject(function(domainService) {
      expect(domainService).not.toBe(undefined);
    }));

    it('should have a domainService service with all its functions', inject(['domainService', function($ds) {
      expect($ds.getDomains).not.toBe(undefined);
      expect($ds.getRequestData).not.toBe(undefined);
      expect($ds.getSelectedSite).not.toBe(undefined);
    }]));

  });
});
