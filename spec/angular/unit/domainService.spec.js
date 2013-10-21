describe('Domain Service:', function() {
  var dS = null;
  beforeEach(function(){
    angular.mock.module('App');
    angular.mock.module('App.domainService');
    inject(function($injector, domainService) {
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', '/domains').respond([{name: 'test.com'}]);
      dS = domainService;
    });
    spyOn(dS, 'getDomains').andCallThrough();
  });

  it('should contain a domainService service', function() {
    expect(dS).not.toBe(undefined);
  });

  it('should have a domainService service with all its functions', function() {
    expect(dS.getDomains).not.toBe(undefined);
    expect(dS.getRequestData).not.toBe(undefined);
    expect(dS.getSelectedSite).not.toBe(undefined);
  });

  it('should have a working getDomains function', function() {
    $httpBackend.expectGET('/domains');
    expect(dS.getDomains).not.toHaveBeenCalled();
    dS.getDomains();
    expect(dS.getDomains).toHaveBeenCalled();
    $httpBackend.flush();
  });
});
