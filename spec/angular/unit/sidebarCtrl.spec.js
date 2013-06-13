//
// spec/angular/unit/sidebarCtrl.spec.js
//
describe('Unit: Testing Controllers', function() {
  describe('sidebarCtrl', function() {

    beforeEach(function() {
      var App = angular.mock.module('dashboard');
    });

    beforeEach(angular.mock.inject(function($rootScope, $controller) {
      this.scope = $rootScope.$new();
      $controller('sidebarCtrl', {
        $scope: this.scope
      });
    }));

    it('should have a sidebarCtrl controller', function() {
      expect(App.sidebarCtrl).not.toBe(undefined);
      console.log(JSON.stringify(App));
      console.log(App.sidebarCtrl);
    });

    //TODO: figure out how to test if controller is functional

  });
});
