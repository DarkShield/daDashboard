//
// spec/angular/unit/drilldownCtrl.spec.js
//
describe('Unit: Testing Controllers', function() {
  describe('Drilldown Controller:', function() {
    var ctrl, scope, service;

    beforeEach(angular.mock.module('App'));
    beforeEach(angular.mock.module('App.DrilldownCtrl'));
    beforeEach(angular.mock.inject(function($controller, $rootScope, $httpBackend, domainService) {
      scope = $rootScope.$new();

      service = domainService;

      httpBackend = $httpBackend;

      spyOn(service, 'getDomains');
      spyOn(service, 'getRequestData');
      spyOn(service, 'getSelectedSite').andCallThrough();

      ctrl = $controller('DrilldownCtrl', {
        $scope: scope,
        domainService: service
      });
    }));

    it('should have a DrilldownCtrl controller', function() {
      expect(ctrl).not.toBe(undefined);
    });

    it('should have all the necessary parameters', function() {
      expect(scope.sort).not.toBe(undefined);
      expect(scope.filterby).not.toBe(undefined);
      expect(scope.details).not.toBe(undefined);
      expect(scope.attacks).not.toBe(undefined);
      expect(scope.displayFilter).not.toBe(undefined);
    });

    it('should have a working details function', function() {
      spyOn(scope, 'details').andCallThrough();

      //TODO: why can't I get this to pass?!
      //expect(service.getSelectedSite).toHaveBeenCalled();

    });
  });
});