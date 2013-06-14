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

  });
});
