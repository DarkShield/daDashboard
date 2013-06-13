//
// test /unit/domainService.spec.js
//
describe('Unit: Testing Services', function() {
  describe('Domain Service:', function() {
    
    beforeEach(function(){
      var App = angular.mock.module('dashboard');
    });

    it('should contain a domainService service', inject(function(domainService) {
      expect(domainService).not.toBe(null);
    }));

    it('should have a domainService service with all its functions', inject(['domainService', function($ds) {
      expect($ds.getDomains).not.toBe(null);
      expect($ds.getRequestData).not.toBe(null);
      expect($ds.getSelectedSite).not.toBe(null);
    }]));

  });
});
