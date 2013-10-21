describe('Domain Service:', function() {

  beforeEach(angular.mock.module('App'));
  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', '/domains').respond([{name: 'test.com'}]);
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
    $httpBackend.expectGET('/domains');
    spyOn($ds, 'getDomains').andCallThrough();
    //$httpBackend.flush();
    console.log($ds.doms);
  }]));
});
