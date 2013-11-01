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

    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.maxSize = 10;

    $scope.defaultItemsPerPage = $scope.itemsPerPage = 10;


    $scope.paginate = function(dataset) {
      $scope.pagedItems = [];
      $scope.totalItems = dataset.length;
      $scope.lastPage = Math.floor($scope.totalItems / $scope.itemsPerPage) + 1;
      var start = ($scope.currentPage * $scope.itemsPerPage) - $scope.itemsPerPage;
      var end = $scope.currentPage * $scope.itemsPerPage - 1;

      if($scope.currentPage === $scope.lastPage && $scope.totalItems % $scope.itemsPerPage !== 0){
        $scope.itemsPerPage = $scope.totalItems % $scope.itemsPerPage;
        end = start + $scope.itemsPerPage -1;
      }

      for(var i=start;i<=end;i++){
        $scope.pagedItems.push(dataset[i]);
      }
    };

    $scope.$on('Request.data', function(event, body) {
      $scope.items = body;
      $scope.paginate($scope.items);

    });

    $scope.$watch('currentPage', function(newValue, oldValue) {
      $scope.itemsPerPage = $scope.defaultItemsPerPage;
      if(newValue !== oldValue){
        $scope.paginate($filter('filter')($scope.items, $scope.query));
      }
    });

    $scope.$watch('query', function(newValue, oldValue){
      $scope.itemsPerPage = $scope.defaultItemsPerPage;
      if(newValue !== oldValue){
       $scope.paginate($filter('filter')($scope.items, $scope.query));
      }
    })


}]);
