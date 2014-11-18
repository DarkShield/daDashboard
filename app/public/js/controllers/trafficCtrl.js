angular.module('App.Controllers')

  .controller('trafficCtrl',['$scope', '$filter', 'domainService', 'paginationService', 'trafficService', function($scope, $filter, domainService, paginationService, trafficService) {

    $scope.selectedsite = [];
    $scope.attackview = [];
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

    $scope = paginationService.init($scope);

    $scope.getDomains = domainService.fetchDomains;

    $scope.domains = domainService.getDomains;

    $scope.getRequestData = function(){
      trafficService.getRange($scope.requestrange);
    };

    $scope.toggleAttack = function(item){
      trafficService.toggleAttack(item._id, item.attack);
      item.attack = (item.attack === 'false') ? 'true' : 'false'
    };

    $scope.toggleBlock = function(item) {
      if (item.blocked === undefined){
        item.blocked = false;
      }
      if (item.blocked === false){
        trafficService.toggleBlock(item.remoteIP, item.headers.host);
        item.blocked = true;
      }
    };

    $scope.showButtonDisplay = function(rowstate){
      return (rowstate) ? 'Hide' : 'Show'
    };

    $scope.markButtonDisplay = function(item){
      return (item && item.attack === 'true') ? 'Un-Mark as Attack' : 'Mark as Attack'
    };

    $scope.blockButtonDisplay = function(item){
      //return (item.blocked === true) ? 'Unblock' : 'Block'
      return 'Block'
    };

    $scope.siteDisplay = function(){
      return ($scope.selectedsite.length === 0) ? 'All Sites' : $scope.selectedsite
    };

    $scope.attackDisplay = function(){
      return ($scope.attackview.length === 0) ? 'All Traffic' : 'Attacks'
    };

    $scope.getPagedItems = function(){
      if($scope.items !== trafficService.requests){
        $scope.items = trafficService.requests;
        $scope.applyFilter();
      }
      return $scope.pagedItems
    };

    //Pagination and sorting
    $scope.applyFilter = function(){
      var domainfilter = $filter('filter')($scope.items, $scope.selectedsite);
      var attackfilter = $filter('filter')(domainfilter, $scope.attackview);
      var searchfilter = $filter('filter')(attackfilter, $scope.query);
      $scope.pagedItems = paginationService.paginate(searchfilter, $scope);
    };

    $scope.selectAll = function(type){
      $scope.itemsPerPage = $scope.defaultItemsPerPage;
      $scope[type] = [];
      $scope.applyFilter();
    };

    $scope.pickDomain = function(domain){
      $scope.selectedsite = domain;
      $scope.applyFilter();
    };

    $scope.showAttacks = function(){
      $scope.attackview = {attack: 'true'};
      $scope.applyFilter();
    };

    $scope.$watch('currentPage', function(newValue, oldValue) {
      $scope.itemsPerPage = $scope.defaultItemsPerPage;
      if(newValue !== oldValue){
        $scope.applyFilter();
      }
    });

    $scope.$watch('query', function(newValue, oldValue){
      $scope.itemsPerPage = $scope.defaultItemsPerPage;
      if(newValue !== oldValue){
        $scope.applyFilter();
      }
    })
}]);