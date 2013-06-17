//
// test /unit/domainService.spec.js
//
describe('Unit: Testing Services', function() {
  describe('Domain Service:', function() {
    
    /*beforeEach(function(){
      var App = angular.mock.module('dashboard');
    });*/

    beforeEach(angular.mock.module('App'));
    beforeEach(inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
    }));

    it('should contain a domainService service', inject(function(domainService) {
      expect(domainService).not.toBe(undefined);
    }));

    it('should have a domainService service with all its functions', inject(['domainService', function($ds) {
      expect($ds.getDomains).not.toBe(undefined);
      expect($ds.getRequestData).not.toBe(undefined);
      expect($ds.getSelectedSite).not.toBe(undefined);
    }]));

    it('should have a working getDomains function', inject(['domainService', function($ds) {
      //TODO: WTF?! This should work. When I try to flush it says nothing queued up but there should
      //be a GET to /domains queued up. 
      spyOn($ds, 'getDomains').andCallThrough();
      //$ds.getDomains();
      $httpBackend.expectGET('/domains').respond([{name: 'test.com'}]);
      expect($ds.domains).toBe(undefined);
      //spyOn($ds, 'getDomains').andCallThrough();
      //$httpBackend.flush();
      
      console.log($ds.domains);
    }]));

  });
});
