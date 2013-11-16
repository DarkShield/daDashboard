angular.module('App.trafficCtrl', [])

  .controller('trafficCtrl',['$scope', '$filter', 'domainService', function($scope, $filter, domainService) {

    $scope.domains = domainService.doms;
    $scope.getDomains = domainService.getDomains;
    $scope.drillsite = [];
    $scope.attackview = [];
    $scope.filterby ='';

    $scope.showButtonDisplay = function(rowstate){
      return (rowstate) ? 'Hide' : 'Show'
    }

    $scope.markButtonDisplay = function(item){
      return (item.attack === 'true') ? 'Un-Mark as Attack' : 'Mark as Attack'
    }

    $scope.toggleAttack = function(item){
      domainService.toggleAttack(item._id, item.attack);
      item.attack = (item.attack === 'false') ? 'true' : 'false'
    };

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

    $scope.siteDisplay = function(){
      return ($scope.drillsite.length === 0) ? 'All Sites' : $scope.drillsite
    };

    $scope.attackDisplay = function(){
      return ($scope.attackview.length === 0) ? 'All Traffic' : 'Attacks'
    };

    $scope.$on('Request.data', function(event, body) {
      $scope.items = body;
      $scope.paginate($scope.items);

    });

    $scope.$on('Domain.data', function(event, body){
      $scope.domains = body;
    });

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

    $scope.doFilter = function(){
      var domainfilter = $filter('filter')($scope.items, $scope.drillsite);
      var attackfilter = $filter('filter')(domainfilter, $scope.attackview);
      var searchfilter = $filter('filter')(attackfilter, $scope.query);
      $scope.paginate(searchfilter);
    };

    $scope.selectAll = function(type){
      $scope.itemsPerPage = $scope.defaultItemsPerPage;
      $scope[type] = [];
      $scope.doFilter();
    };

    $scope.pickDomain = function(domain){
      $scope.drillsite = domain;
      $scope.doFilter();
    };

    $scope.showAttacks = function(){
      $scope.attackview = {attack: 'true'};
      $scope.doFilter();
    };

    $scope.$watch('currentPage', function(newValue, oldValue) {
      $scope.itemsPerPage = $scope.defaultItemsPerPage;
      if(newValue !== oldValue){
        $scope.doFilter();
      }
    });

    $scope.$watch('query', function(newValue, oldValue){
      $scope.itemsPerPage = $scope.defaultItemsPerPage;
      if(newValue !== oldValue){
        $scope.doFilter();
      }
    })


}]);
