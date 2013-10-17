angular.module('App.SidebarCtrl', [])

  .controller('SidebarCtrl',['$scope', 'domainService', function($scope, domainService){
    $scope.domains = domainService.doms;
   
    $scope.getDomains = domainService.getDomains;

/*   $scope.$on( 'Domain.Update', function(event){
     $scope.domains = domainService.doms;
      if (!$scope.$$phase){
         $scope.$apply();
      }
   });*/

    $scope.getRequestData = domainService.getRequestData;

    $scope.getLastDay = domainService.getLastDay;

    $scope.test = function(){
      console.log(domainService.doms);
      console.log('scope '+ $scope.domains);
    };

    $scope.sites = {
      visible: false
    };

  }]);
