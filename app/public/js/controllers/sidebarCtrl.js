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


    $scope.test = function(){
      console.log(domainService.doms);
      console.log('scope '+ $scope.domains);
    }

    $scope.sites = {
      visible: false
    };

    $scope.select = function(clickedsite){
      for (var key in $scope.domains){
        if ($scope.domains.hasOwnProperty(key)){
          $scope.domains[key].selected = '';
        }
      }
      clickedsite.selected = 'active';
      $scope.getRequestData(clickedsite);
    }


  }]);
