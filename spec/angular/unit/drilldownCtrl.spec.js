var domainStatic = { name: 'test.com', selected: '', requestData: {}};

describe('drilldown Controller:', function() {
  var ctrl, scope;

  beforeEach(angular.mock.module('App'));
  beforeEach(angular.mock.module('App.drilldownCtrl'));

  beforeEach(angular.mock.inject(function($controller, $rootScope, $httpBackend, domainService) {

    httpBackend = $httpBackend;

    domain = domainStatic;

    spyOn(domainService, 'getDomains');
    spyOn(domainService, 'getRequestData');
    spyOn(domainService, 'getSelectedSite');//.andCallThrough();

    ctrl = $controller('drilldownCtrl', {
      $scope:  $rootScope.$new(),
      domainService: domainService
    });
  }));

  it('should have a drilldownCtrl controller', function() {
    expect(ctrl).not.toBe(undefined);
  });

  xit('should have all the necessary parameters', function() {
    expect(scope.sort).not.toBe(undefined);
    expect(scope.filterby).not.toBe(undefined);
    expect(scope.details).not.toBe(undefined);
    expect(scope.attacks).not.toBe(undefined);
    //expect(scope.displayFilter).not.toBe(undefined);
  });
});
