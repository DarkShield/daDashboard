describe('Traffic Controller:', function() {
  var ctrl, scope, domainService;

  beforeEach(function(){
    angular.mock.module('App');
    angular.mock.module('App.trafficCtrl');
    angular.mock.inject(function($controller, $rootScope, domainService) {

      scope = $rootScope.$new();
      dS = domainService;
      domain = { name: 'test.com', selected: '', requestData: 'test', attacks: []};

      spyOn(domainService, 'getSelectedSite').andReturn(domain);

      ctrl = $controller('trafficCtrl', {
        $scope:  scope,
        domainService: domainService
      });
    });
  });

  it('should have a traffic controller', function() {
    expect(ctrl).not.toBe(undefined);
  });

  it('should bring the domainService.doms array onto the scope as $scope.domains', function(){
    expect(scope.domains).not.toBe(undefined);
    expect(angular.isArray(scope.domains)).toBe(true);
  });

  it('should should have a drillsite property that calls domainService.getSelectedSite', function(){
    expect(scope.drillsite.name).toBe('test.com');
    expect(dS.getSelectedSite).toHaveBeenCalled();
  });

  it('should have a filterby property', function(){
    expect(scope.filterby).not.toBe(undefined);
  });

  it('should have a details property that returns the currently selected sites requestdata',function(){
      expect(scope.details).toBe('test');
  });

  it('should have a enddate property that initializes to now', function(){
    expect(scope.enddate.constructor.name).toBe('Date');
  });

  it('should have a startdate property that initializes to 24 hours ago', function(){
    expect(scope.startdate.constructor.name).toBe('Date');
    //expect(scope.enddate - scope.startdate).toBe(86400000);
  });

  describe("requestrange object", function(){
    it('should be an object', function(){
      expect(typeof scope.requestrange).toBe('object');
    });

    it('should have a start property that is an ISO datestring', function(){
      expect(typeof scope.requestrange.start).toBe('string');
    });
  });

  //TODO improve the description here
  xit('should have all the necessary parameters', function() {
    expect(scope.sort).not.toBe(undefined);
    expect(scope.filterby).not.toBe(undefined);
    expect(scope.details).not.toBe(undefined);
    expect(scope.attacks).not.toBe(undefined);
    //expect(scope.displayFilter).not.toBe(undefined);
  });
});
