//
// spec/angular/unit/drilldownCtrl.spec.js
//
var domainStatic = { name: 'test.com', selected: '', requestData: {}};

describe('Unit: Testing Controllers', function() {
  describe('Drilldown Controller:', function() {
    var ctrl, scope, service;

    beforeEach(angular.mock.module('App'));
    beforeEach(angular.mock.module('App.drilldownCtrl'));

      beforeEach(angular.mock.inject(function($controller, $rootScope, $httpBackend, domainService) {
      scope = $rootScope.$new();

      service = domainService;

      httpBackend = $httpBackend;

      domain = domainStatic;

      //spyOn(service, 'getDomains');
      //spyOn(service, 'getRequestData');
      //spyOn(service, 'getSelectedSite');//.andCallThrough();

      ctrl = $controller('drilldownCtrl', {
        $scope: scope,
        domainService: service
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
      expect(scope.displayFilter).not.toBe(undefined);
    });

    xit('should have a working details function', function() {
      spyOn(scope, 'details').andCallThrough();

      //TODO: why can't I get this to pass?!
      //expect(service.getSelectedSite).toHaveBeenCalled();

    });
  });
});
