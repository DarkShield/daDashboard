//var domainStatic = { name: 'test.com', selected: '', requestData: {}};

describe('Drilldown Controller:', function() {
  var ctrl, scope;

  beforeEach(function(){
    angular.mock.module('App');
    angular.mock.module('App.drilldownCtrl');
    angular.mock.inject(function($controller, $rootScope, $httpBackend, domainService) {

      scope = $rootScope.$new();


      httpBackend = $httpBackend;

      //domain = domainStatic;

      spyOn(domainService, 'getDomains');
      spyOn(domainService, 'getRequestData');
      spyOn(domainService, 'getSelectedSite');//.andCallThrough();

      ctrl = $controller('drilldownCtrl', {
        $scope:  scope,
        domainService: domainService
      });
    });
  });

  it('should have a drilldownCtrl controller', function() {
    expect(ctrl).not.toBe(undefined);
  });

  it('should bring the domainService.doms array onto the scope as $scope.domains', function(){
    expect(scope.domains).not.toBe(undefined);
    expect(angular.isArray(scope.domains)).toBe(true);
  });

  it('should define drillsite as a reference to the currently selected site', function(){

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
