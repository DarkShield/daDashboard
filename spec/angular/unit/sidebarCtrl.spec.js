//
// spec/angular/unit/sidebarCtrl.spec.js
//
var domainStatic = { name: 'test.com', selected: '', requestData: {}};

describe('Unit: Testing Controllers', function() {
  describe('Sidebar Controller:', function() {
    var ctrl, scope, service;

    beforeEach(angular.mock.module('App'));
    beforeEach(angular.mock.module('App.Controllers'));
    
    beforeEach(angular.mock.inject(function($controller, $rootScope, $httpBackend, domainService) {
      scope = $rootScope.$new();

      service = domainService;

      httpBackend = $httpBackend;

      domain = domainStatic;
     
      //Create spies for domainService functions 
      spyOn(service, 'getDomains');//.andCallThrough();
      spyOn(service, 'getRequestData');//.andCallThrough();
      spyOn(service, 'getSelectedSite');//.andCallThrough();

      //httpBackend.expectGET('/domains').respond(domain);
      //httpBackend.expectPOST('/domain/info').respond(domain);
      //httpBackend.expectPOST('/domain/attacks').respond(domain);

      ctrl = $controller('SidebarCtrl', {
        $scope: scope,
        domainService: service
      });
    }));

    it('should have a SidebarCtrl controller', function() {
      expect(ctrl).not.toBe(undefined);
    });

    it('should have all the necessary parameters', function() {
      expect(scope.panelstates).not.toBe(undefined);
      expect(scope.setActivePanel).not.toBe(undefined);
    });

  });
});
