describe('Domain Service:', function() {
  var dS = null;

  beforeEach(function(){
    angular.mock.module('App');
    angular.mock.module('App.Services');

    inject(function(domainService) {
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
    var domainsresponse = [
      {name: 'test.com'},
      {name: 'www.test.com'}];

    beforeEach(function(){
      inject(function($injector){
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('GET', '/domains').respond(domainsresponse);
      });
    });

    it('should add the response data into the doms array', function() {
      $httpBackend.expectGET('/domains');
      expect(dS.getDomains).not.toHaveBeenCalled();
      dS.getDomains();
      expect(dS.getDomains).toHaveBeenCalled();
      $httpBackend.flush();
      expect(dS.doms[0].name).toBe('test.com');
      expect(dS.doms[1].name).toBe('www.test.com');
    });
  });
});
