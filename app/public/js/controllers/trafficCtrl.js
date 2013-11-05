angular.module('App.trafficCtrl', [])

  .controller('trafficCtrl',['$scope', '$filter', 'domainService', function($scope, $filter, domainService) {

    $scope.domains = domainService.doms;

    $scope.getDomains = domainService.getDomains;

    $scope.drillsite = domainService.getSelectedSite();

    $scope.filterby ='';

    $scope.showAttacks = '';

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

    //Pagination and sorting
    $scope.pagedItems = [];
    $scope.items = [];

    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.maxSize = 5;

    $scope.defaultItemsPerPage = $scope.itemsPerPage = 10;


    $scope.paginate = function(dataset) {
      $scope.pagedItems = [];
      $scope.totalItems = dataset.length;
      $scope.lastPage = Math.ceil($scope.totalItems / $scope.itemsPerPage);
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

    $scope.selectAll = function(){
      $scope.itemsPerPage = $scope.defaultItemsPerPage;
      $scope.showAttacks = '';
      $scope.paginate($scope.items);
    };

    $scope.pickDomain = function(domain){
      $scope.drillsite = domain;
      $scope.paginate($filter('filter')($scope.items, domain));
    };

    $scope.filterAttacks = function(){
      $scope.showAttacks = 'true';
      $scope.paginate($filter('filter')($scope.items, $scope.showAttacks));
    };

    $scope.$on('Request.data', function(event, body) {
      $scope.items = body;
      $scope.paginate($scope.items);

    });

    $scope.$watch('currentPage', function(newValue, oldValue) {
      $scope.itemsPerPage = $scope.defaultItemsPerPage;
      if(newValue !== oldValue){
        var attackfilter = $filter('filter')($scope.items, $scope.showAttacks);
        var domainfilter = $filter('filter')(attackfilter, $scope.drillsite);
        $scope.paginate($filter('filter')(domainfilter, $scope.query));
      }
    });

    $scope.$watch('query', function(newValue, oldValue){
      $scope.itemsPerPage = $scope.defaultItemsPerPage;
      if(newValue !== oldValue){
       var attackfilter = $filter('filter')($scope.items, $scope.showAttacks);
       var domainfilter = $filter('filter')(attackfilter, $scope.drillsite);
       var searchfilter = $filter('filter')(domainfilter, $scope.query)
        $scope.paginate(searchfilter);
      }
    })


}]);
