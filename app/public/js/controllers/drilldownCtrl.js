angular.module('App.drilldownCtrl', [])

  .controller('drilldownCtrl',['$scope', '$filter', 'domainService', function($scope, $filter, domainService) {

    $scope.domains = domainService.doms;

    $scope.drillsite = domainService.getSelectedSite();

    $scope.filterby ='';

    $scope.enddate = new Date();

    $scope.startdate = (function(){
      var d = new Date();
      d.setHours(-24);
      return d;
    })();

    $scope.requestrange = {
      start: $scope.startdate.toISOString(),
      end: $scope.enddate.toISOString()
    };

    $scope.getRequestData = function(){
      domainService.getRange($scope.requestrange);
    };

    //TODO why does this need to initialize to Last Day when it isn't used in the template?
    $scope.range = 'Last Day';

    $scope.details = $scope.drillsite.requestData;

    //TODO are we pushing an attacks property onto the site object only after it has been attacked?
    $scope.attacks = function(){
      if (!$scope.drillsite.attacks){
         return 0;
      }
      else {
         return $scope.drillsite.attacks.length;
      }
    };

    //Pagination and sorting
    $scope.pagedItems = [];
    $scope.items = [];

    $scope.itemsPerPage = 2;
    $scope.maxSize = 10;
    $scope.currentPage = 1;
    $scope.totalItems = 0;

    $scope.populate = function(requestdata) { $scope.items = requestdata; };

    $scope.$on('Request.data', function(event, body) {
      $scope.populate(body);
      var start = ($scope.currentPage * $scope.itemsPerPage) - $scope.itemsPerPage;
      var end = $scope.currentPage * $scope.itemsPerPage -1;
      $scope.totalItems = body.length;
      for(var i=start;i<=end;i++){
        $scope.pagedItems.push(body[i]);
      }
    });

    $scope.$watch('currentPage', function(newValue, oldValue) {
      $scope.pagedItems = [];
      if(newValue !== oldValue){
        var start = (newValue * $scope.itemsPerPage) - $scope.itemsPerPage;
        var end = newValue * $scope.itemsPerPage - 1;
        for(var i=start;i<=end;i++){
          $scope.pagedItems.push($scope.items[i]);
        }
      }
    });


}]);
