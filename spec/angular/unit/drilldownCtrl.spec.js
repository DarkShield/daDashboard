
var domainStatic = { name: 'test.com', selected: '', requestData: {}};

describe('Drilldown Controller:', function() {
  var ctrl, scope, service;

  beforeEach(angular.mock.module('App'));
  beforeEach(angular.mock.module('App.drilldownCtrl'));

  beforeEach(angular.mock.inject(function($controller, $rootScope, $httpBackend, domainService) {
    scope = $rootScope.$new();

    httpBackend = $httpBackend;

    domain = domainStatic;

    spyOn(domainService, 'getDomains');
    spyOn(domainService, 'getRequestData');
    spyOn(domainService, 'getSelectedSite');//.andCallThrough();

    ctrl = $controller('drilldownCtrl', {
      $scope: scope,
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
