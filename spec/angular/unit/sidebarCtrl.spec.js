//
// spec/angular/unit/sidebarCtrl.spec.js
//
describe('Unit: Testing Controllers', function() {
  describe('Sidebar Controller:', function() {
    var ctrl, scope, service;

    beforeEach(angular.mock.module('App'));
    beforeEach(angular.mock.module('App.SidebarCtrl'));
    beforeEach(angular.mock.inject(function($controller, $rootScope, domainService) {
      scope = $rootScope.$new();
      service = domainService;
      ctrl = $controller('SidebarCtrl', {
        $scope: scope,
        domainService: service
      });
    }));

    it('should have a SidebarCtrl controller', function() {
      expect(ctrl).not.toBe(undefined);
    });

    it('should have all the necessary parameters', function() {
      expect(scope.domains).not.toBe(undefined);
      expect(scope.getDomains).not.toBe(undefined);
      expect(scope.getRequestData).not.toBe(undefined);
      expect(scope.test).not.toBe(undefined);
      expect(scope.sites).not.toBe(undefined);
      expect(scope.select).not.toBe(undefined);
    });

  });
});
