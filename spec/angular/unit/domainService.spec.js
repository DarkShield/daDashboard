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

  it('should be registered', function() {
    expect(dS).not.toBe(undefined);
  });

  it('should have a getDomains method', function(){
    expect(dS.getDomains).not.toBe(undefined);
    expect(typeof dS.getDomains).toBe('function');
  });

  it('should have a getRequestData method', function() {
    expect(dS.getRequestData).not.toBe(undefined);
    expect(typeof dS.getRequestData).toBe('function');
  });

  it('should have a getSelected site method',function(){
    expect(dS.getSelectedSite).not.toBe(undefined);
    expect(typeof dS.getSelectedSite).toBe('function');
  });

  describe('getDomains method', function(){
    it('should have a working getDomains function', function() {
      $httpBackend.expectGET('/domains');
      expect(dS.getDomains).not.toHaveBeenCalled();
      dS.getDomains();
      expect(dS.getDomains).toHaveBeenCalled();
      $httpBackend.flush();
      expect(dS.doms[0].name).toBe('test.com');
    });
  });
});
