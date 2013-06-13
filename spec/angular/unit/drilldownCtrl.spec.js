//
// spec/angular/unit/drilldownCtrl.spec.js
//
describe('Unit: Testing Controllers', function() {
  describe('Drilldown Controller:', function() {
    var ctrl, scope, service;

    beforeEach(angular.mock.module('App'));
    beforeEach(angular.mock.module('App.DrilldownCtrl'));
    beforeEach(angular.mock.inject(function($controller, $rootScope, domainService) {
      scope = $rootScope.$new();
      service = domainService;
      ctrl = $controller('DrilldownCtrl', {
        $scope: scope,
        domainService: service
      });
    }));

    it('should have a DrilldownCtrl controller', function() {
      expect(ctrl).not.toBe(undefined);
    });

  });
});
